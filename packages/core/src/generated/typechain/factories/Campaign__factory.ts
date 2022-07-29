/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Campaign, CampaignInterface } from "../Campaign";

const _abi = [
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
    name: "MerkleRootUpdateNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "NoAssetsToWithdraw",
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
        indexed: true,
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
        indexed: true,
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
        internalType: "bool",
        name: "locked",
        type: "bool",
      },
    ],
    name: "Lock",
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
    name: "SharesMerkleRootUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
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
    name: "ACTIVATION_PERIOD",
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
    name: "ACTIVE_DURATION",
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
        internalType: "address[]",
        name: "assets",
        type: "address[]",
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
    inputs: [],
    name: "deployTime",
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
        internalType: "uint256",
        name: "_activationTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_CHALLENGE_PERIOD",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ACTIVATION_PERIOD",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ACTIVE_DURATION",
        type: "uint256",
      },
    ],
    name: "initCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isChallengePeriod",
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
    name: "isPendingActive",
    outputs: [
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isProposeWindowActive",
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
    name: "merkleRootUpdateAllowed",
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
    name: "totalReceived",
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
    ],
    name: "verifyShares",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAllowed",
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
    name: "withdrawAssets",
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
  "0x608060405234801561001057600080fd5b5060018055611893806100246000396000f3fe6080604052600436106101e65760003560e01c80637a40624b11610102578063be8b768611610095578063cf30901211610064578063cf30901214610552578063d3f323571461056c578063da4493f61461058c578063ef5d9ae8146105a257600080fd5b8063be8b7686146104dc578063c1d89941146104fc578063c24e47781461051c578063c3a079ed1461053c57600080fd5b806385e3f997116100d157806385e3f997146104745780639637f47514610490578063a98acb46146104a6578063a9ec3a1b146104c657600080fd5b80637a40624b146104145780637b1837de1461042a5780637c99ca6d1461043d5780637dc0d1d01461045457600080fd5b8063452a93201161017a578063619d519411610149578063619d5194146103b45780636c4fbc4a146103d4578063717f9092146103e957806375e07c2d146103ff57600080fd5b8063452a9320146103325780634df9cfb31461036a578063510cbd9c1461038a578063574eab011461039f57600080fd5b806317b9d05e116101b657806317b9d05e1461029f5780633e161940146102bf57806340bcf748146102d5578063449497281461030d57600080fd5b80627c4d51146101fe57806303380eb3146102275780630c9cbf0e14610247578063162dfe001461027f57600080fd5b366101f9576101f7346000336105cf565b005b600080fd5b34801561020a57600080fd5b5061021460045481565b6040519081526020015b60405180910390f35b34801561023357600080fd5b506101f761024236600461151f565b61067a565b34801561025357600080fd5b5061021461026236600461142c565b600d60209081526000928352604080842090915290825290205481565b34801561028b57600080fd5b506101f761029a3660046114c5565b6106e3565b3480156102ab57600080fd5b506101f76102ba366004611644565b610796565b3480156102cb57600080fd5b5061021460035481565b3480156102e157600080fd5b506102146102f036600461142c565b600f60209081526000928352604080842090915290825290205481565b34801561031957600080fd5b5061032261086a565b604051901515815260200161021e565b34801561033e57600080fd5b50600a54610352906001600160a01b031681565b6040516001600160a01b03909116815260200161021e565b34801561037657600080fd5b50610214610385366004611411565b610890565b34801561039657600080fd5b506103226108c2565b3480156103ab57600080fd5b506103226108ef565b3480156103c057600080fd5b506101f76103cf3660046115a9565b610921565b3480156103e057600080fd5b50610322610994565b3480156103f557600080fd5b5061021460095481565b34801561040b57600080fd5b506102146109a6565b34801561042057600080fd5b5061021460085481565b6101f761043836600461145f565b6109c5565b34801561044957600080fd5b506007544211610322565b34801561046057600080fd5b50600b54610352906001600160a01b031681565b34801561048057600080fd5b50610214670de0b6b3a764000081565b34801561049c57600080fd5b5061021460065481565b3480156104b257600080fd5b506101f76104c13660046115e3565b610a53565b3480156104d257600080fd5b5061021460055481565b3480156104e857600080fd5b506102146104f7366004611489565b610bbb565b34801561050857600080fd5b50610214610517366004611411565b610c1e565b34801561052857600080fd5b506101f761053736600461142c565b610cb2565b34801561054857600080fd5b5061021460025481565b34801561055e57600080fd5b50600e546103229060ff1681565b34801561057857600080fd5b506101f7610587366004611666565b610d91565b34801561059857600080fd5b5061021460075481565b3480156105ae57600080fd5b506102146105bd366004611411565b600c6020526000908152604090205481565b6001600160a01b038083166000908152600f6020908152604080832093851683529290529081208054859290610606908490611717565b90915550506001600160a01b0382161561062f5761062f6001600160a01b038316823086610e92565b604080518481526001600160a01b0384811660208301528316917fa5e8482b3a4fbac393476288e591dd9316d7304a537b26f9b67167f0ce19750f91015b60405180910390a2505050565b610686868686866106e3565b60005b60ff81168211156106da576106c8878785858560ff168181106106ae576106ae611836565b90506020020160208101906106c39190611411565b610f03565b806106d2816117c0565b915050610689565b50505050505050565b60006106ed6109a6565b6040516bffffffffffffffffffffffff19606088901b16602082015260348101869052909150600090605401604051602081830303815290604052805190602001209050610771848480806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250869250859150610fdd9050565b61078e576040516309bde33960e01b815260040160405180910390fd5b505050505050565b600b546001600160a01b031633146107c1576040516380fee10560e01b815260040160405180910390fd5b600e5460ff16156107e5576040516303cb96db60e21b815260040160405180910390fd5b6107ed6108c2565b61080a57604051631aeebaf760e11b815260040160405180910390fd5b600680546005558290556002546108219042611717565b6007819055604080518481526020810184905280820192909252517f93d244ac7b8f4282b061b1dcb3f543f36f06af40a7bfdefe04fc913ef7ea54f99181900360600190a15050565b6000600454600354600854426108809190611762565b61088a91906117e0565b10905090565b6001600160a01b0381166000908152600c60205260408120546108b283610c1e565b6108bc9190611717565b92915050565b60006108cc610994565b156108d75750600090565b6108df61086a565b6108e95750600090565b50600190565b600e5460009060ff1680156109045750600554155b80156109105750600654155b1561091b5750600190565b50600090565b600a546001600160a01b0316331461094c57604051636570ecab60e11b815260040160405180910390fd5b600e805460ff19168215159081179091556040519081527f73cb6ff886d89c3816d03270daa43e4789d7c218d9a12960651ff278e1fef1f1906020015b60405180910390a150565b600060075442101561091b5750600190565b60006109b3600754421190565b6109be575060055490565b5060065490565b60026001541415610a1d5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b60026001556001600160a01b038216610a4057610a3b3483336105cf565b610a4b565b610a4b8183336105cf565b505060018055565b600054610100900460ff1615808015610a735750600054600160ff909116105b80610a8d5750303b158015610a8d575060005460ff166001145b610af05760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610a14565b6000805460ff191660011790558015610b13576000805461ff0019166101001790555b6009889055600a80546001600160a01b03808a166001600160a01b031992831617909255600b80549289169290911691909117905584610b535742610b55565b845b600755426008556002849055600383905560048290558015610bb1576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050505050565b6001600160a01b038082166000908152600d60209081526040808320938716835292905290812054670de0b6b3a764000084610bf685610890565b610c009190611743565b610c0a919061172f565b610c149190611762565b90505b9392505050565b60006001600160a01b03821615610cab576040516370a0823160e01b81523060048201526001600160a01b038316906370a082319060240160206040518083038186803b158015610c6e57600080fd5b505afa158015610c82573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca69190611687565b6108bc565b4792915050565b610cba6108ef565b15610d78576001600160a01b038082166000908152600f602090815260408083209386168352929052205480610d0357604051635da3252f60e11b815260040160405180910390fd5b6001600160a01b038083166000908152600f60209081526040808320938716835292905290812055610d36838284610ff3565b604080518281526001600160a01b0384811660208301528516917f56c54ba9bd38d8fd62012e42c7ee564519b09763c426d331b3661b537ead19b2910161066d565b60405163209a769d60e11b815260040160405180910390fd5b600a546001600160a01b03163314610dbc57604051636570ecab60e11b815260040160405180910390fd5b600e5460ff1615610de0576040516303cb96db60e21b815260040160405180910390fd5b610de8610994565b610e0557604051631b69dd1760e21b815260040160405180910390fd5b60006006556001816002811115610e1e57610e1e611820565b1415610e3657600e805460ff19166001179055610e63565b6002816002811115610e4a57610e4a611820565b1415610e6357600e805460ff1916600117905560006005555b7f0b700a39eebc9d322d0a5829d3d6447d9e000f73a89a7baa6a0fa28a5ec9c8d08160405161098991906116bc565b6040516001600160a01b0380851660248301528316604482015260648101829052610efd9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526110b5565b50505050565b6000610f10848484610bbb565b6001600160a01b038084166000908152600d60209081526040808320938916835292905290812080549293508392909190610f4c908490611717565b90915550506001600160a01b0382166000908152600c602052604081208054839290610f79908490611717565b90915550610f8a9050848284610ff3565b60408051848152602081018390526001600160a01b03848116828401529151918616917fb6fe5ce185a3773d47e919f57c7edfd102c91cb7833b2be405c4de89d9980fd79181900360600190a250505050565b600082610fea8584611187565b14949350505050565b6001600160a01b03811661109c576000836001600160a01b03168360405160006040518083038185875af1925050503d806000811461104e576040519150601f19603f3d011682016040523d82523d6000602084013e611053565b606091505b5050905080610efd5760405162461bcd60e51b8152602060048201526015602482015274195d1a195c881d1c985b9cd9995c8819985a5b1959605a1b6044820152606401610a14565b6110b06001600160a01b03821684846111d4565b505050565b600061110a826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166112049092919063ffffffff16565b8051909150156110b0578080602001905181019061112891906115c6565b6110b05760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610a14565b600081815b84518110156111cc576111b8828683815181106111ab576111ab611836565b6020026020010151611213565b9150806111c4816117a5565b91505061118c565b509392505050565b6040516001600160a01b0383166024820152604481018290526110b090849063a9059cbb60e01b90606401610ec6565b6060610c14848460008561123f565b600081831061122f576000828152602084905260409020610c17565b5060009182526020526040902090565b6060824710156112a05760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610a14565b6001600160a01b0385163b6112f75760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a14565b600080866001600160a01b0316858760405161131391906116a0565b60006040518083038185875af1925050503d8060008114611350576040519150601f19603f3d011682016040523d82523d6000602084013e611355565b606091505b5091509150611365828286611370565b979650505050505050565b6060831561137f575081610c17565b82511561138f5782518084602001fd5b8160405162461bcd60e51b8152600401610a1491906116e4565b80356001600160a01b03811681146113c057600080fd5b919050565b60008083601f8401126113d757600080fd5b50813567ffffffffffffffff8111156113ef57600080fd5b6020830191508360208260051b850101111561140a57600080fd5b9250929050565b60006020828403121561142357600080fd5b610c17826113a9565b6000806040838503121561143f57600080fd5b611448836113a9565b9150611456602084016113a9565b90509250929050565b6000806040838503121561147257600080fd5b61147b836113a9565b946020939093013593505050565b60008060006060848603121561149e57600080fd5b6114a7846113a9565b9250602084013591506114bc604085016113a9565b90509250925092565b600080600080606085870312156114db57600080fd5b6114e4856113a9565b935060208501359250604085013567ffffffffffffffff81111561150757600080fd5b611513878288016113c5565b95989497509550505050565b6000806000806000806080878903121561153857600080fd5b611541876113a9565b955060208701359450604087013567ffffffffffffffff8082111561156557600080fd5b6115718a838b016113c5565b9096509450606089013591508082111561158a57600080fd5b5061159789828a016113c5565b979a9699509497509295939492505050565b6000602082840312156115bb57600080fd5b8135610c178161184c565b6000602082840312156115d857600080fd5b8151610c178161184c565b600080600080600080600060e0888a0312156115fe57600080fd5b8735965061160e602089016113a9565b955061161c604089016113a9565b969995985095966060810135965060808101359560a0820135955060c0909101359350915050565b6000806040838503121561165757600080fd5b50508035926020909101359150565b60006020828403121561167857600080fd5b813560038110610c1757600080fd5b60006020828403121561169957600080fd5b5051919050565b600082516116b2818460208701611779565b9190910192915050565b60208101600383106116de57634e487b7160e01b600052602160045260246000fd5b91905290565b6020815260008251806020840152611703816040850160208701611779565b601f01601f19169190910160400192915050565b6000821982111561172a5761172a6117f4565b500190565b60008261173e5761173e61180a565b500490565b600081600019048311821515161561175d5761175d6117f4565b500290565b600082821015611774576117746117f4565b500390565b60005b8381101561179457818101518382015260200161177c565b83811115610efd5750506000910152565b60006000198214156117b9576117b96117f4565b5060010190565b600060ff821660ff8114156117d7576117d76117f4565b60010192915050565b6000826117ef576117ef61180a565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b801515811461185a57600080fd5b5056fea26469706673582212201375909766a1b0b9db41175bb15420e21cd2d545257075cfd113a3841ec9abf364736f6c63430008060033";

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
