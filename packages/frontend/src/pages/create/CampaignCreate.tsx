import { Box, CheckBox, DateInput, FormField, Layer, Paragraph, Spinner, Text, TextInput } from 'grommet';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainsDetails, getCampaignUri, CampaignCreateDetails, SharesRead, Page } from '@dao-strategies/core';

import { useCampaignFactory } from '../../hooks/useContracts';
import {
  deployCampaign,
  PeriodKeys,
  periodOptions,
  getPeriodType,
  PeriodType,
  strategyDetails,
  sharesFromDetails,
} from '../campaign.support';
import { ACTIVATION_PERIOD, ACTIVE_DURATION, CHALLENGE_PERIOD, ORACLE_ADDRESS } from '../../config/appConfig';
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
import { RewardsTable } from '../../components/RewardsTable';
import { FormStatus, getButtonActions } from './buttons.actions';
import { useNow } from '../../hooks/useNow';
import { useUserError } from '../../hooks/useErrorContext';
import { ethers } from 'ethers';

export interface ICampaignCreateProps {
  dum?: any;
}

export interface CampaignFormValues {
  title: string;
  description: string;
  customAssetAddress: string;
  hasCustomAsset: boolean;
  chainName: string;
  repositoryFullnames: string[];
  guardian: string;
  livePeriodChoice: string;
  customPeriodChoiceFrom: string;
  customPeriodChoiceTo: string;
}

export interface ProcessedFormValues {
  periodCustom: boolean;
}

const initChain = ChainsDetails.chains()[0];

const initialValues: CampaignFormValues = {
  title: 'My Campaign',
  guardian: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  chainName: initChain.name,
  customAssetAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  hasCustomAsset: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at imperdiet elit, ut vulputate ex. Quisque tincidunt varius magna nec convallis. Fusce eget pulvinar tellus. Pellentesque condimentum dui ut quam lobortis gravida. Sed suscipit iaculis ipsum, vel malesuada est commodo vitae. Cras faucibus massa quis est porta cursus. \n Integer quis bibendum neque. Integer eu sapien augue. Quisque congue vestibulum nibh, quis hendrerit erat gravida quis. Vivamus vulputate eleifend dignissim. Cras eu sapien bibendum est placerat fermentum. Vestibulum vitae ipsum quam. Aenean ornare odio id euismod elementum. Morbi in posuere neque, in euismod arcu. Vestibulum sed justo sapien. Etiam et ipsum dui. Pellentesque tempor posuere turpis, non elementum nisi mattis vel. Nulla eu arcu id dui dapibus porttitor id sit amet elit. Donec tempor quam diam, eu efficitur eros mattis vitae.',
  repositoryFullnames: ['gershido/test-github-api'],
  livePeriodChoice: periodOptions.get(PeriodKeys.last3Months) as string,
  customPeriodChoiceFrom: '',
  customPeriodChoiceTo: '',
};

const GITHUB_DOMAIN = 'https://www.github.com/';

