/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface CampaignInterface extends utils.Interface {
  contractName: "Campaign";
  functions: {
    "CHALLENGE_PERIOD()": FunctionFragment;
    "TOTAL_SHARES()": FunctionFragment;
    "activationTime()": FunctionFragment;
    "approvedMerkleRoot()": FunctionFragment;
    "balanceOfAsset(address)": FunctionFragment;
    "challenge(uint8)": FunctionFragment;
    "claim(address,uint256,bytes32[],address)": FunctionFragment;
    "claimed(address,address)": FunctionFragment;
    "convertToReward(address)": FunctionFragment;
    "fund(address,uint256)": FunctionFragment;
    "getValidRoot()": FunctionFragment;
    "guardian()": FunctionFragment;
    "initCampaign(bytes32,bytes32,address,address)": FunctionFragment;
    "locked()": FunctionFragment;
    "oracle()": FunctionFragment;
    "pendingMerkleRoot()": FunctionFragment;
    "proposeShares(bytes32,bytes32)": FunctionFragment;
    "providers(address,address)": FunctionFragment;
    "rewardsAvailableToClaimer(address,uint256,bytes32[],address)": FunctionFragment;
    "setLock(bool)": FunctionFragment;
    "strategyUri()": FunctionFragment;
    "totalClaimed(address)": FunctionFragment;
    "totalFundsReceived(address)": FunctionFragment;
    "totalReward(address)": FunctionFragment;
    "withdrawFunds(address,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "CHALLENGE_PERIOD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "TOTAL_SHARES",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "activationTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "approvedMerkleRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfAsset",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "challenge",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [string, BigNumberish, BytesLike[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "claimed",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "convertToReward",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "fund",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getValidRoot",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initCampaign",
    values: [BytesLike, BytesLike, string, string]
  ): string;
  encodeFunctionData(functionFragment: "locked", values?: undefined): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingMerkleRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proposeShares",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "providers",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsAvailableToClaimer",
    values: [string, BigNumberish, BytesLike[], string]
  ): string;
  encodeFunctionData(functionFragment: "setLock", values: [boolean]): string;
  encodeFunctionData(
    functionFragment: "strategyUri",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalClaimed",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalFundsReceived",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "totalReward", values: [string]): string;
  encodeFunctionData(
    functionFragment: "withdrawFunds",
    values: [string, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "CHALLENGE_PERIOD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TOTAL_SHARES",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "activationTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approvedMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "challenge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "convertToReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fund", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getValidRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initCampaign",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "locked", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposeShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "providers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsAvailableToClaimer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setLock", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "strategyUri",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalClaimed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalFundsReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunds",
    data: BytesLike
  ): Result;

  events: {
    "Challenge(uint8)": EventFragment;
    "Claim(address,uint256,uint256,address)": EventFragment;
    "Fund(address,uint256,address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "SharesMerkleRoot(bytes32,bytes32,uint256)": EventFragment;
    "Withdraw(address,uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Challenge"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claim"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Fund"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SharesMerkleRoot"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export type ChallengeEvent = TypedEvent<[number], { action: number }>;

export type ChallengeEventFilter = TypedEventFilter<ChallengeEvent>;

export type ClaimEvent = TypedEvent<
  [string, BigNumber, BigNumber, string],
  { account: string; share: BigNumber; reward: BigNumber; assset: string }
>;

export type ClaimEventFilter = TypedEventFilter<ClaimEvent>;

export type FundEvent = TypedEvent<
  [string, BigNumber, string],
  { provider: string; amount: BigNumber; asset: string }
>;

export type FundEventFilter = TypedEventFilter<FundEvent>;

export type InitializedEvent = TypedEvent<[number], { version: number }>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export type SharesMerkleRootEvent = TypedEvent<
  [string, string, BigNumber],
  { sharesMerkleRoot: string; sharesUri: string; activationTime: BigNumber }
>;

export type SharesMerkleRootEventFilter =
  TypedEventFilter<SharesMerkleRootEvent>;

export type WithdrawEvent = TypedEvent<
  [string, BigNumber, string],
  { account: string; amount: BigNumber; asset: string }
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface Campaign extends BaseContract {
  contractName: "Campaign";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CampaignInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<[BigNumber]>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<[BigNumber]>;

    activationTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    approvedMerkleRoot(overrides?: CallOverrides): Promise<[string]>;

    balanceOfAsset(
      asset: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    challenge(
      action: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    convertToReward(
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fund(
      asset: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getValidRoot(
      overrides?: CallOverrides
    ): Promise<[string] & { root: string }>;

    guardian(overrides?: CallOverrides): Promise<[string]>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    locked(overrides?: CallOverrides): Promise<[boolean]>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    pendingMerkleRoot(overrides?: CallOverrides): Promise<[string]>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    providers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    rewardsAvailableToClaimer(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { total: BigNumber }>;

    setLock(
      _lock: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    strategyUri(overrides?: CallOverrides): Promise<[string]>;

    totalClaimed(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalFundsReceived(
      asset: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { total: BigNumber }>;

    totalReward(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    withdrawFunds(
      account: string,
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

  TOTAL_SHARES(overrides?: CallOverrides): Promise<BigNumber>;

  activationTime(overrides?: CallOverrides): Promise<BigNumber>;

  approvedMerkleRoot(overrides?: CallOverrides): Promise<string>;

  balanceOfAsset(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

  challenge(
    action: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    account: string,
    share: BigNumberish,
    proof: BytesLike[],
    asset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimed(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  convertToReward(
    asset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fund(
    asset: string,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getValidRoot(overrides?: CallOverrides): Promise<string>;

  guardian(overrides?: CallOverrides): Promise<string>;

  initCampaign(
    _sharesMerkleRoot: BytesLike,
    _strategyUri: BytesLike,
    _guardian: string,
    _oracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  locked(overrides?: CallOverrides): Promise<boolean>;

  oracle(overrides?: CallOverrides): Promise<string>;

  pendingMerkleRoot(overrides?: CallOverrides): Promise<string>;

  proposeShares(
    _sharesMerkleRoot: BytesLike,
    _sharesUri: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  providers(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  rewardsAvailableToClaimer(
    account: string,
    share: BigNumberish,
    proof: BytesLike[],
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setLock(
    _lock: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  strategyUri(overrides?: CallOverrides): Promise<string>;

  totalClaimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalFundsReceived(
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  totalReward(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  withdrawFunds(
    account: string,
    asset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<BigNumber>;

    activationTime(overrides?: CallOverrides): Promise<BigNumber>;

    approvedMerkleRoot(overrides?: CallOverrides): Promise<string>;

    balanceOfAsset(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    challenge(action: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: CallOverrides
    ): Promise<void>;

    claimed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertToReward(asset: string, overrides?: CallOverrides): Promise<void>;

    fund(
      asset: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getValidRoot(overrides?: CallOverrides): Promise<string>;

    guardian(overrides?: CallOverrides): Promise<string>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: CallOverrides
    ): Promise<void>;

    locked(overrides?: CallOverrides): Promise<boolean>;

    oracle(overrides?: CallOverrides): Promise<string>;

    pendingMerkleRoot(overrides?: CallOverrides): Promise<string>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    providers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsAvailableToClaimer(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setLock(_lock: boolean, overrides?: CallOverrides): Promise<void>;

    strategyUri(overrides?: CallOverrides): Promise<string>;

    totalClaimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalFundsReceived(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalReward(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdrawFunds(
      account: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Challenge(uint8)"(action?: null): ChallengeEventFilter;
    Challenge(action?: null): ChallengeEventFilter;

    "Claim(address,uint256,uint256,address)"(
      account?: null,
      share?: null,
      reward?: null,
      assset?: null
    ): ClaimEventFilter;
    Claim(
      account?: null,
      share?: null,
      reward?: null,
      assset?: null
    ): ClaimEventFilter;

    "Fund(address,uint256,address)"(
      provider?: null,
      amount?: null,
      asset?: null
    ): FundEventFilter;
    Fund(provider?: null, amount?: null, asset?: null): FundEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "SharesMerkleRoot(bytes32,bytes32,uint256)"(
      sharesMerkleRoot?: null,
      sharesUri?: null,
      activationTime?: null
    ): SharesMerkleRootEventFilter;
    SharesMerkleRoot(
      sharesMerkleRoot?: null,
      sharesUri?: null,
      activationTime?: null
    ): SharesMerkleRootEventFilter;

    "Withdraw(address,uint256,address)"(
      account?: null,
      amount?: null,
      asset?: null
    ): WithdrawEventFilter;
    Withdraw(account?: null, amount?: null, asset?: null): WithdrawEventFilter;
  };

  estimateGas: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<BigNumber>;

    activationTime(overrides?: CallOverrides): Promise<BigNumber>;

    approvedMerkleRoot(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfAsset(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    challenge(
      action: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertToReward(
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fund(
      asset: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getValidRoot(overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<BigNumber>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    locked(overrides?: CallOverrides): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    pendingMerkleRoot(overrides?: CallOverrides): Promise<BigNumber>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    providers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsAvailableToClaimer(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setLock(
      _lock: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    strategyUri(overrides?: CallOverrides): Promise<BigNumber>;

    totalClaimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalFundsReceived(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalReward(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdrawFunds(
      account: string,
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    activationTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    approvedMerkleRoot(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfAsset(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    challenge(
      action: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    convertToReward(
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fund(
      asset: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getValidRoot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    locked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingMerkleRoot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    providers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardsAvailableToClaimer(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setLock(
      _lock: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    strategyUri(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalClaimed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalFundsReceived(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalReward(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawFunds(
      account: string,
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}