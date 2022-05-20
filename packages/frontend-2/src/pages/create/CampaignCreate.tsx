import { Button, Form, Input, Select } from 'antd';
import { useAccount } from 'wagmi';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ORACLE_NODE_URL } from '../../config/appConfig';
import { DateManager } from '../../utils/time';
import { useCampaignFactory } from '../../hooks/useContracts';
import { BigNumber, ethers } from 'ethers';
import { CampaignCreatedEvent } from '../../generated/typechain/CampaignFactory';

const RANDOM_BYTES32 = '0x5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8';

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

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const [rewards, setRewards] = useState<Record<string, unknown>>({});
  const [today] = useState<DateManager>(new DateManager());
  const [simulating, setSimulating] = useState<boolean>(false);

  const campaignFactory = useCampaignFactory();
  const accountHook = useAccount();
  const navigate = useNavigate();

  const createCampaign = async (): Promise<void> => {
    const account = accountHook.data?.address;
    if (account === undefined) throw new Error('account undefined');
    const salt = ethers.utils.keccak256(ethers.utils.hashMessage(account + Date.now().toString()));

    // const tx = transactor(ethComponentsSettings, ethersContext?.signer);
    // if (tx === undefined) throw new Error('tx undefined');

    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    const ex = await campaignFactory.createCampaign(
      { sharesMerkleRoot: RANDOM_BYTES32, totalShares: BigNumber.from(0) },
      RANDOM_BYTES32,
      account,
      account,
      true,
      ethers.BigNumber.from(1000),
      salt
    );
    const txReceipt = await ex.wait();

    if (txReceipt.events === undefined) throw new Error('txReceipt.events undefined');
    const event = txReceipt.events.find((e) => e.event === 'CampaignCreated') as CampaignCreatedEvent;

    if (event === undefined) throw new Error('event undefined');
    if (event.args === undefined) throw new Error('event.args undefined');

    const campaignAddress = event.args.newCampaign;

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

    const rew = await (response.json() as Promise<Record<string, unknown>>);
    setRewards(rew);
    setSimulating(false);
  };

  const onSimulate = (values: CampaignFormValues): void => {
    if (!simulating) {
      void updateRewards(values);
    }
  };

  const onReset = (): void => {
    setRewards({});
    form.resetFields();
  };

  const onCreate = (): void => {
    console.log('create');
    void createCampaign();
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
          <Button type="primary" htmlType="submit" disabled={simulating}>
            {simulating ? 'Simulating...' : 'Simulate'}
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button htmlType="button" onClick={onCreate} disabled={Object.keys(rewards).length === 0}>
            Create
          </Button>
        </Form.Item>
      </Form>

      <div>
        <ul>
          {Object.entries(rewards).map((entry) => {
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
