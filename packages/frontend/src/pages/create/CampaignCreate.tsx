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
import {
  CampaignCreateDetails,
  deployCampaign,
  PeriodKeys,
  periodOptions,
  getPeriodType,
  PeriodType,
  simulateCampaign,
  SimulationResult,
  strategyDetails,
} from '../campaign.support';
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
import { RewardsTable } from '../../components/styles/RewardsTable';

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
  repositoryFullnames: string[];
  guardian: string;
  livePeriodChoice: string;
  customPeriodChoiceFrom: string;
  customPeriodChoiceTo: string;
}

export interface ProcessedFormValues {
  periodCustom: boolean;
}

const initialValues: CampaignFormValues = {
  title: 'asdas',
  guardian: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  asset: Asset.Ether,
  description: '',
  repositoryFullnames: ['gershido/test-github-api'],
  livePeriodChoice: periodOptions.get(PeriodKeys.last3Months) as string,
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

  /** Form data is kept in the formValues state. The strategy details is a computed
   * property that should change everytime the formValues change.
   *
   * When the user steps into the final page, a simulation is triggered depending
   * on wheather the start date of the strategy is older than today.
   */
  const [formValues, setFormValues] = useState<CampaignFormValues>(initialValues);
  const [details, setDetails] = useState<CampaignUriDetails | undefined>(undefined);
  const [simulation, setSimulated] = useState<SimulationResult | undefined>();
  const [simulating, setSimulating] = useState<boolean>(false);

  const campaignFactory = useCampaignFactory();
  const accountHook = useAccount();
  const navigate = useNavigate();

  const periodType = getPeriodType(details, today);

  const isLogged = account !== undefined;

  /** Prepare all the parameters to deply the campaign and call the deployCampaign function */
  const create = async (): Promise<void> => {
    const account = accountHook.data?.address;
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    /** the strategy details are the same used for simulation, unless no simulation was done */
    const finalDetails = simulation !== undefined ? simulation.details : details;
    if (finalDetails === undefined) throw new Error();

    /** the address is not yet known */
    const otherDetails: CampaignCreateDetails = {
      title: formValues.title,
      guardian: formValues.guardian,
      description: formValues.description,
      oracle: ORACLE_ADDRESS,
      address: '',
      cancelDate: finalDetails.execDate + CHALLENGE_PERIOD,
    };

    /** if the campaign was not simulated it must be created first */
    const campaignAddress = await deployCampaign(
      campaignFactory,
      (simulation as SimulationResult).uri,
      otherDetails,
      finalDetails
    );

    navigate(RouteNames.Campaign(campaignAddress));
  };

  /** Processed values from the form that are cheap to compute and useful */
  const formValuesProcessed = (): ProcessedFormValues => {
    return {
      periodCustom: formValues.livePeriodChoice === periodOptions.get(PeriodKeys.custom),
    };
  };

  /** Hook called everytime any field in the form is updated, it keeps the formValues state in synch */
  const onValuesUpdated = (values: CampaignFormValues) => {
    if (validated) {
      // validate every change after the first time
      validate();
    }
    setFormValues(values);
  };

  const validate = () => {
    const errors: string[] = [];
    if (formValues.title === '') errors.push('title cannot be empty');
    if (formValues.repositoryFullnames.length === 0) errors.push('no repositories specified');
    setValidated(true);
    setErrors(errors);
    return errors;
  };

  /** useEffect to keep strategy details always in synch with formValues */
  useEffect(() => {
    if (formValues === undefined) return;

    setDetails(strategyDetails(formValues, today, account));
  }, [formValues, today, account]);

  const simulate = async (): Promise<void> => {
    setSimulating(true);

    if (details === undefined) throw new Error();
    const sim = await simulateCampaign(details);

    setSimulated(sim);
    setSimulating(false);
  };

  /** Repo selection */
  const repoNameChanged = (name: string) => {
    setRepo(name);
    checkExist(name);
  };

  const buttonAction = checking ? '...' : isValidName(repo) ? (isValid ? 'add' : 'not found') : '...';
  const buttonDisabled = buttonAction !== 'add';

  const addRepo = () => {
    formValues.repositoryFullnames.push(repo);
    setFormValues({ ...formValues });
  };

  const clearRepo = (repo: string) => {
    const ix = formValues.repositoryFullnames.indexOf(repo);
    formValues.repositoryFullnames.splice(ix, 1);
    setFormValues({ ...formValues });
  };

  /**  */
  interface FormStatus {
    page: {
      isFirstPage: boolean;
      isLastFormPage: boolean;
      isReview: boolean;
    };
    shouldSimulate: boolean;
    canSimulate: boolean;
    mustSimulate: boolean;
    isSimulating: boolean;
    wasSimulated: boolean;
    canCreate: boolean;
  }

  const status: FormStatus = {
    page: {
      isFirstPage: pageIx === 0,
      isLastFormPage: pageIx === 1, // before the review page
      isReview: pageIx === 2,
    },
    shouldSimulate: periodType !== PeriodType.future,
    canSimulate: isLogged,
    mustSimulate: periodType === PeriodType.retroactive,
    isSimulating: simulating,
    wasSimulated: simulation !== undefined,
    canCreate: isLogged,
  };

  /** Sefault values */
  let rightAction: () => void = () => setPageIx(pageIx + 1);
  let rightText: string = 'Continue';
  const rightDisabled = false;

  /** Special values */
  if (status.page.isLastFormPage) {
    rightText = 'Review';
    rightAction = () => {
      const errors = validate();
      if (errors.length === 0) {
        setPageIx(pageIx + 1);
        if (status.shouldSimulate && status.canSimulate) {
          simulate();
        }
      }
    };
  }

  // on the review page
  if (status.page.isReview) {
    if (!status.shouldSimulate) {
      /** should not simulate */
      if (status.canCreate) {
        /** Should not simulate and can create*/
        rightText = `Deploy Campaign`;
        rightAction = () => create();
      } else {
        /** Should not simulate and can't create*/
        rightText = `Connect Wallet to Deploy`;
        rightAction = () => connect();
      }
    } else {
      /** should simulate */
      if (!status.wasSimulated) {
        /** was not simulated */
        if (status.canSimulate) {
          /** can simulate */
          if (status.mustSimulate) {
            /** should simulate, was not simulated, can simualte and must simulate */
            rightText = 'Calculate rewards';
            rightAction = () => simulate();
          } else {
            /** should simulate, was not simulated, can simualte but does not must simulate */
            rightText = 'Deploy Campaign';
            rightAction = () => create();
          }
        } else {
          /** cannot simulate */
          if (status.mustSimulate) {
            /** should simulate, was not simulated, cannot simulate and must simulate */
            rightText = 'Connect Wallet';
            rightAction = () => connect();
          }
        }
      } else {
        /** was simulated */
        if (status.canCreate) {
          /** should simulate, was simulated, can create */
          rightText = `Deploy Campaign`;
          rightAction = () => create();
        } else {
          /** should simulate, was simulated, cannot create */
          rightText = `Connect Wallet to Deploy`;
          rightAction = () => connect();
        }
      }
    }
  }

  /** overwrite */
  if (status.isSimulating) {
    rightText = `Computing rewards`;
    rightAction = () => {};
  }

  const leftClicked = () => {
    if (pageIx > 0) setPageIx(pageIx - 1);
    else navigate('/');
  };

  const leftText = () => {
    if (pageIx === 0) return 'Home';
    return 'Back';
  };

  const simulationText =
    periodType === PeriodType.retroactive
      ? `The rewards for this campaign will be:`
      : periodType === PeriodType.ongoing
      ? `So far, the rewards for this campaign would be. Final rewards will be computed once the campaign ends.`
      : '';

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
              <AppButton primary disabled={buttonDisabled} onClick={() => addRepo()}>
                {buttonAction}
              </AppButton>
            </Box>
          </Box>
        </FormField>

        <>
          {formValues.repositoryFullnames.map((repo) => {
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
          <AppSelect name="livePeriodChoice" options={Array.from(periodOptions.values())}></AppSelect>
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
            {formValues.repositoryFullnames.map((repo) => (
              <Box>{repo}</Box>
            ))}
          </Box>
          <Box>
            <Paragraph>Live Period</Paragraph>
            <Paragraph>{details?.strategyParams.from}</Paragraph>
            <Paragraph>{details?.strategyParams.to}</Paragraph>
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
        {status.isSimulating ? (
          'simulating'
        ) : (
          <Box>
            <Box>{simulation !== undefined ? <Text>{simulationText}</Text> : ''}</Box>
            {status.wasSimulated ? (
              <RewardsTable rewards={(simulation as SimulationResult).rewards}></RewardsTable>
            ) : (
              ''
            )}
          </Box>
        )}
      </Box>
    </Box>,
  ];

  return (
    <Box style={{ height: '100vh', padding: '45px 0px' }} justify="center" align="center">
      <Box style={{ height: '100%', minWidth: '600px', maxWidth: '900px' }}>
        <Box style={{ height: '80px', flexShrink: 0 }} direction="row" justify="center">
          <FormProgress
            stations={[{ description: 'Basic Info' }, { description: 'Configuration' }, { description: 'Preview' }]}
            position={0}
            onSelected={(ix) => setPageIx(ix)}
          />
        </Box>

        <Box style={{ height: '80px', flexShrink: 0, width: '100%' }}>
          <div style={{ margin: '30px 0px 20px 0px', fontSize: '24px', fontWeight: '700', textAlign: 'center' }}>
            Create New Campaign <span style={{ fontSize: '18px', fontWeight: 'normal' }}>(Github)</span>
          </div>
          <hr style={{ width: '100%', marginBottom: '24px' }}></hr>
        </Box>

        <AppForm
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            margin: '25px 0px',
            width: '700px',
          }}
          value={formValues}
          onChange={onValuesUpdated as any}>
          <div
            style={{
              width: '100%',
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
          {errors.map((error, ix) => (
            <Box key={ix} pad="small">
              {error}
            </Box>
          ))}
        </Box>

        <Box style={{ width: '100%', height: '50px', flexShrink: '0' }} direction="row" justify="between">
          <AppButton onClick={() => leftClicked()}>{leftText()}</AppButton>
          <AppButton primary onClick={() => rightAction()} disabled={rightDisabled}>
            {rightText}
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
};
