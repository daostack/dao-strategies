/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Campaign, CampaignInterface } from "../Campaign";

const _abi = [
  {
    inputs: [],
    name: "ActiveChallengePeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimingNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidProof",
    type: "error",
  },
  {
    inputs: [],
    name: "Locked",
    type: "error",
  },
  {
    inputs: [],
    name: "NoFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "NoRewardAvailable",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyGuardian",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyInChallengePeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOracle",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalNotAllowed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum Campaign.ChallengeAction",
        name: "action",
        type: "uint8",
      },
    ],
    name: "Challenge",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "share",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "assset",
        type: "address",
      },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "Fund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "sharesMerkleRoot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "sharesUri",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "activationTime",
        type: "uint256",
      },
    ],
    name: "SharesMerkleRoot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "CHALLENGE_PERIOD",
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
    name: "TOTAL_SHARES",
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
    name: "activationTime",
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
    name: "approvedMerkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Campaign.ChallengeAction",
        name: "action",
        type: "uint8",
      },
    ],
    name: "challenge",
    outputs: [],
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
      {
        internalType: "uint256",
        name: "share",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claimed",
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
        name: "asset",
        type: "address",
      },
    ],
    name: "convertToReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "fund",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getValidRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "guardian",
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
    ],
    name: "initCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "locked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
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
    inputs: [],
    name: "pendingMerkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
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
    ],
    name: "proposeShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "providers",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "share",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "rewardsAvailableToClaimer",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_lock",
        type: "bool",
      },
    ],
    name: "setLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strategyUri",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "totalClaimed",
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
        name: "asset",
        type: "address",
      },
    ],
    name: "totalFundsReceived",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
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
        name: "",
        type: "address",
      },
    ],
    name: "totalReward",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061164a806100206000396000f3fe60806040526004361061014e5760003560e01c80637dc0d1d0116100b6578063a9ec3a1b1161006f578063a9ec3a1b146103de578063c3a079ed146103f4578063cf3090121461040b578063d3f3235714610435578063da4493f614610455578063ef5d9ae81461046b57600080fd5b80637dc0d1d01461031f578063859285a21461033f57806385e3f9971461035f5780638881b9ef1461037b5780639637f4751461039b57806399908f74146103b157600080fd5b8063414f33dd11610108578063414f33dd14610269578063452a932014610289578063619d5194146102c1578063717f9092146102e157806375e07c2d146102f75780637b1837de1461030c57600080fd5b80620fa9fb146101665780630b04b8d7146101865780630c9cbf0e146101a657806316ccc133146101f157806317b9d05e1461021157806340bcf7481461023157600080fd5b366101615761015f34600033610498565b005b600080fd5b34801561017257600080fd5b5061015f61018136600461126b565b61056b565b34801561019257600080fd5b5061015f6101a13660046112c8565b610678565b3480156101b257600080fd5b506101de6101c136600461126b565b600a60209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b3480156101fd57600080fd5b506101de61020c366004611250565b6107a2565b34801561021d57600080fd5b5061015f61022c3660046113a3565b6107d6565b34801561023d57600080fd5b506101de61024c36600461126b565b600b60209081526000928352604080842090915290825290205481565b34801561027557600080fd5b5061015f6102843660046113c5565b6108b5565b34801561029557600080fd5b506005546102a9906001600160a01b031681565b6040516001600160a01b0390911681526020016101e8565b3480156102cd57600080fd5b5061015f6102dc366004611369565b610982565b3480156102ed57600080fd5b506101de60045481565b34801561030357600080fd5b506101de6109c0565b61015f61031a36600461129e565b6109d9565b34801561032b57600080fd5b506006546102a9906001600160a01b031681565b34801561034b57600080fd5b5061015f61035a366004611250565b6109fd565b34801561036b57600080fd5b506101de670de0b6b3a764000081565b34801561038757600080fd5b506101de6103963660046112c8565b610ab6565b3480156103a757600080fd5b506101de60025481565b3480156103bd57600080fd5b506101de6103cc366004611250565b60076020526000908152604090205481565b3480156103ea57600080fd5b506101de60015481565b34801561040057600080fd5b506101de62093a8081565b34801561041757600080fd5b506009546104259060ff1681565b60405190151581526020016101e8565b34801561044157600080fd5b5061015f61045036600461140b565b610bc5565b34801561046157600080fd5b506101de60035481565b34801561047757600080fd5b506101de610486366004611250565b60086020526000908152604090205481565b6001600160a01b038083166000908152600b60209081526040808320938516835292905290812080548592906104cf90849061150a565b90915550506001600160a01b038216600090815260076020526040812080548592906104fc90849061150a565b9091555061051790506001600160a01b038316823086610d6a565b604080516001600160a01b038084168252602082018690528416918101919091527fa5e8482b3a4fbac393476288e591dd9316d7304a537b26f9b67167f0ce19750f906060015b60405180910390a1505050565b60095460ff16801561057d5750600154155b1561065b576001600160a01b03808216600090815260076020908152604080832054600b835281842094871684529390915281205490916105bd91611522565b9050806105dd5760405163043f9e1160e41b815260040160405180910390fd5b6001600160a01b038083166000908152600b60209081526040808320938716835292905290812055610610838284610ddb565b604080516001600160a01b038086168252602082018490528416918101919091527f56c54ba9bd38d8fd62012e42c7ee564519b09763c426d331b3661b537ead19b29060600161055e565b60405163209a769d60e11b815260040160405180910390fd5b5050565b60006106878686868686610ab6565b9050806106a757604051636d363c4560e01b815260040160405180910390fd5b6001600160a01b038083166000908152600a60209081526040808320938a16835292905290812080548392906106de90849061150a565b90915550506001600160a01b0382166000908152600860205260408120805483929061070b90849061150a565b90915550506001600160a01b03821660009081526007602052604081208054839290610738908490611563565b909155506107499050868284610ddb565b604080516001600160a01b038881168252602082018890528183018490528416606082015290517fb6fe5ce185a3773d47e919f57c7edfd102c91cb7833b2be405c4de89d9980fd79181900360800190a1505050505050565b6001600160a01b03811660009081526008602090815260408083205460079092528220546107d0919061150a565b92915050565b6006546001600160a01b03163314610801576040516380fee10560e01b815260040160405180910390fd5b60095460ff1615610825576040516303cb96db60e21b815260040160405180910390fd5b60025415801590610837575060035442105b1561085557604051633420251360e11b815260040160405180910390fd5b6002805460015582905561086c62093a804261150a565b6003819055604080518481526020810184905280820192909252517ff538af40d5ad77456cbcd96a5be317d724e66e0e08eb217c14812308bd43d35e9181900360600190a15050565b60006108c16001610e9d565b905080156108d9576000805461ff0019166101001790555b6004849055600580546001600160a01b038086166001600160a01b0319928316179092556006805492851692909116919091179055841561092e57600285905561092662093a804261150a565b600355610935565b6000196003555b801561097b576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b6005546001600160a01b031633146109ad57604051636570ecab60e11b815260040160405180910390fd5b6009805460ff1916911515919091179055565b600060035442116109d2575060015490565b5060025490565b6001600160a01b0382166109f257610674348333610498565b610674818333610498565b60006001600160a01b03821615610a8a576040516370a0823160e01b81523060048201526001600160a01b038316906370a082319060240160206040518083038186803b158015610a4d57600080fd5b505afa158015610a61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a85919061142c565b610a8c565b475b9050600081610a9a846107a2565b610aa49190611563565b9050610ab1818430610498565b505050565b600080610ac16109c0565b6040516bffffffffffffffffffffffff1960608a901b16602082015260348101889052909150600090605401604051602081830303815290604052805190602001209050610b45868680806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250869250859150610f2a9050565b610b62576040516309bde33960e01b815260040160405180910390fd5b6001600160a01b038085166000908152600a60209081526040808320938c1683529290522054670de0b6b3a764000088610b9b876107a2565b610ba59190611544565b610baf9190611522565b610bb99190611563565b98975050505050505050565b6005546001600160a01b03163314610bf057604051636570ecab60e11b815260040160405180910390fd5b60095460ff1615610c14576040516303cb96db60e21b815260040160405180910390fd5b60025415801590610c26575060035442115b15610c4457604051631b69dd1760e21b815260040160405180910390fd5b60006002556000196003556001816002811115610c6357610c636115d7565b1415610cbf57604051631867546560e21b815260016004820152309063619d519490602401600060405180830381600087803b158015610ca257600080fd5b505af1158015610cb6573d6000803e3d6000fd5b50505050610d30565b6002816002811115610cd357610cd36115d7565b1415610d3057604051631867546560e21b815260016004820152309063619d519490602401600060405180830381600087803b158015610d1257600080fd5b505af1158015610d26573d6000803e3d6000fd5b5050600060015550505b7f0b700a39eebc9d322d0a5829d3d6447d9e000f73a89a7baa6a0fa28a5ec9c8d081604051610d5f9190611461565b60405180910390a150565b6040516001600160a01b0380851660248301528316604482015260648101829052610dd59085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610f42565b50505050565b6001600160a01b038116610e89576000836001600160a01b03168360405160006040518083038185875af1925050503d8060008114610e36576040519150601f19603f3d011682016040523d82523d6000602084013e610e3b565b606091505b5050905080610dd55760405162461bcd60e51b8152602060048201526015602482015274195d1a195c881d1c985b9cd9995c8819985a5b1959605a1b60448201526064015b60405180910390fd5b610ab16001600160a01b0382168484611014565b60008054610100900460ff1615610ee4578160ff166001148015610ec05750303b155b610edc5760405162461bcd60e51b8152600401610e80906114bc565b506000919050565b60005460ff808416911610610f0b5760405162461bcd60e51b8152600401610e80906114bc565b506000805460ff191660ff92909216919091179055600190565b919050565b600082610f378584611044565b1490505b9392505050565b6000610f97826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166110b89092919063ffffffff16565b805190915015610ab15780806020019051810190610fb59190611386565b610ab15760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610e80565b6040516001600160a01b038316602482015260448101829052610ab190849063a9059cbb60e01b90606401610d9e565b600081815b84518110156110b0576000858281518110611066576110666115ed565b6020026020010151905080831161108c576000838152602082905260409020925061109d565b600081815260208490526040902092505b50806110a8816115a6565b915050611049565b509392505050565b60606110c784846000856110cf565b949350505050565b6060824710156111305760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610e80565b6001600160a01b0385163b6111875760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610e80565b600080866001600160a01b031685876040516111a39190611445565b60006040518083038185875af1925050503d80600081146111e0576040519150601f19603f3d011682016040523d82523d6000602084013e6111e5565b606091505b50915091506111f5828286611200565b979650505050505050565b6060831561120f575081610f3b565b82511561121f5782518084602001fd5b8160405162461bcd60e51b8152600401610e809190611489565b80356001600160a01b0381168114610f2557600080fd5b60006020828403121561126257600080fd5b610f3b82611239565b6000806040838503121561127e57600080fd5b61128783611239565b915061129560208401611239565b90509250929050565b600080604083850312156112b157600080fd5b6112ba83611239565b946020939093013593505050565b6000806000806000608086880312156112e057600080fd5b6112e986611239565b945060208601359350604086013567ffffffffffffffff8082111561130d57600080fd5b818801915088601f83011261132157600080fd5b81358181111561133057600080fd5b8960208260051b850101111561134557600080fd5b60208301955080945050505061135d60608701611239565b90509295509295909350565b60006020828403121561137b57600080fd5b8135610f3b81611603565b60006020828403121561139857600080fd5b8151610f3b81611603565b600080604083850312156113b657600080fd5b50508035926020909101359150565b600080600080608085870312156113db57600080fd5b84359350602085013592506113f260408601611239565b915061140060608601611239565b905092959194509250565b60006020828403121561141d57600080fd5b813560038110610f3b57600080fd5b60006020828403121561143e57600080fd5b5051919050565b6000825161145781846020870161157a565b9190910192915050565b602081016003831061148357634e487b7160e01b600052602160045260246000fd5b91905290565b60208152600082518060208401526114a881604085016020870161157a565b601f01601f19169190910160400192915050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6000821982111561151d5761151d6115c1565b500190565b60008261153f57634e487b7160e01b600052601260045260246000fd5b500490565b600081600019048311821515161561155e5761155e6115c1565b500290565b600082821015611575576115756115c1565b500390565b60005b8381101561159557818101518382015260200161157d565b83811115610dd55750506000910152565b60006000198214156115ba576115ba6115c1565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b801515811461161157600080fd5b5056fea264697066735822122088fed8c2bade2b891148eeb1b100b3ab45f507af73b39c9d9150d7037477271764736f6c63430008060033";

type CampaignConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CampaignConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Campaign__factory extends ContractFactory {
  constructor(...args: CampaignConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Campaign";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Campaign> {
    return super.deploy(overrides || {}) as Promise<Campaign>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Campaign {
    return super.attach(address) as Campaign;
  }
  connect(signer: Signer): Campaign__factory {
    return super.connect(signer) as Campaign__factory;
  }
  static readonly contractName: "Campaign";
  public readonly contractName: "Campaign";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CampaignInterface {
    return new utils.Interface(_abi) as CampaignInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Campaign {
    return new Contract(address, _abi, signerOrProvider) as Campaign;
  }
}
