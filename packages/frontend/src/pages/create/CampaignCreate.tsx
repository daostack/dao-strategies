import {
  Box,
  DateInput,
  FormField,
  Paragraph,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
  Text,
  TextInput,
} from 'grommet';
import { useAccount } from 'wagmi';
import { FC, useEffect, useState } from 'react';
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
import { FormTrash } from 'grommet-icons';
import { useGithubSearch } from '../../hooks/useGithubSearch';
import { errors } from 'ethers';

export interface ICampaignCreateProps {
  dum?: any;
}

export enum Asset {
  Ether = 'ether',
  DAI = 'dai',
}

export enum PeriodOptions {
  last3Months = 'Last 3 months',
  last6Months = 'Last 6 months',
  next3Months = 'Next 3 months',
  next6Months = 'Next 6 months',
  custom = 'Custom',
}

export interface CampaignFormValues {
  title: string;
  description: string;
  asset: Asset;
  repositoryURLs: string[];
  guardian: string;
  livePeriodChoice: string;
  customPeriodChoiceFrom: string;
  customPeriodChoiceTo: string;
}

export interface ProcessedFormValues {
  periodCustom: boolean;
}

const initialValues: CampaignFormValues = {
  title: '',
  guardian: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  asset: Asset.Ether,
  description: '',
  repositoryURLs: [],
  livePeriodChoice: PeriodOptions.custom,
  customPeriodChoiceFrom: '',
  customPeriodChoiceTo: '',
};

