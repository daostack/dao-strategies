import { Button, DatePicker, Form, Input, Select } from 'antd';
import { RangeValue } from 'rc-picker/lib/interface';
import { Moment } from 'moment';
import { useAccount } from 'wagmi';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { DateManager } from '../../utils/time';
import { useCampaignFactory } from '../../hooks/useContracts';
import { CampaignCreateDetails, deployCampaign, simulateCampaign, SimulationResult } from '../campaign.support';
import { CHALLENGE_PERIOD, ORACLE_ADDRESS } from '../../config/appConfig';
import { CampaignUriDetails } from '@dao-strategies/core';

export interface ICampaignCreateProps {
  dum?: any;
}

const { Option } = Select;

const initialValues: CampaignFormValues = {
  campaignType: 'github',
  title: 'demo',
  description: '',
  repositoryURL: 'https://github.com/gershido/test-github-api',
  livePeriodChoice: '-3',
  guardian: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
};

export interface CampaignFormValues {
  title: string;
  description: string;
  campaignType: string;
  repositoryURL: string;
  livePeriodChoice: string;
  guardian: string;
}

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const [today] = useState<DateManager>(new DateManager());

  const [simulation, setSimulated] = useState<SimulationResult>({});
  const [simulating, setSimulating] = useState<boolean>(false);

  const [livePeriodCustom, setLivePeriodCustom] = useState<boolean>(false);

  // a local state to react to values changes
  const [formValues, setFormValues] = useState<CampaignFormValues>(initialValues);

  const campaignFactory = useCampaignFactory();
  const accountHook = useAccount();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const create = async (): Promise<void> => {
    const account = accountHook.data?.address;
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    const values = getFormValues();
    const details = simulation.details !== undefined ? simulation.details : strategyDetails();

    if (details === undefined) throw new Error();

    /** the address is not yet known */
    const otherDetails: CampaignCreateDetails = {
      title: values.title,
      description: values.description,
      guardian: values.guardian,
      oracle: ORACLE_ADDRESS,
      address: '',
      cancelDate: details.execDate + CHALLENGE_PERIOD,
    };

    /** if the campaign was not simulated it must be created first */
    const campaignAddress = await deployCampaign(campaignFactory, simulation.uri, otherDetails, details);

    navigate(`/campaign/${campaignAddress}`);
  };

  const getStartEnd = (values: CampaignFormValues): [number, number] => {
    const livePeriod = +values.livePeriodChoice;
    if (livePeriod === 0) {
      return [0, 0];
    } else {
      return livePeriod < 0
        ? [today.clone().addMonths(livePeriod).getTime(), today.getTime()]
        : [today.getTime(), today.clone().addMonths(livePeriod).getTime()];
    }
  };

  const getFormValues = (): CampaignFormValues => {
    return formValues;
  };

  const onValuesUpdated = (old: any, values: CampaignFormValues) => {
    setFormValues(values);
  };

  const getRepo = (values: CampaignFormValues): { owner: string; repo: string } => {
    const url = new URL(values.repositoryURL);
    const parts = url.pathname.split('/');
    return {
      owner: parts[1],
      repo: parts[2],
    };
  };

  const strategyDetails = (): CampaignUriDetails | undefined => {
    const values = getFormValues();
    if (values !== undefined && isLogged()) {
      const repo = getRepo(values);

      switch (values.campaignType) {
        case 'github':
          const [start, end] = getStartEnd(values);

          return {
            creator: logged() as string,
            nonce: 0,
            execDate: end,
            strategyID: 'GH_PRS_REACTIONS_WEIGHED',
            strategyParams: {
              repositories: [repo],
              timeRange: { start, end },
            },
          };
      }
    }

    return undefined;
  };

  const logged = (): string | undefined => {
    if (accountHook.data !== undefined && accountHook.data != null && accountHook.data.address !== undefined) {
      return accountHook.data.address;
    }
    return undefined;
  };

  const isLogged = (): boolean => {
    return logged() !== undefined;
  };

  const canBeSimulated = (): boolean => {
    const params = strategyDetails()?.strategyParams;
    return (
      params !== undefined && params.timeRange !== undefined && params.timeRange.start < today.getTime() && isLogged()
    );
  };

  const onCampaignTypeSelected = (value: string): void => {
    form.setFieldsValue({ campaignType: value });
  };

  const onLivePeriodSelected = (value: string): void => {
    if (value === '0') {
      setLivePeriodCustom(true);
    } else {
      setLivePeriodCustom(false);
    }
    form.setFieldsValue({ periodChoice: value });
  };

  const onRangePicker = (value: RangeValue<Moment>) => {
    console.log(value);
  };

  const updateRewards = async (values: CampaignFormValues): Promise<void> => {
    setSimulating(true);

    const details = strategyDetails();
    if (details === undefined) throw new Error();
    const sim = await simulateCampaign(details);

    setSimulated(sim);
    setSimulating(false);
  };

  const onSimulate = (): void => {
    if (!simulating) {
      void updateRewards(getFormValues());
    }
  };

  const onReset = (): void => {
    setSimulated({ uri: '', rewards: {} });
    form.resetFields();
  };

  const onCreate = (): void => {
    console.log('create');
    void create();
  };

  const canCreate = () => {
    return (canBeSimulated() ? isSimulated() : true) && isLogged();
  };

  const isSimulated = () => {
    return simulation.rewards !== undefined && Object.keys(simulation.rewards).length !== 0;
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  if (!isLogged()) {
    return <>please login</>;
  }

  return (
    <>
      <Link to="/">Back</Link>
      <br></br>
      <br></br>
      <Form {...layout} initialValues={initialValues} form={form} name="control-hooks" onValuesChange={onValuesUpdated}>
        <Form.Item name="campaignType" label="Type" rules={[{ required: true }]}>
          <Select onChange={onCampaignTypeSelected} allowClear>
            <Option value="github">Github</Option>
            <Option value="twitter">Twitter (coming soon)</Option>
          </Select>
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: false }]}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item name="guardian" label="Guardian" rules={[{ required: true }]}>
          <Input placeholder="0x...."></Input>
        </Form.Item>

        <Form.Item name="repositoryURL" label="Repository URL" rules={[{ required: true }]}>
          <Input placeholder="https://github.com/..."></Input>
        </Form.Item>

        {/* This portion is strategy-specific, it should be used to build the strategyParams, the execDate, 
            and a flag to determine if it makes sense for the strategy to be simulated up to now */}
        <>
          <Form.Item name="livePeriodChoice" label="Live period">
            <Select onChange={onLivePeriodSelected}>
              <Option value={'-3'}>Last 3 months</Option>
              <Option value={'-6'}>Last 6 months</Option>
              <Option value={'3'}>Next 3 months</Option>
              <Option value={'6'}>Next 6 months</Option>
              <Option value={'0'}>Custom</Option>
            </Select>
          </Form.Item>

          {livePeriodCustom ? (
            <Form.Item name="customRange" label="Custom Range">
              <DatePicker.RangePicker onChange={onRangePicker}></DatePicker.RangePicker>
            </Form.Item>
          ) : (
            <></>
          )}
        </>

        <Form.Item {...tailLayout}>
          {canBeSimulated() ? (
            <Button
              type={isSimulated() ? 'default' : 'primary'}
              onClick={() => onSimulate()}
              disabled={simulating || isSimulated()}>
              {simulating ? 'Simulating...' : isSimulated() ? 'Simulated' : 'Simulate'}
            </Button>
          ) : (
            <></>
          )}

          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type={isSimulated() ? 'primary' : 'default'} onClick={() => onCreate()} disabled={!canCreate()}>
            Create
          </Button>
        </Form.Item>
      </Form>

      <div>
        <ul>
          {simulation.rewards !== undefined ? (
            Object.entries(simulation.rewards).map((entry) => {
              return (
                <li key={entry[0]}>
                  <>
                    {entry[0]}: {entry[1]}
                  </>
                </li>
              );
            })
          ) : (
            <></>
          )}
        </ul>
      </div>
    </>
  );
};
