import { Box, CheckBox, Layer, Text, Spinner, Image } from 'grommet';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ChainsDetails,
  getCampaignUri,
  CampaignCreateDetails,
  SharesRead,
  Page,
  strategies,
  ReactionConfig,
} from '@dao-strategies/core';

import { useCampaignFactory } from '../../hooks/useContracts';
import {
  deployCampaign,
  PeriodKeys,
  periodOptions,
  getPeriodType,
  PeriodType,
  strategyDetails,
  sharesFromDetails,
  SET_FROM_NOW,
  reactionConfigOptions,
} from '../campaign.support';
import {
  ACTIVATION_PERIOD,
  ACTIVE_DURATION,
  CHALLENGE_PERIOD,
  INCLUDED_CHAINS,
  oracleAddressMap,
} from '../../config/appConfig';
import { RouteNames } from '../MainPage';
import {
  AppButton,
  AppCallout,
  AppCard,
  AppDateInput,
  AppForm,
  AppFormField,
  AppHeading,
  AppInput,
  AppSelect,
  AppTag,
  AppTextArea,
  CampaignIcon,
  ExpansiveParagraph,
  HorizontalLine,
  RepoTag,
  SelectRow,
  SelectValue,
} from '../../components/styles/BasicElements';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { FormProgress } from './FormProgress';
import { TwoColumns } from '../../components/styles/LayoutComponents.styled';
import { AddCircle, FormPreviousLink, FormTrash, StatusCritical } from 'grommet-icons';
import { useGithubSearch } from '../../hooks/useGithubSearch';
import { RewardsTable } from '../../components/RewardsTable';
import { FormStatus, getButtonActions } from './buttons.actions';
import { useNowContext } from '../../hooks/useNow';
import { useUserError } from '../../hooks/useErrorContext';
import { ethers } from 'ethers';
import { SelectLogo } from '../../components/SelectLogo';
import { styleConstants, theme } from '../../components/styles/themes';
import { HEADER_HEIGHT } from '../AppHeader';
import { Parameter } from './parameter';
import { Address } from '../../components/Address';
import { StrategySelector } from './strategy.selector';
import { DateManager } from '../../utils/date.manager';
import { FieldLabel } from './field.label';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export interface ICampaignCreateProps {
  dum?: any;
}

export interface CampaignFormValues {
  logoPreview: string | undefined;
  title: string;
  description: string;
  logo: File | undefined;
  customAssetAddress: string;
  hasCustomAsset: boolean;
  chainName: string;
  strategyId: string;
  repositoryFullnames: string[];
  guardian: string;
  livePeriodChoice: string;
  customPeriodChoiceFrom: string;
  customPeriodChoiceTo: string;
  reactionsConfig: ReactionConfig;
}

export interface ProcessedFormValues {
  periodCustom: boolean;
}

const initChain = ChainsDetails.chains()[0];

const initialValues: CampaignFormValues =
  process.env.NODE_ENV === 'production'
    ? {
        title: '',
        guardian: '',
        logo: undefined,
        logoPreview: undefined,
        chainName: initChain.name,
        customAssetAddress: '',
        hasCustomAsset: false,
        description: '',
        strategyId: strategies.list()[0].info.id,
        repositoryFullnames: [],
        livePeriodChoice: periodOptions.get(PeriodKeys.last3Months) as string,
        customPeriodChoiceFrom: '',
        customPeriodChoiceTo: '',
        reactionsConfig: ReactionConfig.PRS_AND_REACTS,
      }
    : {
        title: 'Sample Campaign',
        guardian: '',
        logo: undefined,
        logoPreview: undefined,
        chainName: initChain.name,
        customAssetAddress: '',
        hasCustomAsset: false,
        description: 'My sample campaign description',
        strategyId: strategies.list()[0].info.id,
        repositoryFullnames: ['gershido/test-github-api'],
        livePeriodChoice: periodOptions.get(PeriodKeys.last3Months) as string,
        customPeriodChoiceFrom: '',
        customPeriodChoiceTo: '',
        reactionsConfig: ReactionConfig.PRS_AND_REACTS,
      };

