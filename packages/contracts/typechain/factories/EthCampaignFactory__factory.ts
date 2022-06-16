/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  EthCampaignFactory,
  EthCampaignFactoryInterface,
} from "../EthCampaignFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_master",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newCampaign",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_sharesMerkleRoot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_sharesUri",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_strategyUri",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_guardian",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "CampaignCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "campaignAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_sharesMerkleRoot",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_sharesUri",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_strategyUri",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_guardian",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "createCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161040738038061040783398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b610374806100936000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80634bef4a641461003b5780636e1a1fac14610050575b600080fd5b61004e6100493660046102e6565b61007f565b005b61006361005e3660046102cd565b610183565b6040516001600160a01b03909116815260200160405180910390f35b60008054610096906001600160a01b0316836101a0565b604051634009634160e01b815260048101899052602481018790526001600160a01b038681166044830152858116606483015291925090821690634009634190608401600060405180830381600087803b1580156100f357600080fd5b505af1158015610107573d6000803e3d6000fd5b5050604080513381526001600160a01b0385811660208301528183018c9052606082018b9052608082018a905288811660a0830152871660c082015260e0810186905290517fecef63711db66bd7cfde4599c350ea43f466d9711ffda7a4c653f3f136ee357c935090819003610100019150a150505050505050565b6000805461019a906001600160a01b031683610244565b92915050565b6000604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528360601b60148201526e5af43d82803e903d91602b57fd5bf360881b6028820152826037826000f59150506001600160a01b03811661019a5760405162461bcd60e51b815260206004820152601760248201527f455243313136373a2063726561746532206661696c6564000000000000000000604482015260640160405180910390fd5b60006102aa838330604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b8152606093841b60148201526f5af43d82803e903d91602b57fd5bf3ff60801b6028820152921b6038830152604c8201526037808220606c830152605591012090565b9392505050565b80356001600160a01b03811681146102c857600080fd5b919050565b6000602082840312156102df57600080fd5b5035919050565b60008060008060008060c087890312156102ff57600080fd5b86359550602087013594506040870135935061031d606088016102b1565b925061032b608088016102b1565b915060a08701359050929550929550929556fea2646970667358221220d42a338d7270ba458320e6d971f7f241d423fef2652bdb03c6df06625d67e74364736f6c63430008060033";

type EthCampaignFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EthCampaignFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EthCampaignFactory__factory extends ContractFactory {
  constructor(...args: EthCampaignFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "EthCampaignFactory";
  }

  deploy(
    _master: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EthCampaignFactory> {
    return super.deploy(
      _master,
      overrides || {}
    ) as Promise<EthCampaignFactory>;
  }
  getDeployTransaction(
    _master: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_master, overrides || {});
  }
  attach(address: string): EthCampaignFactory {
    return super.attach(address) as EthCampaignFactory;
  }
  connect(signer: Signer): EthCampaignFactory__factory {
    return super.connect(signer) as EthCampaignFactory__factory;
  }
  static readonly contractName: "EthCampaignFactory";
  public readonly contractName: "EthCampaignFactory";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EthCampaignFactoryInterface {
    return new utils.Interface(_abi) as EthCampaignFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EthCampaignFactory {
    return new Contract(address, _abi, signerOrProvider) as EthCampaignFactory;
  }
}
