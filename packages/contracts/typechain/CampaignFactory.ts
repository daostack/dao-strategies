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

export interface CampaignFactoryInterface extends utils.Interface {
  contractName: "CampaignFactory";
  functions: {
    "campaignAddress(bytes32)": FunctionFragment;
    "createCampaign(bytes32,bytes32,bytes32,address,address,uint256,bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "campaignAddress",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createCampaign",
    values: [
      BytesLike,
      BytesLike,
      BytesLike,
      string,
      string,
      BigNumberish,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "campaignAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createCampaign",
    data: BytesLike
  ): Result;

  events: {
    "CampaignCreated(address,address,bytes32,bytes32,bytes32,address,address,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CampaignCreated"): EventFragment;
}

export type CampaignCreatedEvent = TypedEvent<
  [string, string, string, string, string, string, string, string],
  {
    creator: string;
    newCampaign: string;
    _sharesMerkleRoot: string;
    _sharesUri: string;
    _strategyUri: string;
    _guardian: string;
    _oracle: string;
    salt: string;
  }
>;

export type CampaignCreatedEventFilter = TypedEventFilter<CampaignCreatedEvent>;

export interface CampaignFactory extends BaseContract {
  contractName: "CampaignFactory";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CampaignFactoryInterface;

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
    campaignAddress(
      salt: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    createCampaign(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _challengePeriod: BigNumberish,
      salt: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  campaignAddress(salt: BytesLike, overrides?: CallOverrides): Promise<string>;

  createCampaign(
    _sharesMerkleRoot: BytesLike,
    _sharesUri: BytesLike,
    _strategyUri: BytesLike,
    _guardian: string,
    _oracle: string,
    _challengePeriod: BigNumberish,
    salt: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    campaignAddress(
      salt: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    createCampaign(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _challengePeriod: BigNumberish,
      salt: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CampaignCreated(address,address,bytes32,bytes32,bytes32,address,address,bytes32)"(
      creator?: null,
      newCampaign?: null,
      _sharesMerkleRoot?: null,
      _sharesUri?: null,
      _strategyUri?: null,
      _guardian?: null,
      _oracle?: null,
      salt?: null
    ): CampaignCreatedEventFilter;
    CampaignCreated(
      creator?: null,
      newCampaign?: null,
      _sharesMerkleRoot?: null,
      _sharesUri?: null,
      _strategyUri?: null,
      _guardian?: null,
      _oracle?: null,
      salt?: null
    ): CampaignCreatedEventFilter;
  };

  estimateGas: {
    campaignAddress(
      salt: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createCampaign(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _challengePeriod: BigNumberish,
      salt: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    campaignAddress(
      salt: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createCampaign(
      _sharesMerkleRoot: BytesLike,
      _sharesUri: BytesLike,
      _strategyUri: BytesLike,
      _guardian: string,
      _oracle: string,
      _challengePeriod: BigNumberish,
      salt: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
