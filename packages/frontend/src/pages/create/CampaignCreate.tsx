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
import {
  ACTIVATION_PERIOD,
  ACTIVE_DURATION,
  CHALLENGE_PERIOD,
  INCLUDED_CHAINS,
  ORACLE_ADDRESS,
} from '../../config/appConfig';
import { RouteNames } from '../MainPage';
import {
  AppButton,
  AppCard,
  AppFileInput,
  AppForm,
  AppInput,
  AppSelect,
  AppTextArea,
  HorizontalLine,
} from '../../components/styles/BasicElements';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { FormProgress } from './FormProgress';
import { TwoColumns } from '../../components/styles/LayoutComponents.styled';
import { Add, AddCircle, FormTrash, StatusCritical } from 'grommet-icons';
import { useGithubSearch } from '../../hooks/useGithubSearch';
import { RewardsTable } from '../../components/RewardsTable';
import { FormStatus, getButtonActions } from './buttons.actions';
import { useNow } from '../../hooks/useNow';
import { useUserError } from '../../hooks/useErrorContext';
import { ethers } from 'ethers';
import { styleConstants, theme } from '../../components/styles/themes';
import { HEADER_HEIGHT } from '../AppHeader';

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
  title: '',
  guardian: '',
  chainName: initChain.name,
  customAssetAddress: '',
  hasCustomAsset: false,
  description: '',
  repositoryFullnames: ['gershido/test-github-api'],
  livePeriodChoice: periodOptions.get(PeriodKeys.last3Months) as string,
  customPeriodChoiceFrom: '',
  customPeriodChoiceTo: '',
};

const GITHUB_DOMAIN = 'https://www.github.com/';

