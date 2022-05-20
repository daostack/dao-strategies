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
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace Campaign {
  export type SharesDataStruct = {
    totalShares: BigNumberish;
    sharesMerkleRoot: BytesLike;
  };

  export type SharesDataStructOutput = [BigNumber, string] & {
    totalShares: BigNumber;
    sharesMerkleRoot: string;
  };
}

export interface CampaignInterface extends utils.Interface {
  contractName: "Campaign";
  functions: {
    "campaignCancelled()": FunctionFragment;
    "cancelCampaign()": FunctionFragment;
    "claim(address,uint256,bytes32[])": FunctionFragment;
    "claimPeriodStart()": FunctionFragment;
    "claimed(address)": FunctionFragment;
    "funds(address)": FunctionFragment;
    "guardian()": FunctionFragment;
    "initCampaign((uint256,bytes32),bytes32,address,address,bool,uint256)": FunctionFragment;
    "oracle()": FunctionFragment;
    "publishShares((uint256,bytes32))": FunctionFragment;
    "shares()": FunctionFragment;
    "sharesPublished()": FunctionFragment;
    "totalClaimed()": FunctionFragment;
    "uri()": FunctionFragment;
    "withdrawFunds(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "campaignCancelled",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cancelCampaign",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [string, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "claimPeriodStart",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claimed", values: [string]): string;
  encodeFunctionData(functionFragment: "funds", values: [string]): string;
  encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initCampaign",
    values: [
      Campaign.SharesDataStruct,
      BytesLike,
      string,
      string,
      boolean,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "publishShares",
    values: [Campaign.SharesDataStruct]
  ): string;
  encodeFunctionData(functionFragment: "shares", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sharesPublished",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalClaimed",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "uri", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawFunds",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "campaignCancelled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelCampaign",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimPeriodStart",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimed", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "funds", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initCampaign",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "publishShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "shares", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sharesPublished",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalClaimed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "uri", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunds",
    data: BytesLike
  ): Result;

  events: {};
}

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
    campaignCancelled(overrides?: CallOverrides): Promise<[boolean]>;

    cancelCampaign(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimPeriodStart(overrides?: CallOverrides): Promise<[BigNumber]>;

    claimed(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    funds(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    guardian(overrides?: CallOverrides): Promise<[string]>;

    initCampaign(
      _shares: Campaign.SharesDataStruct,
      _uri: BytesLike,
      _guardian: string,
      _oracle: string,
      _sharesPublished: boolean,
      _claimPeriodStart: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    publishShares(
      _shares: Campaign.SharesDataStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    shares(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string] & { totalShares: BigNumber; sharesMerkleRoot: string }
    >;

    sharesPublished(overrides?: CallOverrides): Promise<[boolean]>;

    totalClaimed(overrides?: CallOverrides): Promise<[BigNumber]>;

    uri(overrides?: CallOverrides): Promise<[string]>;

    withdrawFunds(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  campaignCancelled(overrides?: CallOverrides): Promise<boolean>;

  cancelCampaign(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    account: string,
    share: BigNumberish,
    proof: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimPeriodStart(overrides?: CallOverrides): Promise<BigNumber>;

  claimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  funds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  guardian(overrides?: CallOverrides): Promise<string>;

  initCampaign(
    _shares: Campaign.SharesDataStruct,
    _uri: BytesLike,
    _guardian: string,
    _oracle: string,
    _sharesPublished: boolean,
    _claimPeriodStart: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  oracle(overrides?: CallOverrides): Promise<string>;

  publishShares(
    _shares: Campaign.SharesDataStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  shares(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string] & { totalShares: BigNumber; sharesMerkleRoot: string }
  >;

  sharesPublished(overrides?: CallOverrides): Promise<boolean>;

  totalClaimed(overrides?: CallOverrides): Promise<BigNumber>;

  uri(overrides?: CallOverrides): Promise<string>;

  withdrawFunds(
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    campaignCancelled(overrides?: CallOverrides): Promise<boolean>;

    cancelCampaign(overrides?: CallOverrides): Promise<void>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    claimPeriodStart(overrides?: CallOverrides): Promise<BigNumber>;

    claimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    funds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<string>;

    initCampaign(
      _shares: Campaign.SharesDataStruct,
      _uri: BytesLike,
      _guardian: string,
      _oracle: string,
      _sharesPublished: boolean,
      _claimPeriodStart: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    oracle(overrides?: CallOverrides): Promise<string>;

    publishShares(
      _shares: Campaign.SharesDataStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    shares(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string] & { totalShares: BigNumber; sharesMerkleRoot: string }
    >;

    sharesPublished(overrides?: CallOverrides): Promise<boolean>;

    totalClaimed(overrides?: CallOverrides): Promise<BigNumber>;

    uri(overrides?: CallOverrides): Promise<string>;

    withdrawFunds(account: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    campaignCancelled(overrides?: CallOverrides): Promise<BigNumber>;

    cancelCampaign(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimPeriodStart(overrides?: CallOverrides): Promise<BigNumber>;

    claimed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    funds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<BigNumber>;

    initCampaign(
      _shares: Campaign.SharesDataStruct,
      _uri: BytesLike,
      _guardian: string,
      _oracle: string,
      _sharesPublished: boolean,
      _claimPeriodStart: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    publishShares(
      _shares: Campaign.SharesDataStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    shares(overrides?: CallOverrides): Promise<BigNumber>;

    sharesPublished(overrides?: CallOverrides): Promise<BigNumber>;

    totalClaimed(overrides?: CallOverrides): Promise<BigNumber>;

    uri(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawFunds(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    campaignCancelled(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cancelCampaign(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      account: string,
      share: BigNumberish,
      proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimPeriodStart(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    funds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initCampaign(
      _shares: Campaign.SharesDataStruct,
      _uri: BytesLike,
      _guardian: string,
      _oracle: string,
      _sharesPublished: boolean,
      _claimPeriodStart: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    publishShares(
      _shares: Campaign.SharesDataStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    shares(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sharesPublished(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalClaimed(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    uri(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawFunds(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}