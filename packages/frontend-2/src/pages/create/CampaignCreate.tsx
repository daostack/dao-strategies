import { Button, Form, Input, Select } from 'antd';
import { useAccount } from 'wagmi';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ORACLE_NODE_URL } from '../../config/appConfig';
import { DateManager } from '../../utils/time';
import { useCampaignFactory } from '../../hooks/useContracts';
import { createCampaign } from './create';

export interface ICampaignCreateProps {
  dum?: any;
}

const { Option } = Select;

enum LivePeriodChoice {
  Last2Months = 'last-two-months',
}

interface CampaignFormValues {
  campaignType: string;
  repositoryOwner: string;
  repositoryName: string;
  livePeriodChoice: LivePeriodChoice;
}

interface RequestParams {
  execDate: number;
  strategyID: string;
  strategyParams: {
    repositories: Array<{ owner: string; repo: string }>;
    timeRange: { start: number; end: number };
  };
}

interface SimulationResult {
  uri: string;
  rewards: Record<string, unknown>;
}

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const [simulated, setSimulated] = useState<SimulationResult>({ uri: '', rewards: {} });
  const [today] = useState<DateManager>(new DateManager());
  const [simulating, setSimulating] = useState<boolean>(false);

  const campaignFactory = useCampaignFactory();
  const accountHook = useAccount();
  const navigate = useNavigate();

  const create = async (): Promise<void> => {
    const account = accountHook.data?.address;
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    const campaignAddress = await createCampaign(campaignFactory, account, simulated.uri);

    navigate(`/campaign/${campaignAddress}`);
  };

  const [form] = Form.useForm();

  const initialValues: CampaignFormValues = {
    campaignType: 'github',
    repositoryOwner: 'gershido',
    repositoryName: 'test-github-api',
    livePeriodChoice: LivePeriodChoice.Last2Months,
  };

  const getStartEnd = (values: CampaignFormValues): [number, number] => {
    switch (values.livePeriodChoice) {
      case LivePeriodChoice.Last2Months:
        return [today.clone().subtractMonths(2).getTime(), today.getTime()];
    }
  };

  const getStrategyParams = (values: CampaignFormValues): RequestParams | undefined => {
    switch (values.campaignType) {
      case 'github':
        const [start, end] = getStartEnd(values);
        return {
          execDate: end,
          strategyID: 'GH_PRS_REACTIONS_WEIGHED',
          strategyParams: {
            repositories: [{ owner: values.repositoryOwner, repo: values.repositoryName }],
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
    const reqParams = getStrategyParams(values);

    const response = await fetch(ORACLE_NODE_URL + '/campaign/simulateFromDetails', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqParams),
      credentials: 'include',
    });

    const sim = await (response.json() as Promise<SimulationResult>);
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
    void create();
  };

  const isSimulated = () => {
    return Object.keys(simulated.rewards).length !== 0;
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
        <Form.Item name="repositoryOwner" label="Repository Owner" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="repositoryName" label="Repository Name" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="livePeriodChoice" label="Live period">
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
            onClick={onCreate}
            disabled={!isSimulated() || accountHook.data == null}>
            Create
          </Button>
        </Form.Item>
      </Form>

      <div>
        <ul>
          {Object.entries(simulated.rewards).map((entry) => {
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
