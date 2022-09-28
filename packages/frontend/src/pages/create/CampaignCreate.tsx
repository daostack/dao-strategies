import { Box, CheckBox, FormField, Layer, Text, Image, Spinner } from 'grommet';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ChainsDetails,
  getCampaignUri,
  CampaignCreateDetails,
  SharesRead,
  Page,
  strategies,
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
  AppCard,
  AppDateInput,
  AppForm,
  AppHeading,
  AppInput,
  AppSelect,
  AppTag,
  AppTextArea,
  CampaignIcon,
  ExpansiveParagraph,
  HorizontalLine,
} from '../../components/styles/BasicElements';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { FormProgress } from './FormProgress';
import { TwoColumns } from '../../components/styles/LayoutComponents.styled';
import { AddCircle, FormPreviousLink, FormTrash, StatusCritical } from 'grommet-icons';
import { useGithubSearch } from '../../hooks/useGithubSearch';
import { RewardsTable } from '../../components/RewardsTable';
import { FormStatus, getButtonActions } from './buttons.actions';
import { useNow } from '../../hooks/useNow';
import { useUserError } from '../../hooks/useErrorContext';
import { ethers } from 'ethers';
import { styleConstants, theme } from '../../components/styles/themes';
import { HEADER_HEIGHT } from '../AppHeader';
import { Parameter } from './parameter';
import { Address } from '../../components/Address';
import { StrategySelector } from './strategy.selector';
import { DateManager } from '../../utils/date.manager';

export interface ICampaignCreateProps {
  dum?: any;
}

export interface CampaignFormValues {
  title: string;
  description: string;
  customAssetAddress: string;
  hasCustomAsset: boolean;
  chainName: string;
  strategyId: string;
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
  title: '', // 'sample',
  guardian: '', // '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  chainName: initChain.name,
  customAssetAddress: '', // '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
  hasCustomAsset: false,
  description: '', // 'A description',
  strategyId: strategies.list()[0].info.id,
  repositoryFullnames: [], //['pepoospina/js-uprtcl'],
  livePeriodChoice: periodOptions.get(PeriodKeys.last3Months) as string,
  customPeriodChoiceFrom: '',
  customPeriodChoiceTo: '',
};

const GITHUB_DOMAIN = 'https://www.github.com/';
const DEBUG = false;

export const CampaignCreate: FC<ICampaignCreateProps> = () => {
  const { account, chain, switchNetwork, connect } = useLoggedUser();
  const { showError } = useUserError();

  const { now } = useNow();
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

  const chainId = ChainsDetails.chainOfName(formValues.chainName)?.chain.id;

  /** initialize the chainId with the currently connected chainId */
  useEffect(() => {
    if (chain !== undefined) {
      const connectedChainName = ChainsDetails.chainOfId(chain.id)?.chain.name;
      if (connectedChainName !== undefined) {
        setFormValues({ ...formValues, chainName: connectedChainName });
      }
    }
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
      const campaignAddress = await deployCampaign(campaignFactory, shares.uri, otherDetails, finalDetails);

      setCreating(false);
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

  const requiredField = (text: string) => {
    return (
      <span>
        <span style={{ color: 'red', marginRight: '4px' }}>*</span>
        {text}
      </span>
    );
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

  const clearRepo = (repo: string) => {
    const ix = formValues.repositoryFullnames.indexOf(repo);
    formValues.repositoryFullnames.splice(ix, 1);
    setFormValues({ ...formValues });
  };

  const switchNetworkCall = useCallback(() => {
    if (switchNetwork) switchNetwork(chainId);
  }, [chainId]);

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

  const { rightText, rightAction, rightDisabled } = getButtonActions(status, pageIx, {
    connect,
    create,
    setPageIx,
    simulate: firstSimulate,
    validate,
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
        <FormField name="title" label={requiredField('Give this Campaign a name')} style={{ marginBottom: '40px' }}>
          <AppInput name="title" placeholder="Name"></AppInput>
        </FormField>

        <FormField name="description" label="Describe what it is about" style={{ marginBottom: '40px' }}>
          <AppTextArea placeholder="" name="description"></AppTextArea>
        </FormField>

        <FormField name="chainName" label="Select Network" style={{ marginBottom: '40px' }}>
          <AppSelect name="chainName" options={chainOptions}></AppSelect>
        </FormField>

        <FormField
          name="hasCustomAsset"
          label="Reward Tokens"
          style={{
            marginBottom: formValues.hasCustomAsset ? '10px' : '40px',
            fontSize: styleConstants.textFontSizes.small,
          }}>
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

        <FormField name="guardian" label={requiredField('Add the Admin address')} style={{ marginBottom: '40px' }}>
          <AppInput name="guardian" placeholder="0x...."></AppInput>
        </FormField>
      </>
    </Box>,
    <Box>
      <Box style={{ marginBottom: '64px' }}>
        <FormField name="strategyId" label="Select a Rule-set">
          <AppSelect
            value={
              <StrategySelector
                style={{
                  border: '1px solid',
                  borderRadius: '32px',
                  borderColor: styleConstants.colors.lightGrayBorder,
                }}
                strategy={selectedStrategy}></StrategySelector>
            }
            name="strategyId"
            options={strategyOptions}>
            {(option: string) => {
              const strategy = strategies.get(option);
              if (strategy === undefined) throw new Error(`never`);

              return <StrategySelector strategy={strategy}></StrategySelector>;
            }}
          </AppSelect>
        </FormField>
      </Box>

      <TwoColumns grid={{ style: { marginBottom: '66px' } }}>
        <Box>
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
        </Box>

        <Box>
          <FormField name="livePeriodChoice" label="Live period">
            <AppSelect name="livePeriodChoice" options={Array.from(periodOptions.values())}></AppSelect>
          </FormField>

          {formValuesProcessed().periodCustom ? (
            <>
              <FormField name="customPeriodChoiceFrom" label="From">
                <AppDateInput name="customPeriodChoiceFrom"></AppDateInput>
              </FormField>
              <FormField name="customPeriodChoiceTo" label="To">
                <AppDateInput name="customPeriodChoiceTo"></AppDateInput>
              </FormField>
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
                <CampaignIcon
                  iconSize="64px"
                  src="https://img-cdn.inc.com/image/upload/w_1920,h_1080,c_fill/images/panoramic/GettyImages-1011930076_460470_i7oi1u.jpg"></CampaignIcon>
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
                  return (
                    <AppTag style={{ marginBottom: '12px' }}>
                      <a
                        style={{ textDecoration: 'none', color: styleConstants.colors.ligthGrayText }}
                        target="_blank"
                        href={`${GITHUB_DOMAIN}${repo}`}
                        rel="noreferrer">
                        {name}
                      </a>
                    </AppTag>
                  );
                })}
              </Parameter>
            </Box>
            <Box>
              <Parameter label="Live Period">
                <Box justify="start" direction="row">
                  <Box style={{ width: '60px' }}>From: </Box>
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
            {status.isSimulating ? (
              'simulating'
            ) : shares !== undefined && account !== undefined ? (
              <Box style={{ paddingRight: '16px' }}>
                <Box style={{ marginBottom: '24px' }}>{shares !== undefined ? <Text>{simulationText}</Text> : ''}</Box>
                {status.wasSimulated ? (
                  <RewardsTable invert shares={shares} updatePage={updatePage}></RewardsTable>
                ) : (
                  ''
                )}
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
              <AppButton primary gray label={rightText} onClick={() => rightAction()} disabled={rightDisabled} />
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