const MORE_SOON = 'MORE_SOON';
const CREATE_FORM_KEY = 'CREATE_FORM_KEY';
const PER_PAGE = 8;
const DEBUG = true;

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const { account, chain, switchNetwork, connect } = useLoggedUser();
  const { showError } = useUserError();

  const { now, reset: resetNow } = useNowContext();
  const [pageIx, setPageIx] = useState<number>(0);

  const { checking, checkExist, getValidName, validRepo, isValid } = useGithubSearch();
  const [repo, setRepo] = useState<string>('');

  const [validated, setValidated] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  /**
   * Form data is kept in the formValues state. The strategy details is a computed
   * property that should change everytime the formValues change.
   *
   * When the user steps into the final page, a simulation is triggered depending
   * on wheather the start date of the strategy is older than today.
   */

  const [formValues, setFormValuesState] = useState<CampaignFormValues>(initialValues);
  const [shares, setShares] = useState<SharesRead | undefined>();
  const [simulating, setSimulating] = useState<boolean>(false);
  const [deploying, setDeploying] = useState<boolean>(false);

  const [storedForm, setStoredForm] = useLocalStorage(CREATE_FORM_KEY, undefined, 0);

  const chainId = ChainsDetails.chainOfName(formValues.chainName)?.chain.id;

  const checkStoredValues = () => {
    /** use stored form if found */
    if (storedForm) {
      onValuesUpdated(storedForm);
    }
  };

  /** initialize the chainId with the currently connected chainId */
  useEffect(() => {
    resetNow();

    if (chain !== undefined) {
      const connectedChainName = ChainsDetails.chainOfId(chain.id)?.chain.name;
      if (connectedChainName !== undefined) {
        setFormValues({ ...formValues, chainName: connectedChainName });
      } else {
        setFormValues({ ...formValues, chainName: ChainsDetails.chains()[0].name });
      }
    }

    checkStoredValues();
  }, []);

  const campaignFactory = useCampaignFactory(chainId);
  const navigate = useNavigate();

  /** details is a derived value */
  const details = strategyDetails(formValues, now, account);
  const periodType = getPeriodType(details, now);
  const isLogged = account !== undefined;

  const chainOptions = ChainsDetails.chains(INCLUDED_CHAINS).map((chain) => chain.name);
  const strategyOptions = strategies.list().map((s) => s.info.id);
  const selectedStrategy = strategies.get(formValues.strategyId);

  /** show one option */
  strategyOptions.push(MORE_SOON);

  if (selectedStrategy === undefined) {
    throw new Error(`selectedStrategy undefined`);
  }

  const finalDetails = shares !== undefined ? shares.details : details;

  if (DEBUG) console.log('CampaignCreate - render');

  /** Prepare all the parameters to deply the campaign and call the deployCampaign function */
  const create = useCallback(async (): Promise<void> => {
    if (account === undefined) throw new Error('account undefined');
    if (campaignFactory === undefined) throw new Error('campaignFactoryContract undefined');

    /** the strategy details are the same used for simulation, unless no simulation was done */
    if (finalDetails === undefined) throw new Error();

    if (chainId === undefined) {
      throw new Error(`chain ${formValues.chainName} not found`);
    }
    const activationTime = 0;
    const oracle = oracleAddressMap.get(chainId);
    if (oracle === undefined) {
      throw new Error(`Oracle address not found for chain ${chainId}`);
    }

    /** the address is not yet known */
    const otherDetails: CampaignCreateDetails = {
      title: formValues.title,
      logoUrl: '',
      guardian: formValues.guardian,
      description: formValues.description,
      oracle,
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
      const campaignAddress = await deployCampaign(
        campaignFactory,
        shares.uri,
        otherDetails,
        finalDetails,
        formValues.logo
      );
      setCreating(false);
      setStoredForm(undefined);
      navigate(RouteNames.Campaign(campaignAddress));
    } catch (e) {
      showError('Error creating campaign');
      setCreating(false);
      console.log(e);
    }

    setDeploying(false);
  }, [finalDetails, account, campaignFactory, chainId, details, formValues]);

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

    setStoredForm(nextFormValues);
    setFormValuesState(nextFormValues);
  };

  /** Hook called everytime any field in the form is updated, it keeps the formValues state in synch */
  const onValuesUpdated = (values: CampaignFormValues) => {
    if (DEBUG) console.log('CampaignCreate - onValuesUpdated()', { values });

    /** ignore some cases */
    if (values.strategyId === MORE_SOON) {
      return;
    }

    /** auto-set start and end dates */
    if (
      values.livePeriodChoice === periodOptions.get(PeriodKeys.custom) &&
      formValues.livePeriodChoice !== periodOptions.get(PeriodKeys.custom)
    ) {
      if (values.customPeriodChoiceFrom === '' && now !== undefined) {
        values.customPeriodChoiceFrom = now.toString();
      }
    }

    /** set end date as the start date initially */
    if (formValues.customPeriodChoiceFrom === '' && values.customPeriodChoiceFrom !== '') {
      if (values.customPeriodChoiceTo === '') {
        values.customPeriodChoiceTo = values.customPeriodChoiceFrom;
      }
    }

    if (validated) {
      // validate every change after the first time
      validate(values);
    }
    setFormValues(values);
  };

  const validate = (values: CampaignFormValues): string[] => {
    const detailsValidate = strategyDetails(values, now, account);

    if (DEBUG) console.log('CampaignCreate - validate()', { values, detailsValidate });
    const errors: string[] = [];

    if (values.title === '') errors.push('title cannot be empty');

    if (!ethers.utils.isAddress(values.guardian)) errors.push('the admin must be a valid ethereum address');

    if (values.repositoryFullnames.length === 0) errors.push('no repositories specified');

    if (values.hasCustomAsset && !ethers.utils.isAddress(values.customAssetAddress))
      errors.push('custom asset address not correct');

    if (
      values.livePeriodChoice === periodOptions.get(PeriodKeys.custom) &&
      (values.customPeriodChoiceFrom === '' ||
        values.customPeriodChoiceTo === '' ||
        values.customPeriodChoiceFrom === undefined ||
        values.customPeriodChoiceTo === undefined)
    )
      errors.push(`custom period not specificed`);

    if (detailsValidate) {
      if (detailsValidate.strategyParams.timeRange.start >= detailsValidate.strategyParams.timeRange.end) {
        errors.push(`The end of the live period cannot be after its start`);
      }
    }

    if (DEBUG) console.log('CampaignCreate - validate()', { values, detailsValidate, errors });

    setValidated(true);
    setErrors(errors);

    return errors;
  };

  const firstSimulate = useMemo(() => {
    return async (): Promise<void> => {
      if (DEBUG) console.log('CampaignCreate - simulate()');
      setSimulating(true);

      await simulate({ number: 0, perPage: PER_PAGE });

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
      return <AddCircle color={styleConstants.colors.primaryLight}></AddCircle>;
    }
    // else
    if (status.checking) {
      return <Spinner></Spinner>;
    }
    // else
    if (status.inputExists && status.repoIsNew) {
      return <AddCircle onClick={() => addRepo(validRepo)} color={styleConstants.colors.primary}></AddCircle>;
    }
    // else
    if (status.inputDontExist || !status.repoIsNew) {
      return <StatusCritical color={styleConstants.colors.alertText}></StatusCritical>;
    }
  })(existStatus);

  const addRepo = (repo: string) => {
    formValues.repositoryFullnames.push(getValidName(repo) as string);
    onValuesUpdated({ ...formValues });
    repoNameChanged('');
  };

  const clearRepo = useCallback(
    (repo: string) => {
      const ix = formValues.repositoryFullnames.indexOf(repo);
      formValues.repositoryFullnames.splice(ix, 1);
      setFormValues({ ...formValues });
    },
    [formValues]
  );

  const switchNetworkCall = useCallback(() => {
    if (switchNetwork) switchNetwork(chainId);
  }, [chainId]);

  const setAccountAsGuardian = useCallback(() => {
    if (account !== undefined) {
      onValuesUpdated({ ...formValues, guardian: account });
    }
  }, [formValues, account]);

  const setFromNow = useCallback(() => {
    if (formValues.customPeriodChoiceFrom !== SET_FROM_NOW) {
      if (now !== undefined) {
        setFormValues({ ...formValues, customPeriodChoiceFrom: SET_FROM_NOW });
      }
    } else {
      if (now !== undefined) {
        setFormValues({ ...formValues, customPeriodChoiceFrom: now.toString() });
      }
    }
  }, [formValues, now]);

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
      wrongNetwork: chain !== undefined && chain.id !== chainId,
    };
  }, [pageIx, periodType, isLogged, simulating, shares, creating, deploying, errors.length, chain, chainId]);

  const validateFormValues = useCallback(() => {
    return validate(formValues);
  }, [formValues]);

  const { rightText, rightAction, rightDisabled } = getButtonActions(status, pageIx, {
    connect,
    create,
    setPageIx,
    simulate: firstSimulate,
    validate: validateFormValues,
    switchNetwork: switchNetworkCall,
  });

  useEffect(() => {
    if (status.page.isReview && status.canSimulate && !status.isSimulating && !status.wasSimulated) {
      void simulate({ number: 0, perPage: 10 });
    }
  }, [status, account, simulate]);

  const leftClicked = () => {
    if (pageIx > 0) setPageIx(pageIx - 1);
    else navigate(RouteNames.Base);
  };

  const leftText = () => {
    if (pageIx === 0) return 'Cancel';
    return (
      <Box direction="row" align="center">
        <FormPreviousLink style={{ marginRight: '6px' }}></FormPreviousLink>Previous
      </Box>
    );
  };

  const simulationText =
    periodType === PeriodType.retroactive ? (
      `The rewards for this contribution would be shared accordingly.`
    ) : periodType === PeriodType.ongoing ? (
      <AppCallout style={{ marginTop: '24px' }}>
        Since the contribution period is not over, this is not the final result
      </AppCallout>
    ) : (
      ''
    );

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
    <Box style={{ fontSize: styleConstants.textFontSizes.small }}>
      <AppFormField
        name="title"
        label={<FieldLabel label="Give this Campaign a name" required></FieldLabel>}
        style={{ marginBottom: '40px' }}>
        <AppInput name="title" placeholder="Name"></AppInput>
      </AppFormField>

      <AppFormField name="description" label="Describe what it is about" style={{ marginBottom: '40px' }}>
        <AppTextArea placeholder="" name="description"></AppTextArea>
      </AppFormField>

      <SelectLogo onValuesUpdated={onValuesUpdated} campaignFormValues={formValues} />

      <AppFormField
        name="chainName"
        label={
          <FieldLabel
            label="Select Network"
            required
            help="The campaign funds will be controlled by a contract deployed on this network."></FieldLabel>
        }
        style={{ marginBottom: '40px' }}>
        <AppSelect name="chainName" options={chainOptions}></AppSelect>
      </AppFormField>

      <AppFormField
        name="hasCustomAsset"
        label={
          <FieldLabel
            label="Reward Token"
            help="If you want the campaign to raise funds on a special ERC-20 token, please add it here. By default, campaigns can be funded with the native token and popular stable-coins of each network."></FieldLabel>
        }
        style={{
          marginBottom: formValues.hasCustomAsset ? '10px' : '40px',
          fontSize: styleConstants.textFontSizes.small,
        }}>
        <CheckBox name="hasCustomAsset" label="Use custom asset" />
      </AppFormField>

      {formValues.hasCustomAsset ? (
        <AppFormField name="customAssetAddress" label="Token address" style={{ marginBottom: '40px' }}>
          <AppInput
            name="customAssetAddress"
            placeholder="0x0..."
            style={{ border: '1px solid ', borderRadius: '20px' }}></AppInput>
        </AppFormField>
      ) : (
        <></>
      )}

      <AppFormField
        name="guardian"
        label={
          <FieldLabel
            label="Add the Admin address"
            required
            help='The campaign "Admin" can review the results of the campaign (published by the oracle) before they are effective and revert them if these are not satisfactory. This means that funds are, ultimately, not under the control of the oracle.'></FieldLabel>
        }
        style={{ marginBottom: '40px' }}>
        <AppInput name="guardian" placeholder="0x...."></AppInput>
        {account !== undefined && account !== formValues.guardian ? (
          <AppButton
            style={{ marginLeft: '16px' }}
            onClick={() => setAccountAsGuardian()}
            label={
              <Box direction="row" align="center">
                set current account{' '}
                <Address disableClick style={{ marginLeft: '4px' }} address={account} chainId={chainId}></Address>
              </Box>
            }
            _type="inline"
          />
        ) : (
          <></>
        )}
      </AppFormField>
    </Box>,
    <Box style={{ fontSize: styleConstants.textFontSizes.small }}>
      <Box style={{ marginBottom: '64px' }}>
        <AppFormField
          name="strategyId"
          label={
            <FieldLabel
              label="Select a rule-set"
              help="The campaign will compute a list of shareholders based on programmed rules. These are programmatic rules that can fetch data from web2 and web3 protocols."></FieldLabel>
          }>
          <AppSelect
            value={<StrategySelector strategy={selectedStrategy}></StrategySelector>}
            name="strategyId"
            options={strategyOptions}>
            {(option: string) => {
              if (option === MORE_SOON) {
                return (
                  <Box
                    justify="center"
                    direction="row"
                    style={{ padding: '12px 0px', color: styleConstants.colors.ligthGrayText }}>
                    More coming soon
                  </Box>
                );
              }

              const strategy = strategies.get(option);
              if (strategy === undefined) throw new Error(`never`);

              return <StrategySelector strategy={strategy}></StrategySelector>;
            }}
          </AppSelect>
        </AppFormField>
      </Box>

      <TwoColumns line={false} gap={20} frs={[0.8, 1.2]}>
        <Box>
          <AppFormField
            name="reactionsConfig"
            label={
              <FieldLabel
                label="Count contribution scores using"
                help={
                  <Box>
                    <ul style={{ padding: '0px 0px 0px 16px' }}>
                      <li>
                        <b>{reactionConfigOptions.get(ReactionConfig.ONLY_PRS)}</b>: Each merged pull-request gives one
                        point.
                      </li>
                      <li style={{ marginTop: '10px' }}>
                        <b>{reactionConfigOptions.get(ReactionConfig.ONLY_REACTS)}</b>: Each reaction to a merged
                        pull-request given by a previous contributor opf the reposiotry gives one point. One
                        pull-request can give more than one points.
                      </li>
                      <li style={{ marginTop: '10px' }}>
                        <b>{reactionConfigOptions.get(ReactionConfig.PRS_AND_REACTS)}</b>: Each reaction to a merged
                        pull-request given by a previous repository contributor gives one point. One pull-request can
                        give more than one points.
                      </li>
                    </ul>
                  </Box>
                }></FieldLabel>
            }>
            <AppSelect
              name="reactionsConfig"
              options={Array.from(reactionConfigOptions.keys())}
              value={<SelectValue>{reactionConfigOptions.get(formValues.reactionsConfig)}</SelectValue>}>
              {(option: ReactionConfig) => {
                return <SelectRow>{reactionConfigOptions.get(option)}</SelectRow>;
              }}
            </AppSelect>
          </AppFormField>
        </Box>
        <Box>
          <Image src="/images/gh-pr-diagram.png" />
        </Box>
      </TwoColumns>

      <HorizontalLine style={{ margin: '40px 0px' }}></HorizontalLine>

      <TwoColumns grid={{ style: { marginBottom: '66px' } }}>
        <Box>
          <AppFormField
            name="description"
            label={
              <Box>
                {
                  <FieldLabel
                    style={{ marginBottom: '8px' }}
                    label="Add Github repositories"
                    help="Pull-requests made to any of these repositories (can be more than one) will count towards receiving shares on this campaign."></FieldLabel>
                }
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
          </AppFormField>

          <>
            {formValues.repositoryFullnames.length > 0 ? (
              formValues.repositoryFullnames.map((repo) => {
                return (
                  <Box style={{ width: '100%', marginTop: '25px' }} direction="row" justify="between" align="center">
                    <RepoTag repo={repo} />
                    <Box onClick={() => clearRepo(repo)} style={{ width: '28px', height: '28px' }}>
                      <FormTrash
                        style={{ width: '28px', height: '28px' }}
                        color={styleConstants.colors.ligthGrayText}></FormTrash>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box style={{ marginTop: '16px', textAlign: 'center', color: styleConstants.colors.ligthGrayText }}>
                (no repositores currently selected)
              </Box>
            )}
          </>
        </Box>

        <Box>
          <AppFormField
            name="livePeriodChoice"
            label={
              <FieldLabel
                label="Set the Contribution Period"
                help="Pull-requests that are merged within this time period will count towards receiving shares on this campaign."></FieldLabel>
            }>
            <AppSelect name="livePeriodChoice" options={Array.from(periodOptions.values())}></AppSelect>
          </AppFormField>

          {formValuesProcessed().periodCustom ? (
            <>
              <AppFormField
                name="customPeriodChoiceFrom"
                label={
                  <Box direction="row" align="center">
                    From:{' '}
                    <AppButton
                      style={{ marginLeft: '6px' }}
                      onClick={() => setFromNow()}
                      _type="inline"
                      label={
                        formValues.customPeriodChoiceFrom !== SET_FROM_NOW ? '(set from now on)' : '(set specific date)'
                      }
                    />
                  </Box>
                }>
                {formValues.customPeriodChoiceFrom !== SET_FROM_NOW ? (
                  <AppDateInput name="customPeriodChoiceFrom"></AppDateInput>
                ) : (
                  <AppTag style={{ width: '100%', textAlign: 'center' }}>From now on</AppTag>
                )}
              </AppFormField>
              <AppFormField name="customPeriodChoiceTo" label="To">
                <AppDateInput name="customPeriodChoiceTo"></AppDateInput>
              </AppFormField>
            </>
          ) : (
            <></>
          )}
        </Box>
      </TwoColumns>
    </Box>,

    <Box>
      <Box>
        <Box>
          <AppHeading level="3" style={{ margin: '16px 0px 40px 0px' }}>
            Basic Info
          </AppHeading>

          <TwoColumns>
            <Box>
              {' '}
              <Parameter label="Logo">
                <CampaignIcon iconSize="64px" src={formValues.logoPreview && formValues.logoPreview}></CampaignIcon>
              </Parameter>
              <Parameter style={{ marginTop: '40px' }} label="Campaign Name" text={formValues.title}></Parameter>
              <Parameter style={{ marginTop: '40px' }} label="Description">
                <ExpansiveParagraph maxHeight={100}>
                  {formValues.description !== '' ? formValues.description : '-'}
                </ExpansiveParagraph>
              </Parameter>
            </Box>
            <Box>
              <Parameter label="network" text={formValues.chainName}></Parameter>

              <Parameter style={{ marginTop: '40px' }} label="Custom ERC-20 token">
                {formValues.hasCustomAsset ? (
                  <Address address={formValues.customAssetAddress} chainId={chainId}></Address>
                ) : (
                  <>-</>
                )}
              </Parameter>

              <Parameter style={{ marginTop: '40px' }} label="Guardian ADdress">
                <Address address={formValues.guardian} chainId={chainId}></Address>
              </Parameter>
            </Box>
          </TwoColumns>

          <HorizontalLine style={{ margin: '40px 0px' }}></HorizontalLine>

          <AppHeading level="3" style={{ margin: '0px 0px 25px 0px' }}>
            Configuration
          </AppHeading>

          <TwoColumns>
            <Box>
              <Parameter label="Rule-set">
                <StrategySelector strategy={selectedStrategy}></StrategySelector>
              </Parameter>
              <Parameter style={{ marginTop: '40px' }} label="Github Repositories">
                {formValues.repositoryFullnames.map((name) => {
                  return <RepoTag repo={name} style={{ marginBottom: '12px' }} />;
                })}
              </Parameter>
            </Box>
            <Box>
              <Parameter label="Contribution Period">
                <Box justify="start" direction="row">
                  <Box style={{ width: '60px' }}>From:</Box>
                  <Box>{DateManager.from(finalDetails?.strategyParams.timeRange.start).toString()}</Box>
                </Box>
                <Box justify="start" direction="row">
                  <Box style={{ width: '60px' }}>To: </Box>
                  <Box>{DateManager.from(finalDetails?.strategyParams.timeRange.end).toString()}</Box>
                </Box>
              </Parameter>
            </Box>
          </TwoColumns>

          <HorizontalLine style={{ margin: '40px 0px' }}></HorizontalLine>

          <AppHeading level="3" margin="0px 0px 25px 0px">
            Contributors Board
          </AppHeading>

          <Box>
            {account !== undefined ? (
              <Box style={{ paddingRight: '16px' }}>
                <Box style={{ marginBottom: '24px' }}>{shares !== undefined ? <Text>{simulationText}</Text> : ''}</Box>
                <RewardsTable
                  invert
                  shares={shares}
                  chainId={chainId}
                  updatePage={updatePage}
                  perPage={PER_PAGE}></RewardsTable>
              </Box>
            ) : (
              <Box
                style={{
                  height: '738px',
                  width: '100%',
                  border: '2px solid',
                  borderColor: styleConstants.colors.lightGrayBorder,
                  borderRadius: '20px',
                }}
                align="center"
                justify="center">
                <Box style={{ maxWidth: '300px' }}>
                  Please connect your wallet to see the rewards of this configuration.
                  <AppButton style={{ marginTop: '20px' }} onClick={() => connect()}>
                    Connect Wallet
                  </AppButton>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>,
  ];

  return (
    <Box justify="start" align="center" style={{ width: '100%' }}>
      <Box
        justify="start"
        align="center"
        style={{ marginTop: HEADER_HEIGHT, padding: '2vw 3vw 70px 3vw', width: '100%' }}>
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
            <AppHeading
              level="2"
              style={{
                textAlign: 'left',
                margin: '40px 0px 0px 0px',
              }}>
              {heading}
            </AppHeading>
            <HorizontalLine style={{ margin: '24px 0px' }}></HorizontalLine>
          </Box>

          <AppForm value={formValues} onChange={onValuesUpdated as any} style={{ maxWidth: '800px' }}>
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
              <AppButton secondary gray label={leftText()} onClick={() => leftClicked()} />
              <AppButton primary label={rightText} onClick={() => rightAction()} disabled={rightDisabled} />
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
