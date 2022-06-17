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
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface Erc20CampaignInterface extends utils.Interface {
  contractName: "Erc20Campaign";
  functions: {
    "CHALLENGE_PERIOD()": FunctionFragment;
    "TOTAL_SHARES()": FunctionFragment;
    "challenge(uint8)": FunctionFragment;
    "claim(address,uint256,bytes32[])": FunctionFragment;
    "claimed(address)": FunctionFragment;
    "guardian()": FunctionFragment;
    "initCampaign(bytes32,bytes32,address,address)": FunctionFragment;
    "initErc20Campaign(bytes32,bytes32,address,address,address)": FunctionFragment;
    "locked()": FunctionFragment;
    "oracle()": FunctionFragment;
    "proposeShares(bytes32,bytes32)": FunctionFragment;
    "providers(address)": FunctionFragment;
    "rewardToken()": FunctionFragment;
    "setLock(bool)": FunctionFragment;
    "strategyUri()": FunctionFragment;
    "totalClaimed()": FunctionFragment;
    "totalReward()": FunctionFragment;
    "transferValueIn(uint256)": FunctionFragment;
    "withdrawFunds(address)": FunctionFragment;
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
    functionFragment: "challenge",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [string, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "claimed", values: [string]): string;
  encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initCampaign",
    values: [BytesLike, BytesLike, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initErc20Campaign",
    values: [BytesLike, BytesLike, string, string, string]
  ): string;
  encodeFunctionData(functionFragment: "locked", values?: undefined): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proposeShares",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "providers", values: [string]): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setLock", values: [boolean]): string;
  encodeFunctionData(
    functionFragment: "strategyUri",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalClaimed",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferValueIn",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFunds",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "CHALLENGE_PERIOD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TOTAL_SHARES",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "challenge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimed", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initCampaign",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initErc20Campaign",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "locked", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proposeShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "providers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
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
    functionFragment: "totalReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferValueIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunds",
    data: BytesLike
  ): Result;

  events: {
    "Challenge(uint8)": EventFragment;
    "Claim(address,uint256,uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "SharesMerkleRoot(bytes32,bytes32,uint256)": EventFragment;
    "ValueIn(address,uint256)": EventFragment;
    "Withdraw(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Challenge"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claim"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SharesMerkleRoot"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ValueIn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export type ChallengeEvent = TypedEvent<[number], { action: number }>;

export type ChallengeEventFilter = TypedEventFilter<ChallengeEvent>;

export type ClaimEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { account: string; share: BigNumber; reward: BigNumber }
>;

export type ClaimEventFilter = TypedEventFilter<ClaimEvent>;

export type InitializedEvent = TypedEvent<[number], { version: number }>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export type SharesMerkleRootEvent = TypedEvent<
  [string, string, BigNumber],
  { sharesMerkleRoot: string; sharesUri: string; activationTime: BigNumber }
>;

export type SharesMerkleRootEventFilter =
  TypedEventFilter<SharesMerkleRootEvent>;

export type ValueInEvent = TypedEvent<
  [string, BigNumber],
  { provider: string; amount: BigNumber }
>;

export type ValueInEventFilter = TypedEventFilter<ValueInEvent>;

export type WithdrawEvent = TypedEvent<
  [string, BigNumber],
  { account: string; amount: BigNumber }
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface Erc20Campaign extends BaseContract {
  contractName: "Erc20Campaign";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: Erc20CampaignInterface;

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

    challenge(
      action: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimed(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    guardian(overrides?: CallOverrides): Promise<[string]>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initErc20Campaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    locked(overrides?: CallOverrides): Promise<[boolean]>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    providers(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    setLock(
      _lock: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    strategyUri(overrides?: CallOverrides): Promise<[string]>;

    totalClaimed(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferValueIn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawFunds(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

  TOTAL_SHARES(overrides?: CallOverrides): Promise<BigNumber>;

  challenge(
    action: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    account: string,
    share: BigNumberish,
    proof: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  guardian(overrides?: CallOverrides): Promise<string>;

  initCampaign(
    _sharesMerkleRoot: BytesLike,
    _strategyUri: BytesLike,
    _guardian: string,
    _oracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initErc20Campaign(
    _sharesMerkleRoot: BytesLike,
    _strategyUri: BytesLike,
    _guardian: string,
    _oracle: string,
    _rewardToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  locked(overrides?: CallOverrides): Promise<boolean>;

  oracle(overrides?: CallOverrides): Promise<string>;

  proposeShares(
    _sharesMerkleRoot: BytesLike,
    _sharesUri: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  providers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  setLock(
    _lock: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  strategyUri(overrides?: CallOverrides): Promise<string>;

  totalClaimed(overrides?: CallOverrides): Promise<BigNumber>;

  totalReward(overrides?: CallOverrides): Promise<BigNumber>;

  transferValueIn(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawFunds(
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<BigNumber>;

    challenge(action: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    claimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<string>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: CallOverrides
    ): Promise<void>;

    initErc20Campaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _rewardToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    locked(overrides?: CallOverrides): Promise<boolean>;

    oracle(overrides?: CallOverrides): Promise<string>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    providers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    setLock(_lock: boolean, overrides?: CallOverrides): Promise<void>;

    strategyUri(overrides?: CallOverrides): Promise<string>;

    totalClaimed(overrides?: CallOverrides): Promise<BigNumber>;

    totalReward(overrides?: CallOverrides): Promise<BigNumber>;

    transferValueIn(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawFunds(account: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "Challenge(uint8)"(action?: null): ChallengeEventFilter;
    Challenge(action?: null): ChallengeEventFilter;

    "Claim(address,uint256,uint256)"(
      account?: null,
      share?: null,
      reward?: null
    ): ClaimEventFilter;
    Claim(account?: null, share?: null, reward?: null): ClaimEventFilter;

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

    "ValueIn(address,uint256)"(
      provider?: null,
      amount?: null
    ): ValueInEventFilter;
    ValueIn(provider?: null, amount?: null): ValueInEventFilter;

    "Withdraw(address,uint256)"(
      account?: null,
      amount?: null
    ): WithdrawEventFilter;
    Withdraw(account?: null, amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<BigNumber>;

    challenge(
      action: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<BigNumber>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initErc20Campaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    locked(overrides?: CallOverrides): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    providers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    setLock(
      _lock: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    strategyUri(overrides?: CallOverrides): Promise<BigNumber>;

    totalClaimed(overrides?: CallOverrides): Promise<BigNumber>;

    totalReward(overrides?: CallOverrides): Promise<BigNumber>;

    transferValueIn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawFunds(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CHALLENGE_PERIOD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    TOTAL_SHARES(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    challenge(
      action: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initCampaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initErc20Campaign(
      _sharesMerkleRoot: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    locked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposeShares(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    providers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setLock(
      _lock: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    strategyUri(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalClaimed(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferValueIn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFunds(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
