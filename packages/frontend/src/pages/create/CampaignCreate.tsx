import { Box, Button, DateInput, FormField } from 'grommet';
import { useAccount } from 'wagmi';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DateManager } from '../../utils/time';
import { useCampaignFactory } from '../../hooks/useContracts';
import { CampaignCreateDetails, deployCampaign, simulateCampaign, SimulationResult } from '../campaign.support';
import { CHALLENGE_PERIOD, ORACLE_ADDRESS } from '../../config/appConfig';
import { CampaignUriDetails } from '@dao-strategies/core';
import { RouteNames } from '../MainPage';
import { AppButton, AppForm, AppInput, AppSelect, AppTextArea } from '../../components/styles/BasicElements';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { FormProgress } from './FormProgress';

export interface ICampaignCreateProps {
  dum?: any;
}

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
  const { account, connect } = useLoggedUser();

  const [today] = useState<DateManager>(new DateManager());
  const [pageIx, setPageIx] = useState<number>(0);

  const [simulation, setSimulated] = useState<SimulationResult>({});
  const [simulating, setSimulating] = useState<boolean>(false);

  const [livePeriodCustom, setLivePeriodCustom] = useState<boolean>(false);

  // a local state to react to values changes
  const [formValues, setFormValues] = useState<CampaignFormValues>(initialValues);

  const campaignFactory = useCampaignFactory();
  const accountHook = useAccount();
  const navigate = useNavigate();

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

    navigate(RouteNames.Campaign(campaignAddress));
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

  const onValuesUpdated = (values: CampaignFormValues) => {
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
            creator: account as string,
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

  const isLogged = (): boolean => {
    return true; //account !== undefined;
  };

  const canBeSimulated = (): boolean => {
    const params = strategyDetails()?.strategyParams;
    return (
      params !== undefined && params.timeRange !== undefined && params.timeRange.start < today.getTime() && isLogged()
    );
  };

  const onCampaignTypeSelected = (value: string): void => {
    // form.setFieldsValue({ campaignType: value });
  };

  const onLivePeriodSelected = (value: string): void => {
    if (value === '0') {
      setLivePeriodCustom(true);
    } else {
      setLivePeriodCustom(false);
    }
    // form.setFieldsValue({ periodChoice: value });
  };

  const onRangePicker = (value: any) => {
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
    // form.resetFields();
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

  const pages: React.ReactNode[] = [
    <>
      <Box>
        <div>
          <FormField name="title" label="Campaign Name" rules={[{ required: true }]}>
            <AppInput></AppInput>
          </FormField>
          <FormField name="guardian" label="Guardian Address" rules={[{ required: true }]}>
            <AppInput placeholder="0x...."></AppInput>
          </FormField>
          <FormField name="asset" label="Asset" rules={[{ required: true }]}>
            <AppSelect value="ether" style={{ width: '100%' }} options={['ether', 'DAI']}></AppSelect>
          </FormField>
        </div>
        <div>
          <FormField name="description" label="Description" rules={[{ required: false }]}>
            <AppTextArea></AppTextArea>
          </FormField>
        </div>
      </Box>
    </>,
    <>
      {/* This portion is strategy-specific, it should be used to build the strategyParams, the execDate, 
            and a flag to determine if it makes sense for the strategy to be simulated up to now */}
      <>
        <FormField name="livePeriodChoice" label="Live period">
          <AppSelect value="small" onChange={onLivePeriodSelected} options={['small', 'medium', 'large']}></AppSelect>
        </FormField>

        {livePeriodCustom ? (
          <FormField name="customRange" label="Custom Range">
            <DateInput onChange={onRangePicker}></DateInput>
          </FormField>
        ) : (
          <>
            {' '}
            <FormField {...tailLayout}>
              {canBeSimulated() ? (
                <Button primary={isSimulated()} onClick={() => onSimulate()} disabled={simulating || isSimulated()}>
                  {simulating ? 'Simulating...' : isSimulated() ? 'Simulated' : 'Simulate'}
                </Button>
              ) : (
                <></>
              )}

              <Button onClick={onReset}>Reset</Button>
              <Button primary={isSimulated()} onClick={() => onCreate()} disabled={!canCreate()}>
                Create
              </Button>
            </FormField>
          </>
        )}
      </>
    </>,
    <>4</>,
  ];

  return (
    <Box>
      {!isLogged() ? (
        <>
          <p>Please login before creating the campaign</p>
          <AppButton onClick={() => connect()} primary>
            Login
          </AppButton>
        </>
      ) : (
        <>
          <FormProgress
            stations={[{ description: 'Basic Info' }, { description: 'Configuration' }, { description: 'Preview' }]}
            position={0}
            onSelected={(ix) => setPageIx(ix)}
          />

          <AppForm {...layout} value={formValues} onChange={onValuesUpdated as any}>
            <div
              style={{
                height: 'calc(100vh - 400px)',
                minWidth: '600px',
                maxWidth: '1200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <div style={{ margin: '30px 0px 20px 0px', fontSize: '24px', fontWeight: '700' }}>
                Create New Campaign <span style={{ fontSize: '18px', fontWeight: 'normal' }}>(Github)</span>
              </div>
              <hr style={{ width: '100%', marginBottom: '24px' }}></hr>
              {pages.map((page, ix) => {
                return (
                  <div key={ix} style={{ display: pageIx === ix ? 'block' : 'none' }}>
                    {page}
                  </div>
                );
              })}
            </div>
          </AppForm>

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
      )}
    </Box>
  );
};