const DEBUG = true;

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const { account, connect } = useLoggedUser();
  const { showError } = useUserError();

  const { now } = useNow();
  const [pageIx, setPageIx] = useState<number>(0);

  const { checking, checkExist, getValidName, validRepo, isValid } = useGithubSearch();
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

  const chainId = ChainsDetails.chainOfName(formValues.chainName)?.chain.id;
  const campaignFactory = useCampaignFactory(chainId);
  const navigate = useNavigate();

  /** details is a derived value */
  const details = strategyDetails(formValues, now, account);
  const periodType = getPeriodType(details, now);
  const isLogged = account !== undefined;

  const chainOptions = ChainsDetails.chains(INCLUDED_CHAINS).map((chain) => chain.name);
  const strategyOptions = ['Github Like-weighted Pull requests'];

  if (DEBUG) console.log('CampaignCreate - render');

  /** Prepare all the parameters to deply the campaign and call the deployCampaign function */
  const create = async (): Promise<void> => {
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    /** the strategy details are the same used for simulation, unless no simulation was done */
    const finalDetails = shares !== undefined ? shares.details : details;
    if (finalDetails === undefined) throw new Error();

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
    if (DEBUG) console.log('repoNameChanged', name);
    setRepo(name);
    checkExist(name);
  };

  const existStatus = {
    inputIsValid: getValidName(repo) !== undefined,
    inputExists: !checking && repo === validRepo && isValid,
    checking: checking || repo !== validRepo,
    inputDontExist: !checking && getValidName(validRepo) !== undefined && !isValid,
    repoIsNew:
      getValidName(validRepo) !== undefined &&
      !formValues.repositoryFullnames.includes(getValidName(validRepo) as string),
  };

  const repoButton = ((status) => {
    if (!status.inputIsValid) {
      return <AddCircle color={theme.primaryLight}></AddCircle>;
    }
    // else
    if (status.checking) {
      return <Spinner></Spinner>;
    }
    // else
    if (status.inputExists && status.repoIsNew) {
      return <AddCircle onClick={() => addRepo(validRepo)} color={theme.primary}></AddCircle>;
    }
    // else
    if (status.inputDontExist || !status.repoIsNew) {
      return <StatusCritical color={styleConstants.colors.alertText}></StatusCritical>;
    }
  })(existStatus);

  const addRepo = (repo: string) => {
    formValues.repositoryFullnames.push(getValidName(repo) as string);
    setFormValues({ ...formValues });
    repoNameChanged('');
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
      hasErrors: errors.length > 0,
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
    if (pageIx === 0) return 'Cancel';
    return 'Back';
  };

  const simulationText =
    periodType === PeriodType.retroactive
      ? `The rewards for this campaign will be:`
      : periodType === PeriodType.ongoing
      ? `So far, the rewards for this campaign would be. Final rewards will be computed once the campaign ends.`
      : '';

  const heading = ((_pageIx: number) => {
    switch (_pageIx) {
      case 0:
        return 'Create Campaign';
      case 1:
        return 'Choose a rule-set and configure it';
      case 2:
        return 'Verify your data';
    }
  })(pageIx);

  const pages: React.ReactNode[] = [
    <Box>
      <>
        <FormField name="title" label="Give this Campaign a name" style={{ marginBottom: '40px' }}>
          <AppInput name="title" placeholder="Name"></AppInput>
        </FormField>

        <FormField name="description" label="Describe what it is about" style={{ marginBottom: '40px' }}>
          <AppTextArea
            placeholder="e.g. Reward the contributors of the AwesomeOS project."
            name="description"></AppTextArea>
        </FormField>

        <FormField label="Logo" name="file" component={AppFileInput} style={{ marginBottom: '40px' }} />

        <FormField name="chainName" label="Select Network" style={{ marginBottom: '40px' }}>
          <AppSelect name="chainName" options={chainOptions}></AppSelect>
        </FormField>

        <FormField
          name="hasCustomAsset"
          label="Reward Tokens"
          style={{ marginBottom: formValues.hasCustomAsset ? '10px' : '40px' }}>
          <CheckBox name="hasCustomAsset" label="Use custom asset" />
        </FormField>

        {formValues.hasCustomAsset ? (
          <FormField name="customAssetAddress" label="Token address" style={{ marginBottom: '40px' }}>
            <AppInput
              name="customAssetAddress"
              placeholder="0x0..."
              style={{ border: '1px solid ', borderRadius: '20px' }}></AppInput>
          </FormField>
        ) : (
          <></>
        )}

        <FormField name="guardian" label="Add the Admin address" style={{ marginBottom: '40px' }}>
          <AppInput name="guardian" placeholder="0x...."></AppInput>
        </FormField>
      </>
    </Box>,
    <Box>
      <Box>
        <FormField name="stragy" label="Select a Rule-set">
          <AppSelect name="stragy" options={strategyOptions}></AppSelect>
        </FormField>
      </Box>

      <TwoColumns>
        <>
          <FormField
            name="description"
            label={
              <Box>
                <Box style={{ marginBottom: '8px' }}>Add Github repository</Box>
                <Box style={{ fontWeight: 'normal', fontSize: '13px' }}>
                  Use the format 'user/repo' or paste the link to the repo.
                </Box>
              </Box>
            }>
            <Box direction="row" align="center" style={{ marginTop: '8px' }}>
              <Box style={{ flexGrow: '1', marginRight: '8px' }}>
                <AppInput
                  placeholder="user/repo or https://github.com/..."
                  value={repo}
                  onChange={(e) => repoNameChanged(e.target.value)}
                />
              </Box>
              <Box justify="center" style={{ height: '30px', width: '30px' }}>
                {repoButton}
              </Box>
            </Box>
          </FormField>

          <>
            {formValues.repositoryFullnames.map((repo) => {
              return (
                <Box style={{ width: '100%', marginTop: '25px' }} direction="row" justify="between" align="center">
                  <a
                    style={{ textDecoration: 'none', color: styleConstants.colors.ligthGrayText }}
                    target="_blank"
                    href={`${GITHUB_DOMAIN}${repo}`}
                    rel="noreferrer">
                    {repo}
                  </a>
                  <Box onClick={() => clearRepo(repo)} style={{ width: '28px', height: '28px' }}>
                    <FormTrash
                      style={{ width: '28px', height: '28px' }}
                      color={styleConstants.colors.ligthGrayText}></FormTrash>
                  </Box>
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
      </TwoColumns>
    </Box>,

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
    <Box justify="start" align="center" style={{ width: '100%' }}>
      <Box
        justify="start"
        align="center"
        style={{ marginTop: HEADER_HEIGHT, padding: '2vw 3vw 70px 3vw', fontSize: '14px', width: '100%' }}>
        <AppCard
          style={{
            padding: '48px 64px 88px 64px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '800px',
            minHeight: 'calc()',
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

          <Box style={{ width: '100%', maxWidth: '380px' }} direction="row" justify="center">
            <FormProgress
              stations={[{ description: 'Basic Info' }, { description: 'Configuration' }, { description: 'Preview' }]}
              position={pageIx}
              onSelected={(ix) => setPageIx(ix)}
            />
          </Box>

          <Box style={{ width: '100%', margin: '0px 0px 0px 0px' }}>
            <Box
              style={{
                fontSize: styleConstants.headingFontSizes[1],
                fontWeight: '700',
                textAlign: 'left',
                color: '#0E0F19',
                margin: '40px 0px 0px 0px',
              }}>
              {heading}
            </Box>
            <HorizontalLine style={{ margin: '24px 0px' }}></HorizontalLine>
          </Box>

          <AppForm value={formValues} onChange={onValuesUpdated as any} style={{ maxWidth: '560px' }}>
            {pages.map((page, ix) => {
              return (
                <div key={ix} style={{ display: pageIx === ix ? 'block' : 'none' }}>
                  {page}
                </div>
              );
            })}
          </AppForm>

          <HorizontalLine style={{ margin: '0px 0px 32px 0px' }}></HorizontalLine>

          <Box style={{ width: '100%' }}>
            <Box direction="row" justify="between" style={{ width: '100%' }}>
              <AppButton onClick={() => leftClicked()}>{leftText()}</AppButton>
              <AppButton primary onClick={() => rightAction()} disabled={rightDisabled}>
                {rightText}
              </AppButton>
            </Box>

            <Box direction="row" justify="end" style={{ width: '100%' }}>
              <Box style={{ color: styleConstants.colors.alertText }}>
                {errors.map((error, ix) => (
                  <Box key={ix} pad="small">
                    {error}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </AppCard>
      </Box>
    </Box>
  );
};
