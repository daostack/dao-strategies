import { Button, Form, Input, Select } from 'antd';
import { useAccount } from 'wagmi';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { DateManager } from '../../utils/time';
import { useCampaignFactory } from '../../hooks/useContracts';
import {
  CampaignCreateDetails,
  createCampaign,
  LivePeriodChoice,
  simulateCampaign,
  SimulationParams,
  SimulationResult,
} from '../campaign.support';
import { CHALLENGE_PERIOD, ORACLE_ADDRESS } from '../../config/appConfig';

export interface ICampaignCreateProps {
  dum?: any;
}

const { Option } = Select;

export interface CampaignFormValues {
  title: string;
  description: string;
  campaignType: string;
  repositoryURL: string;
  livePeriodChoice: LivePeriodChoice;
  guardian: string;
}

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const [simulation, setSimulated] = useState<SimulationResult>({ uri: '', rewards: {} });
  const [today] = useState<DateManager>(new DateManager());
  const [simulating, setSimulating] = useState<boolean>(false);

  const campaignFactory = useCampaignFactory();
  const accountHook = useAccount();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const create = async (values: CampaignFormValues): Promise<void> => {
    const account = accountHook.data?.address;
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');
    if (simulation.params === undefined) throw new Error('simulation.params undefined');

    const otherDetails: CampaignCreateDetails = {
      title: values.title,
      description: values.description,
      guardian: values.guardian,
      oracle: ORACLE_ADDRESS,
      address: '',
      cancelDate: simulation.params.execDate + CHALLENGE_PERIOD,
    };

    const campaignAddress = await createCampaign(campaignFactory, simulation.uri, otherDetails, account);

    navigate(`/campaign/${campaignAddress}`);
  };

  const initialValues: CampaignFormValues = {
    campaignType: 'github',
    title: 'demo',
    description: '',
    repositoryURL: 'https://github.com/gershido/test-github-api',
    livePeriodChoice: LivePeriodChoice.Last2Months,
    guardian: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  };

  const getStartEnd = (values: CampaignFormValues): [number, number] => {
    switch (values.livePeriodChoice) {
      case LivePeriodChoice.Last2Months:
        return [today.clone().subtractMonths(2).getTime(), today.getTime()];
    }
  };

  const getRepo = (values: CampaignFormValues): { owner: string; repo: string } => {
    const url = new URL(values.repositoryURL);
    const parts = url.pathname.split('/');
    return {
      owner: parts[1],
      repo: parts[2],
    };
  };

  const getStrategyParams = (values: CampaignFormValues): SimulationParams | undefined => {
    const repo = getRepo(values);
    switch (values.campaignType) {
      case 'github':
        const [start, end] = getStartEnd(values);
        return {
          execDate: end,
          strategyID: 'GH_PRS_REACTIONS_WEIGHED',
          strategyParams: {
            repositories: [repo],
            timeRange: { start, end },
          },
        };
    }
    return undefined;
  };

  const onCampaignTypeSelected = (value: string): void => {
    form.setFieldsValue({ campaignType: value });
  };

  const onLivePeriodSelected = (value: string): void => {
    form.setFieldsValue({ periodChoice: value });
  };

  const updateRewards = async (values: CampaignFormValues): Promise<void> => {
    setSimulating(true);
    const params = getStrategyParams(values);
    if (params === undefined) throw new Error('params undefined');

    const sim = await simulateCampaign(params);

    setSimulated(sim);
    setSimulating(false);
  };

  const onSimulate = (values: CampaignFormValues): void => {
    if (!simulating) {
      void updateRewards(values);
    }
  };

  const onReset = (): void => {
    setSimulated({ uri: '', rewards: {} });
    form.resetFields();
  };

  const onCreate = (): void => {
    console.log('create');
    void create(form.getFieldsValue());
  };

  const isSimulated = () => {
    return Object.keys(simulation.rewards).length !== 0;
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <>
      <Link to="/">Back</Link>
      <br></br>
      <br></br>
      <Form {...layout} initialValues={initialValues} form={form} name="control-hooks" onFinish={onSimulate}>
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
        <Form.Item name="repositoryURL" label="Repository URL" rules={[{ required: true }]}>
          <Input placeholder="https://github.com/..."></Input>
        </Form.Item>
        <Form.Item name="guardian" label="Guardian" rules={[{ required: true }]}>
          <Input placeholder="0x...."></Input>
        </Form.Item>
        <Form.Item name="livePeriodChoice" label="Live period" rules={[{ required: true }]}>
          <Select onChange={onLivePeriodSelected}>
            <Option value={LivePeriodChoice.Last2Months}>Last 2 months</Option>
            <Option value="other">other (coming soon)</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type={isSimulated() ? 'default' : 'primary'} htmlType="submit" disabled={simulating || isSimulated()}>
            {simulating ? 'Simulating...' : isSimulated() ? 'Simulated' : 'Simulate'}
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button
            type={isSimulated() ? 'primary' : 'default'}
            htmlType="button"
            onClick={() => onCreate()}
            disabled={!isSimulated() || accountHook.data == null}>
            Create
          </Button>
        </Form.Item>
      </Form>

      <div>
        <ul>
          {Object.entries(simulation.rewards).map((entry) => {
            return (
              <li key={entry[0]}>
                <>
                  {entry[0]}: {entry[1]}
                </>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