const GITHUB_DOMAIN = 'https://www.github.com/';

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const { account, connect } = useLoggedUser();

  const [today] = useState<DateManager>(new DateManager());
  const [pageIx, setPageIx] = useState<number>(0);

  const { isValid, checking, checkExist, isValidName } = useGithubSearch();
  const [repo, setRepo] = useState<string>('');

  const [validated, setValidated] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
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
    if (values.livePeriodChoice === PeriodOptions.custom) {
      let from = new DateManager(new Date(values.customPeriodChoiceFrom));
      let to = new DateManager(new Date(values.customPeriodChoiceFrom));

      from = from.setTimeOfDay('00:00:00');
      to = to.setTimeOfDay('00:00:00').addDays(1);

      return [from.getTime(), to.getTime()];
    } else {
      const parts = values.livePeriodChoice.split(' ');
      const livePeriod = +parts[1];

      return livePeriod < 0
        ? [today.clone().addMonths(livePeriod).getTime(), today.getTime()]
        : [today.getTime(), today.clone().addMonths(livePeriod).getTime()];
    }
  };

  const getFormValues = (): CampaignFormValues => {
    return formValues;
  };

  const formValuesProcessed = (): ProcessedFormValues => {
    return {
      periodCustom: formValues.livePeriodChoice === PeriodOptions.custom,
    };
  };

  const onValuesUpdated = (values: CampaignFormValues) => {
    if (validated) {
      // validate every change after the first time
      validate();
    }
    setFormValues(values);
  };

  const getRepos = (values: CampaignFormValues): { owner: string; repo: string }[] => {
    return values.repositoryURLs.map((repo) => {
      const parts = repo.split('/');
      return {
        owner: parts[0],
        repo: parts[1],
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

  const updateRewards = async (): Promise<void> => {
    setSimulating(true);

    const details = strategyDetails();
    if (details === undefined) throw new Error();
    const sim = await simulateCampaign(details);

    setSimulated(sim);
    setSimulating(false);
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

  const periodOptions = Object.keys(PeriodOptions).map((name) => {
    return PeriodOptions[name as keyof typeof PeriodOptions];
  });

  const validate = () => {
    const errors: string[] = [];
    if (formValues.title === '') errors.push('title cannot be empty');
    if (formValues.repositoryURLs.length === 0) errors.push('no repositories specified');
    setValidated(true);
    setErrors(errors);
    return errors;
  };

  const nextPage = () => {
    if (pageIx === 1) {
      const errors = validate();
      if (errors.length === 0) {
        setPageIx(2);
      }
      return;
    }
    if (pageIx < 2) setPageIx(pageIx + 1);
  };

  const prevPage = () => {
    if (pageIx > 0) setPageIx(pageIx - 1);
  };

  const nextButtonText = () => {
    if (pageIx === 1) return 'Review';
    if (pageIx === 2) return 'Deploy Campaign';
    return 'Continue';
  };

  const nextButtonDisabled = () => {
    return errors.length > 0;
  };

  useEffect(() => {
    const simulate = (): void => {
      if (!simulating) {
        void updateRewards();
      }
    };

    if (pageIx === 2) simulate();
  }, [pageIx, simulating, updateRewards]);

  interface Column {
    property: string;
    label: string;
  }

  interface Data {
    id: string;
    user: string;
    badge: boolean;
    info: string;
  }

  const columns: Column[] = [
    { property: 'user', label: 'user' },
    { property: 'reward', label: 'reward' },
    { property: 'badge', label: 'verified' },
    { property: 'info', label: '' },
  ];

  const data: Data[] =
    simulation === undefined || simulation.rewards === undefined
      ? []
      : Object.entries(simulation.rewards).map(([address, reward]) => {
          return {
            id: address,
            user: address,
            badge: true,
            info: '',
          };
        });

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
          <AppSelect name="livePeriodChoice" options={periodOptions}></AppSelect>
        </FormField>

        {formValuesProcessed().periodCustom ? (
          <>
            <FormField name="customPeriodChoiceFrom" label="From">
              <DateInput name="customPeriodChoiceFrom" format="mm/dd/yyyy"></DateInput>
            </FormField>
            <FormField name="customPeriodChoiceTo" label="To">
              <DateInput name="customPeriodChoiceTo" format="mm/dd/yyyy"></DateInput>
            </FormField>
          </>
        ) : (
          <></>
        )}
      </>
    </TwoColumns>,
    <Box>
      <TwoColumns>
        <Box>
          <Box>
            <Paragraph>Campaign Name</Paragraph>
            <Paragraph>{formValues.title}</Paragraph>
          </Box>
          <Box>
            <Paragraph>Creator</Paragraph>
            <Paragraph>{account}</Paragraph>
          </Box>
          <Box>
            <Paragraph>Guardian</Paragraph>
            <Paragraph>{formValues.guardian}</Paragraph>
          </Box>
          <Box>
            <Paragraph>Github Repositories</Paragraph>
            {formValues.repositoryURLs.map((repo) => (
              <Box>{repo}</Box>
            ))}
          </Box>
          <Box>
            <Paragraph>Live Period</Paragraph>
            <Paragraph>{strategyDetails()?.strategyParams.from}</Paragraph>
            <Paragraph>{strategyDetails()?.strategyParams.to}</Paragraph>
          </Box>
        </Box>

        <Box>
          <Box>
            <Paragraph>Logo</Paragraph>
          </Box>
          <Box>
            <Paragraph>Description</Paragraph>
          </Box>
          <Box>
            <Paragraph>Asset</Paragraph>
            <Paragraph>{formValues.asset}</Paragraph>
          </Box>
        </Box>
      </TwoColumns>
      ,
      <Box>
        {simulating ? (
          'simulating'
        ) : (
          <Box>
            <Table caption="Default Table">
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell key={c.property}>
                      <Text>{c.label}</Text>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((datum) => (
                  <TableRow key={datum.id}>
                    {columns.map((c) => (
                      <TableCell key={c.property}>
                        <Text>{datum[c.property as keyof Data]}</Text>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>,
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

          <Box>
            <div style={{ margin: '30px 0px 20px 0px', fontSize: '24px', fontWeight: '700' }}>
              Create New Campaign <span style={{ fontSize: '18px', fontWeight: 'normal' }}>(Github)</span>
            </div>
            <hr style={{ width: '100%', marginBottom: '24px' }}></hr>
          </Box>

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
              {pages.map((page, ix) => {
                return (
                  <div key={ix} style={{ display: pageIx === ix ? 'block' : 'none' }}>
                    {page}
                  </div>
                );
              })}
            </div>
          </AppForm>

          <Box>
            {errors.map((error) => (
              <Box pad="small">{error}</Box>
            ))}
          </Box>

          <Box direction="row" justify="between">
            <AppButton onClick={() => prevPage()}>Back</AppButton>
            <AppButton primary onClick={() => nextPage()}>
              {nextButtonText()}
            </AppButton>
          </Box>
        </>
      )}
    </Box>
  );
};
