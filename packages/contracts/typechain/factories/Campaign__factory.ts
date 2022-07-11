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
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "balanceOfAsset",
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
  "0x608060405234801561001057600080fd5b5061169e806100206000396000f3fe6080604052600436106101695760003560e01c80637dc0d1d0116100d1578063a9ec3a1b1161008a578063cf30901211610064578063cf30901214610446578063d3f3235714610470578063da4493f614610490578063ef5d9ae8146104a657600080fd5b8063a9ec3a1b146103f9578063c1d899411461040f578063c3a079ed1461042f57600080fd5b80637dc0d1d01461033a578063859285a21461035a57806385e3f9971461037a5780638881b9ef146103965780639637f475146103b657806399908f74146103cc57600080fd5b8063414f33dd11610123578063414f33dd14610284578063452a9320146102a4578063619d5194146102dc578063717f9092146102fc57806375e07c2d146103125780637b1837de1461032757600080fd5b80620fa9fb146101815780630b04b8d7146101a15780630c9cbf0e146101c157806316ccc1331461020c57806317b9d05e1461022c57806340bcf7481461024c57600080fd5b3661017c5761017a346000336104d3565b005b600080fd5b34801561018d57600080fd5b5061017a61019c3660046112bf565b6105b4565b3480156101ad57600080fd5b5061017a6101bc36600461131c565b6106c1565b3480156101cd57600080fd5b506101f96101dc3660046112bf565b600a60209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b34801561021857600080fd5b506101f96102273660046112a4565b6107eb565b34801561023857600080fd5b5061017a6102473660046113f7565b61081f565b34801561025857600080fd5b506101f96102673660046112bf565b600b60209081526000928352604080842090915290825290205481565b34801561029057600080fd5b5061017a61029f366004611419565b6108fe565b3480156102b057600080fd5b506005546102c4906001600160a01b031681565b6040516001600160a01b039091168152602001610203565b3480156102e857600080fd5b5061017a6102f73660046113bd565b6109cb565b34801561030857600080fd5b506101f960045481565b34801561031e57600080fd5b506101f9610a09565b61017a6103353660046112f2565b610a22565b34801561034657600080fd5b506006546102c4906001600160a01b031681565b34801561036657600080fd5b5061017a6103753660046112a4565b610a46565b34801561038657600080fd5b506101f9670de0b6b3a764000081565b3480156103a257600080fd5b506101f96103b136600461131c565b610a71565b3480156103c257600080fd5b506101f960025481565b3480156103d857600080fd5b506101f96103e73660046112a4565b60076020526000908152604090205481565b34801561040557600080fd5b506101f960015481565b34801561041b57600080fd5b506101f961042a3660046112a4565b610b80565b34801561043b57600080fd5b506101f962093a8081565b34801561045257600080fd5b506009546104609060ff1681565b6040519015158152602001610203565b34801561047c57600080fd5b5061017a61048b36600461145f565b610c14565b34801561049c57600080fd5b506101f960035481565b3480156104b257600080fd5b506101f96104c13660046112a4565b60086020526000908152604090205481565b6001600160a01b038083166000908152600b602090815260408083209385168352929052908120805485929061050a90849061155e565b90915550506001600160a01b0382166000908152600760205260408120805485929061053790849061155e565b90915550506001600160a01b03821615610560576105606001600160a01b038316823086610db9565b604080516001600160a01b038084168252602082018690528416918101919091527fa5e8482b3a4fbac393476288e591dd9316d7304a537b26f9b67167f0ce19750f906060015b60405180910390a1505050565b60095460ff1680156105c65750600154155b156106a4576001600160a01b03808216600090815260076020908152604080832054600b8352818420948716845293909152812054909161060691611576565b9050806106265760405163043f9e1160e41b815260040160405180910390fd5b6001600160a01b038083166000908152600b60209081526040808320938716835292905290812055610659838284610e2a565b604080516001600160a01b038086168252602082018490528416918101919091527f56c54ba9bd38d8fd62012e42c7ee564519b09763c426d331b3661b537ead19b2906060016105a7565b60405163209a769d60e11b815260040160405180910390fd5b5050565b60006106d08686868686610a71565b9050806106f057604051636d363c4560e01b815260040160405180910390fd5b6001600160a01b038083166000908152600a60209081526040808320938a168352929052908120805483929061072790849061155e565b90915550506001600160a01b0382166000908152600860205260408120805483929061075490849061155e565b90915550506001600160a01b038216600090815260076020526040812080548392906107819084906115b7565b909155506107929050868284610e2a565b604080516001600160a01b038881168252602082018890528183018490528416606082015290517fb6fe5ce185a3773d47e919f57c7edfd102c91cb7833b2be405c4de89d9980fd79181900360800190a1505050505050565b6001600160a01b0381166000908152600860209081526040808320546007909252822054610819919061155e565b92915050565b6006546001600160a01b0316331461084a576040516380fee10560e01b815260040160405180910390fd5b60095460ff161561086e576040516303cb96db60e21b815260040160405180910390fd5b60025415801590610880575060035442105b1561089e57604051633420251360e11b815260040160405180910390fd5b600280546001558290556108b562093a804261155e565b6003819055604080518481526020810184905280820192909252517ff538af40d5ad77456cbcd96a5be317d724e66e0e08eb217c14812308bd43d35e9181900360600190a15050565b600061090a6001610ef1565b90508015610922576000805461ff0019166101001790555b6004849055600580546001600160a01b038086166001600160a01b0319928316179092556006805492851692909116919091179055841561097757600285905561096f62093a804261155e565b60035561097e565b6000196003555b80156109c4576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b6005546001600160a01b031633146109f657604051636570ecab60e11b815260040160405180910390fd5b6009805460ff1916911515919091179055565b60006003544211610a1b575060015490565b5060025490565b6001600160a01b038216610a3b576106bd3483336104d3565b6106bd8183336104d3565b6000610a5182610b80565b610a5a836107eb565b610a6491906115b7565b90506106bd8183306104d3565b600080610a7c610a09565b6040516bffffffffffffffffffffffff1960608a901b16602082015260348101889052909150600090605401604051602081830303815290604052805190602001209050610b00868680806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250869250859150610f7e9050565b610b1d576040516309bde33960e01b815260040160405180910390fd5b6001600160a01b038085166000908152600a60209081526040808320938c1683529290522054670de0b6b3a764000088610b56876107eb565b610b609190611598565b610b6a9190611576565b610b7491906115b7565b98975050505050505050565b60006001600160a01b03821615610c0d576040516370a0823160e01b81523060048201526001600160a01b038316906370a082319060240160206040518083038186803b158015610bd057600080fd5b505afa158015610be4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c089190611480565b610819565b4792915050565b6005546001600160a01b03163314610c3f57604051636570ecab60e11b815260040160405180910390fd5b60095460ff1615610c63576040516303cb96db60e21b815260040160405180910390fd5b60025415801590610c75575060035442115b15610c9357604051631b69dd1760e21b815260040160405180910390fd5b60006002556000196003556001816002811115610cb257610cb261162b565b1415610d0e57604051631867546560e21b815260016004820152309063619d519490602401600060405180830381600087803b158015610cf157600080fd5b505af1158015610d05573d6000803e3d6000fd5b50505050610d7f565b6002816002811115610d2257610d2261162b565b1415610d7f57604051631867546560e21b815260016004820152309063619d519490602401600060405180830381600087803b158015610d6157600080fd5b505af1158015610d75573d6000803e3d6000fd5b5050600060015550505b7f0b700a39eebc9d322d0a5829d3d6447d9e000f73a89a7baa6a0fa28a5ec9c8d081604051610dae91906114b5565b60405180910390a150565b6040516001600160a01b0380851660248301528316604482015260648101829052610e249085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610f96565b50505050565b6001600160a01b038116610ed8576000836001600160a01b03168360405160006040518083038185875af1925050503d8060008114610e85576040519150601f19603f3d011682016040523d82523d6000602084013e610e8a565b606091505b5050905080610e245760405162461bcd60e51b8152602060048201526015602482015274195d1a195c881d1c985b9cd9995c8819985a5b1959605a1b60448201526064015b60405180910390fd5b610eec6001600160a01b0382168484611068565b505050565b60008054610100900460ff1615610f38578160ff166001148015610f145750303b155b610f305760405162461bcd60e51b8152600401610ecf90611510565b506000919050565b60005460ff808416911610610f5f5760405162461bcd60e51b8152600401610ecf90611510565b506000805460ff191660ff92909216919091179055600190565b919050565b600082610f8b8584611098565b1490505b9392505050565b6000610feb826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661110c9092919063ffffffff16565b805190915015610eec578080602001905181019061100991906113da565b610eec5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610ecf565b6040516001600160a01b038316602482015260448101829052610eec90849063a9059cbb60e01b90606401610ded565b600081815b84518110156111045760008582815181106110ba576110ba611641565b602002602001015190508083116110e057600083815260208290526040902092506110f1565b600081815260208490526040902092505b50806110fc816115fa565b91505061109d565b509392505050565b606061111b8484600085611123565b949350505050565b6060824710156111845760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610ecf565b6001600160a01b0385163b6111db5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610ecf565b600080866001600160a01b031685876040516111f79190611499565b60006040518083038185875af1925050503d8060008114611234576040519150601f19603f3d011682016040523d82523d6000602084013e611239565b606091505b5091509150611249828286611254565b979650505050505050565b60608315611263575081610f8f565b8251156112735782518084602001fd5b8160405162461bcd60e51b8152600401610ecf91906114dd565b80356001600160a01b0381168114610f7957600080fd5b6000602082840312156112b657600080fd5b610f8f8261128d565b600080604083850312156112d257600080fd5b6112db8361128d565b91506112e96020840161128d565b90509250929050565b6000806040838503121561130557600080fd5b61130e8361128d565b946020939093013593505050565b60008060008060006080868803121561133457600080fd5b61133d8661128d565b945060208601359350604086013567ffffffffffffffff8082111561136157600080fd5b818801915088601f83011261137557600080fd5b81358181111561138457600080fd5b8960208260051b850101111561139957600080fd5b6020830195508094505050506113b16060870161128d565b90509295509295909350565b6000602082840312156113cf57600080fd5b8135610f8f81611657565b6000602082840312156113ec57600080fd5b8151610f8f81611657565b6000806040838503121561140a57600080fd5b50508035926020909101359150565b6000806000806080858703121561142f57600080fd5b84359350602085013592506114466040860161128d565b91506114546060860161128d565b905092959194509250565b60006020828403121561147157600080fd5b813560038110610f8f57600080fd5b60006020828403121561149257600080fd5b5051919050565b600082516114ab8184602087016115ce565b9190910192915050565b60208101600383106114d757634e487b7160e01b600052602160045260246000fd5b91905290565b60208152600082518060208401526114fc8160408501602087016115ce565b601f01601f19169190910160400192915050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6000821982111561157157611571611615565b500190565b60008261159357634e487b7160e01b600052601260045260246000fd5b500490565b60008160001904831182151516156115b2576115b2611615565b500290565b6000828210156115c9576115c9611615565b500390565b60005b838110156115e95781810151838201526020016115d1565b83811115610e245750506000910152565b600060001982141561160e5761160e611615565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b801515811461166557600080fd5b5056fea2646970667358221220708c4a0e9858ce3a70d99c1507f0909c8d8ce2fac400601ae27a2f0c3c2140a464736f6c63430008060033";

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
