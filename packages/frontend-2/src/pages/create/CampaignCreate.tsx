import { Button, DatePicker, Form, Input, Select } from 'antd';
// import { BigNumber, ethers } from 'ethers';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { toTimeStamp } from '../../utils/general';

import { ORACLE_NODE_URL } from '../../config/appConfig';
// import { CampaignCreatedEvent } from '../../generated/typechain/CampaignFactory';

// const RANDOM_BYTES32 = '0x5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8';

export interface ICampaignCreateProps {
  dum?: any;
}

const { Option } = Select;

interface CampaignFormValues {
  campaignType: string;
  repositoryOwner: string;
  repositoryName: string;
  fromDate: string;
  toDate: string;
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

  // const campaignFactoryContract = useAppContracts('CampaignFactory', ethersContext.chainId);
  // const navigate = useNavigate();

  // const createCampaign = async (): Promise<void> => {
  //   const account = ethersContext.account;
  //   if (account === undefined) throw new Error('account undefined');
  //   const salt = ethers.utils.keccak256(ethers.utils.hashMessage(account + Date.now().toString()));

  //   // const tx = transactor(ethComponentsSettings, ethersContext?.signer);
  //   // if (tx === undefined) throw new Error('tx undefined');

  //   if (campaignFactoryContract === undefined) throw new Error('campaignFactoryContract undefined');
  //   if (ethersContext === undefined) throw new Error('ethersContext undefined');
  //   if (ethersContext.account === undefined) throw new Error('ethersContext.account undefined');

  //   const ex = await campaignFactoryContract.createCampaign(
  //     { sharesMerkleRoot: RANDOM_BYTES32, totalShares: BigNumber.from(0) },
  //     RANDOM_BYTES32,
  //     account,
  //     account,
  //     true,
  //     ethers.BigNumber.from(1000),
  //     salt
  //   );
  //   const txReceipt = await ex.wait();

  //   if (txReceipt.events === undefined) throw new Error('txReceipt.events undefined');
  //   const event = txReceipt.events.find((e) => e.event === 'CampaignCreated') as CampaignCreatedEvent;

  //   if (event === undefined) throw new Error('event undefined');
  //   if (event.args === undefined) throw new Error('event.args undefined');

  //   const campaignAddress = event.args.newCampaign;

  //   navigate(`/campaign/${campaignAddress}`);
  // };

  const [form] = Form.useForm();

  const initialValues: CampaignFormValues = {
    campaignType: 'github',
    repositoryOwner: 'ethereum',
    repositoryName: 'go-ethereum',
    fromDate: '',
    toDate: '',
  };

  const getStrategyParams = (values: CampaignFormValues): RequestParams | undefined => {
    switch (values.campaignType) {
      case 'github':
        const start = toTimeStamp(values.fromDate);
        const end = toTimeStamp(values.toDate);
        return {
          execDate: end,
          strategyID: 'GH_PR_Weigthed',
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

  const updateRewards = async (values: CampaignFormValues): Promise<void> => {
    const reqParams = getStrategyParams(values);

    const response = await fetch(ORACLE_NODE_URL + '/campaign/simulateFromDetails', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqParams),
    });

    const rew = await (response.json() as Promise<Record<string, unknown>>);
    setRewards(rew);
  };

  const onSimulate = (values: CampaignFormValues): void => {
    void updateRewards(values);
  };

  const onReset = (): void => {
    setRewards({});
    form.resetFields();
  };

  const onCreate = (): void => {
    console.log('create');
    // void createCampaign();
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
        <Form.Item name="fromDate" label="Start counting on">
          <DatePicker />
        </Form.Item>
        <Form.Item name="toDate" label="Count up until">
          <DatePicker />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Simulate
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
