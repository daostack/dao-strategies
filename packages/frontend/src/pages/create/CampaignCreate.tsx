import { Box, FormField, Paragraph, Text, TextInput } from 'grommet';
import { useAccount } from 'wagmi';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DateManager } from '../../utils/time';
import { useCampaignFactory } from '../../hooks/useContracts';
import { CampaignCreateDetails, deployCampaign, simulateCampaign, SimulationResult } from '../campaign.support';
import { CHALLENGE_PERIOD, ORACLE_ADDRESS } from '../../config/appConfig';
import { CampaignUriDetails } from '@dao-strategies/core';
import { RouteNames } from '../MainPage';
import {
  AppButton,
  AppFileInput,
  AppForm,
  AppInput,
  AppSelect,
  AppTextArea,
} from '../../components/styles/BasicElements';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { FormProgress } from './FormProgress';
import { TwoColumns } from '../../components/styles/LayoutComponents.styled';
import { FormTrash, Search } from 'grommet-icons';
import { useGithubSearch } from '../../hooks/useGithubSearch';

export interface ICampaignCreateProps {
  dum?: any;
}

export enum Asset {
  Ether = 'ether',
  DAI = 'dai',
}

export interface CampaignFormValues {
  title: string;
  description: string;
  asset: Asset;
  repositoryURLs: string[];
  livePeriodChoice: string;
  guardian: string;
}

const initialValues: CampaignFormValues = {
  title: '',
  guardian: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  asset: Asset.Ether,
  description: '',
  repositoryURLs: [],
  livePeriodChoice: '-3',
};

const GITHUB_DOMAIN = 'https://www.github.com/';

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const { account, connect } = useLoggedUser();

  const [today] = useState<DateManager>(new DateManager());
  const [pageIx, setPageIx] = useState<number>(0);

  const { isValid, checking, checkExist, isValidName } = useGithubSearch();
  const [repo, setRepo] = useState<string>('');

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
      guardian: values.guardian,
      description: values.description,
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
    console.log({ values });
    setFormValues(values);
  };

  const getRepos = (values: CampaignFormValues): { owner: string; repo: string }[] => {
    return values.repositoryURLs.map((repo) => {
      const url = new URL(repo);
      const parts = url.pathname.split('/');
      return {
        owner: parts[1],
        repo: parts[2],
      };
    });
  };

  const repoNameChanged = (name: string) => {
    setRepo(name);
    checkExist(name);
  };

  const strategyDetails = (): CampaignUriDetails | undefined => {
    const values = getFormValues();
    if (values !== undefined && isLogged()) {
      const repos = getRepos(values);

      const [start, end] = getStartEnd(values);

      return {
        creator: account as string,
        nonce: 0,
        execDate: end,
        strategyID: 'GH_PRS_REACTIONS_WEIGHED',
        strategyParams: {
          repositories: repos,
          timeRange: { start, end },
        },
      };
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

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const buttonAction = (): string => {
    return checking ? '...' : isValidName(repo) ? (isValid ? 'add' : 'not found') : '...';
  };

  const buttonDisabled = () => {
    return buttonAction() !== 'add';
  };

  const addRepo = () => {
    formValues.repositoryURLs.push(repo);
    setFormValues({ ...formValues });
  };

  const clearRepo = (repo: string) => {
    const ix = formValues.repositoryURLs.indexOf(repo);
    formValues.repositoryURLs.splice(ix, 1);
    setFormValues({ ...formValues });
  };

  const pages: React.ReactNode[] = [
    <TwoColumns>
      <>
        <FormField name="title" label="Campaign Name" style={{ borderStyle: 'none' }}>
          <AppInput name="title"></AppInput>
        </FormField>
        <FormField name="guardian" label="Guardian Address" rules={[{ required: true }]}>
          <AppInput name="guardian" placeholder="0x...."></AppInput>
        </FormField>
        <FormField name="asset" label="Asset" style={{ border: '0px none' }}>
          <AppSelect name="asset" style={{ border: '0px none' }} options={['ether', 'DAI']}></AppSelect>
        </FormField>
      </>
      <>
        <FormField label="File" name="file" component={AppFileInput} />

        <FormField name="description" label="Description">
          <AppTextArea name="description"></AppTextArea>
        </FormField>
      </>
    </TwoColumns>,

    <TwoColumns>
      <>
        <FormField name="description" label="Add Github Repos">
          <Paragraph>
            <Text>format: user/repo</Text>
          </Paragraph>
          <Box direction="row" width="medium" gap="medium">
            <TextInput value={repo} onChange={(e) => repoNameChanged(e.target.value)} reverse />
            <Box>
              <AppButton primary disabled={buttonDisabled()} onClick={() => addRepo()}>
                {buttonAction()}
              </AppButton>
            </Box>
          </Box>
        </FormField>

        <>
          {formValues.repositoryURLs.map((repo) => {
            return (
              <Box direction="row">
                <a target="_blank" href={`${GITHUB_DOMAIN}${repo}`} rel="noreferrer">
                  {repo}
                </a>
                <FormTrash onClick={() => clearRepo(repo)}></FormTrash>
              </Box>
            );
          })}
        </>
      </>

      <>
        <FormField name="livePeriodChoice" label="Live period">
          <AppSelect value="small" onChange={onLivePeriodSelected} options={['small', 'medium', 'large']}></AppSelect>
        </FormField>
      </>
    </TwoColumns>,
    <>4</>,
  ];

  return (
    <Box style={{ height: '100vh' }} justify="center" align="center">
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

          <AppForm value={formValues} onChange={onValuesUpdated as any}>
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
                  <div key={ix} style={{ display: pageIx === ix ? 'block' : 'block' }}>
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
