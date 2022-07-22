/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TestErc20, TestErc20Interface } from "../TestErc20";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
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
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000b8038038062000b80833981016040819052620000349162000246565b6040518060400160405280600481526020016315195cdd60e21b815250604051806040016040528060038152602001621d1cdd60ea1b815250816003908051906020019062000085929190620001a0565b5080516200009b906004906020840190620001a0565b505050620000b08183620000b860201b60201c565b5050620002e9565b6001600160a01b038216620001135760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b806002600082825462000127919062000285565b90915550506001600160a01b038216600090815260208190526040812080548392906200015690849062000285565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b828054620001ae90620002ac565b90600052602060002090601f016020900481019282620001d257600085556200021d565b82601f10620001ed57805160ff19168380011785556200021d565b828001600101855582156200021d579182015b828111156200021d57825182559160200191906001019062000200565b506200022b9291506200022f565b5090565b5b808211156200022b576000815560010162000230565b600080604083850312156200025a57600080fd5b825160208401519092506001600160a01b03811681146200027a57600080fd5b809150509250929050565b60008219821115620002a757634e487b7160e01b600052601160045260246000fd5b500190565b600181811c90821680620002c157607f821691505b60208210811415620002e357634e487b7160e01b600052602260045260246000fd5b50919050565b61088780620002f96000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461012357806370a082311461013657806395d89b411461015f578063a457c2d714610167578063a9059cbb1461017a578063dd62ed3e1461018d57600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ef57806323b872dd14610101578063313ce56714610114575b600080fd5b6100b66101a0565b6040516100c3919061079b565b60405180910390f35b6100df6100da366004610771565b610232565b60405190151581526020016100c3565b6002545b6040519081526020016100c3565b6100df61010f366004610735565b61024a565b604051601281526020016100c3565b6100df610131366004610771565b61026e565b6100f36101443660046106e0565b6001600160a01b031660009081526020819052604090205490565b6100b6610290565b6100df610175366004610771565b61029f565b6100df610188366004610771565b61031f565b6100f361019b366004610702565b61032d565b6060600380546101af90610816565b80601f01602080910402602001604051908101604052809291908181526020018280546101db90610816565b80156102285780601f106101fd57610100808354040283529160200191610228565b820191906000526020600020905b81548152906001019060200180831161020b57829003601f168201915b5050505050905090565b600033610240818585610358565b5060019392505050565b60003361025885828561047c565b6102638585856104f6565b506001949350505050565b600033610240818585610281838361032d565b61028b91906107f0565b610358565b6060600480546101af90610816565b600033816102ad828661032d565b9050838110156103125760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6102638286868403610358565b6000336102408185856104f6565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166103ba5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610309565b6001600160a01b03821661041b5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610309565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610488848461032d565b905060001981146104f057818110156104e35760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610309565b6104f08484848403610358565b50505050565b6001600160a01b03831661055a5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610309565b6001600160a01b0382166105bc5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610309565b6001600160a01b038316600090815260208190526040902054818110156106345760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610309565b6001600160a01b0380851660009081526020819052604080822085850390559185168152908120805484929061066b9084906107f0565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106b791815260200190565b60405180910390a36104f0565b80356001600160a01b03811681146106db57600080fd5b919050565b6000602082840312156106f257600080fd5b6106fb826106c4565b9392505050565b6000806040838503121561071557600080fd5b61071e836106c4565b915061072c602084016106c4565b90509250929050565b60008060006060848603121561074a57600080fd5b610753846106c4565b9250610761602085016106c4565b9150604084013590509250925092565b6000806040838503121561078457600080fd5b61078d836106c4565b946020939093013593505050565b600060208083528351808285015260005b818110156107c8578581018301518582016040015282016107ac565b818111156107da576000604083870101525b50601f01601f1916929092016040019392505050565b6000821982111561081157634e487b7160e01b600052601160045260246000fd5b500190565b600181811c9082168061082a57607f821691505b6020821081141561084b57634e487b7160e01b600052602260045260246000fd5b5091905056fea2646970667358221220d087d8ed09d2d48c6fe27397daffb5ce26bd8230db4c0319519068bdf03ac2d664736f6c63430008060033";

type TestErc20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestErc20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestErc20__factory extends ContractFactory {
  constructor(...args: TestErc20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "TestErc20";
  }

  deploy(
    supply: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestErc20> {
    return super.deploy(supply, owner, overrides || {}) as Promise<TestErc20>;
  }
  getDeployTransaction(
    supply: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(supply, owner, overrides || {});
  }
  attach(address: string): TestErc20 {
    return super.attach(address) as TestErc20;
  }
  connect(signer: Signer): TestErc20__factory {
    return super.connect(signer) as TestErc20__factory;
  }
  static readonly contractName: "TestErc20";
  public readonly contractName: "TestErc20";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestErc20Interface {
    return new utils.Interface(_abi) as TestErc20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestErc20 {
    return new Contract(address, _abi, signerOrProvider) as TestErc20;
  }
}