const DEBUG = false;

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const { account, connect } = useLoggedUser();
  const { showError } = useUserError();

  const { now } = useNow();
  const [pageIx, setPageIx] = useState<number>(0);

  const { isValid, checking, checkExist, isValidName } = useGithubSearch();
  const [repo, setRepo] = useState<string>('');

  const [validated, setValidated] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  /** Form data is kept in the formValues state. The strategy details is a computed
   * property that should change everytime the formValues change.
   *
   * When the user steps into the final page, a simulation is triggered depending
   * on wheather the start date of the strategy is older than today.
   */
  const [formValues, setFormValuesState] = useState<CampaignFormValues>(initialValues);
  const [shares, setShares] = useState<SharesRead | undefined>();
  const [simulating, setSimulating] = useState<boolean>(false);
  const [deploying, setDeploying] = useState<boolean>(false);

  const campaignFactory = useCampaignFactory();
  const navigate = useNavigate();

  /** details is a derived value */
  const details = strategyDetails(formValues, now, account);
  const periodType = getPeriodType(details, now);
  const isLogged = account !== undefined;

  const chainOptions = ChainsDetails.chains().map((chain) => chain.name);

  if (DEBUG) console.log('CampaignCreate - render');

  /** Prepare all the parameters to deply the campaign and call the deployCampaign function */
  const create = async (): Promise<void> => {
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    /** the strategy details are the same used for simulation, unless no simulation was done */
    const finalDetails = shares !== undefined ? shares.details : details;
    if (finalDetails === undefined) throw new Error();

    const chainId = ChainsDetails.chainOfName(formValues.chainName)?.chain.id;
    if (chainId === undefined) {
      throw new Error(`chain ${formValues.chainName} not found`);
    }
    const activationTime = 0;

    /** the address is not yet known */
    const otherDetails: CampaignCreateDetails = {
      title: formValues.title,
      guardian: formValues.guardian,
      description: formValues.description,
      oracle: ORACLE_ADDRESS,
      activationTime,
      CHALLENGE_PERIOD: CHALLENGE_PERIOD,
      ACTIVATION_PERIOD: ACTIVATION_PERIOD,
      ACTIVE_DURATION: ACTIVE_DURATION,
      address: '',
      chainId,
      customAssets: formValues.hasCustomAsset ? [formValues.customAssetAddress] : [],
    };

    if (shares === undefined) {
      throw new Error(`shares undefined`);
    }

    setDeploying(true);
    /** if the campaign was not simulated it must be created first */
    try {
      setCreating(true);
      const campaignAddress = await deployCampaign(campaignFactory, shares.uri, otherDetails, finalDetails);

      setCreating(false);
      navigate(RouteNames.Campaign(campaignAddress));
    } catch (e) {
      showError('Error creating campaign');
      console.log(e);
    }

    setDeploying(false);
  };

  /** Processed values from the form that are cheap to compute and useful */
  const formValuesProcessed = (): ProcessedFormValues => {
    if (DEBUG) console.log('CampaignCreate - formValuesProcessed()');
    return {
      periodCustom: formValues.livePeriodChoice === periodOptions.get(PeriodKeys.custom),
    };
  };

  /** single wrapper of setFormValues to detect details changes */
  const setFormValues = (nextFormValues: CampaignFormValues) => {
    if (formValues === undefined) return;

    const oldDetails = strategyDetails(formValues, now, account);

    /** reset simulation only if uriParameters changed (not all parameters chage the uri) */
    if (oldDetails !== undefined && shares !== undefined) {
      const nextDetails = strategyDetails(nextFormValues, now, account);
      if (nextDetails !== undefined) {
        const currentUri = getCampaignUri(oldDetails);
        const nextUri = getCampaignUri(nextDetails);
        if (nextUri !== currentUri) {
          setShares(undefined);
        }
      }
    }

    setFormValuesState(nextFormValues);
  };

  /** Hook called everytime any field in the form is updated, it keeps the formValues state in synch */
  const onValuesUpdated = (values: CampaignFormValues) => {
    if (DEBUG) console.log('CampaignCreate - onValuesUpdated()');
    if (validated) {
      // validate every change after the first time
      validate(values);
    }
    setFormValues(values);
  };

  const validate = (values: CampaignFormValues = formValues): string[] => {
    if (DEBUG) console.log('CampaignCreate - validate()');
    const errors: string[] = [];
    if (values.title === '') errors.push('title cannot be empty');
    if (values.repositoryFullnames.length === 0) errors.push('no repositories specified');
    if (values.hasCustomAsset && !ethers.utils.isAddress(values.customAssetAddress))
      errors.push('custom asset address not correct');
    setValidated(true);
    setErrors(errors);
    return errors;
  };

  const firstSimulate = useMemo(() => {
    return async (): Promise<void> => {
      if (DEBUG) console.log('CampaignCreate - simulate()');
      setSimulating(true);

      await simulate({ number: 0, perPage: 10 });

      setSimulating(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const simulate = useMemo(() => {
    return async (_page: Page): Promise<void> => {
      if (details === undefined) throw new Error();
      const shares = await sharesFromDetails(details, _page);
      setShares(shares);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const updatePage = (page: Page) => {
    void simulate(page);
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

  const status = useMemo((): FormStatus => {
    return {
      page: {
        isFirstPage: pageIx === 0,
        isLastFormPage: pageIx === 1, // before the review page
        isReview: pageIx === 2,
      },
      shouldSimulate: periodType !== PeriodType.future,
      canSimulate: isLogged,
      mustSimulate: periodType === PeriodType.retroactive,
      isSimulating: simulating,
      wasSimulated: shares !== undefined,
      canCreate: isLogged,
      isCreating: creating,
      isDeploying: deploying,
    };
  }, [creating, deploying, isLogged, pageIx, periodType, simulating, shares]);

  const { rightText, rightAction, rightDisabled } = getButtonActions(status, pageIx, {
    connect,
    create,
    setPageIx,
    simulate: firstSimulate,
    validate,
  });

  useEffect(() => {
    if (status.page.isReview && status.canSimulate && !status.isSimulating && !status.wasSimulated) {
      void simulate({ number: 0, perPage: 10 });
    }
  }, [status, account, simulate]);

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
        <FormField name="chainName" label="Chain" style={{ border: '0px none' }}>
          <AppSelect name="chainName" style={{ border: '0px none' }} options={chainOptions}></AppSelect>
        </FormField>
        <FormField name="hasCustomAsset" style={{ border: '0px none' }}>
          <CheckBox name="hasCustomAsset" label="Use custom asset" />
        </FormField>
        {formValues.hasCustomAsset ? (
          <FormField name="customAssetAddress" label="ERC-20 token address" style={{ borderStyle: 'none' }}>
            <AppInput name="customAssetAddress" placeholder="0x0..."></AppInput>
          </FormField>
        ) : (
          <></>
        )}
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
      <TwoColumns style={{ overflowX: 'hidden' }}>
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
            <Paragraph>Custom Asset</Paragraph>
            <Paragraph>{formValues.hasCustomAsset ? formValues.customAssetAddress : 'none'}</Paragraph>
          </Box>
        </Box>
      </TwoColumns>
      ,
      <Box>
        {status.isSimulating ? (
          'simulating'
        ) : shares !== undefined ? (
          <Box style={{ paddingRight: '16px' }}>
            <Box style={{ marginBottom: '24px' }}>{shares !== undefined ? <Text>{simulationText}</Text> : ''}</Box>
            {status.wasSimulated ? <RewardsTable shares={shares} updatePage={updatePage}></RewardsTable> : ''}
          </Box>
        ) : (
          <></>
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
            {status.isDeploying ? (
              <Layer>
                <Box style={{ height: '50vh', width: '50vw' }} justify="center" align="center">
                  Deploying
                  <br></br>
                  <Spinner></Spinner>
                </Box>
              </Layer>
            ) : (
              <></>
            )}
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
