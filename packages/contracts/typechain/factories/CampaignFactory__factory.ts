/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CampaignFactory,
  CampaignFactoryInterface,
} from "../CampaignFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "campaignAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "strategyHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "assetAddress",
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
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_strategyHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "__totalSupply",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "__asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_fundTokenDecimals",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
    ],
    name: "deploy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612a02806100206000396000f3fe60806040526004361061001e5760003560e01c8063724e3cee14610023575b600080fd5b6100366100313660046101b0565b610052565b6040516001600160a01b03909116815260200160405180910390f35b600080828b8b8b8b8b8b8b8b60405161006a90610116565b61007b9897969594939291906102b7565b8190604051809103906000f590508015801561009b573d6000803e3d6000fd5b50604080516001600160a01b038084168252808f1660208301529181018d9052606081018c9052608081018b905290891660a082015260c081018590529091507ffde9438b86f35f8344e1bf34b81b699b1dfffff17514918674847e771f2eb64e9060e00160405180910390a19a9950505050505050505050565b6126808061034d83390190565b600082601f83011261013457600080fd5b813567ffffffffffffffff8082111561014f5761014f61031e565b604051601f8301601f19908116603f011681019082821181831017156101775761017761031e565b8160405283815286602085880101111561019057600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060008060008060008060006101208a8c0312156101cf57600080fd5b89356101da81610334565b985060208a0135975060408a0135965060608a0135955060808a01356101ff81610334565b945060a08a0135935060c08a013567ffffffffffffffff8082111561022357600080fd5b61022f8d838e01610123565b945060e08c013591508082111561024557600080fd5b506102528c828d01610123565b9250506101008a013590509295985092959850929598565b6000815180845260005b8181101561029057602081850181015186830182015201610274565b818111156102a2576000602083870101525b50601f01601f19169290920160200192915050565b600061010060018060a01b03808c1684528a60208501528960408501528860608501528088166080850152508560a08401528060c08401526102fb8184018661026a565b905082810360e084015261030f818561026a565b9b9a5050505050505050505050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461034957600080fd5b5056fe60c06040523480156200001157600080fd5b506040516200268038038062002680833981016040819052620000349162000266565b81818585838381600390805190602001906200005292919062000109565b5080516200006890600490602084019062000109565b50505060128111156200008e576040516330e571f960e11b815260040160405180910390fd5b6001600160601b0319606083901b16608052620000ad81600a6200038f565b620000bb6012600a620003a4565b620000c7919062000323565b60a0525050600880546001600160a01b0319166001600160a01b039b909b169a909a179099555050506005949094555060069190915560025550620004e89050565b828054620001179062000466565b90600052602060002090601f0160209004810192826200013b576000855562000186565b82601f106200015657805160ff191683800117855562000186565b8280016001018555821562000186579182015b828111156200018657825182559160200191906001019062000169565b506200019492915062000198565b5090565b5b8082111562000194576000815560010162000199565b600082601f830112620001c157600080fd5b81516001600160401b0380821115620001de57620001de620004b9565b604051601f8301601f19908116603f01168101908282118183101715620002095762000209620004b9565b816040528381526020925086838588010111156200022657600080fd5b600091505b838210156200024a57858201830151818301840152908201906200022b565b838211156200025c5760008385830101525b9695505050505050565b600080600080600080600080610100898b0312156200028457600080fd5b88516200029181620004cf565b809850506020890151965060408901519550606089015194506080890151620002ba81620004cf565b60a08a015160c08b015191955093506001600160401b0380821115620002df57600080fd5b620002ed8c838d01620001af565b935060e08b01519150808211156200030457600080fd5b50620003138b828c01620001af565b9150509295985092959890939650565b6000826200034157634e487b7160e01b600052601260045260246000fd5b500490565b600181815b80851115620003875781600019048211156200036b576200036b620004a3565b808516156200037957918102915b93841c93908002906200034b565b509250929050565b60006200039d8383620003b0565b9392505050565b60006200039d60ff8416835b600082620003c15750600162000460565b81620003d05750600062000460565b8160018114620003e95760028114620003f45762000414565b600191505062000460565b60ff841115620004085762000408620004a3565b50506001821b62000460565b5060208310610133831016604e8410600b841016171562000439575081810a62000460565b62000445838362000346565b80600019048211156200045c576200045c620004a3565b0290505b92915050565b600181811c908216806200047b57607f821691505b602082108114156200049d57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114620004e557600080fd5b50565b60805160601c60a05161213062000550600039600081816104b2015281816106ef0152818161077801526110620152600081816102d90152818161051b01528181610ac501528181610b6901528181610e8601528181610fb0015261112601526121306000f3fe608060405234801561001057600080fd5b50600436106102115760003560e01c80638da5cb5b11610125578063c63d75b6116100ad578063dd62ed3e1161007c578063dd62ed3e14610474578063e640462d146104ad578063ef8b30f7146104d4578063f0b09d24146104e7578063fc41491e146104f057600080fd5b8063c63d75b614610324578063c6e6f5921461043b578063ce96cb771461044e578063d905777e1461046157600080fd5b8063a457c2d7116100f4578063a457c2d7146103dc578063a9059cbb146103ef578063b3d7f6b914610402578063b460af9414610415578063ba0876521461042857600080fd5b80638da5cb5b1461039b57806394bf804d146103ae57806395d89b41146103c1578063a230ce58146103c957600080fd5b80632eb4a7ab116101a8578063402d267d11610177578063402d267d146103245780634cdad506146103395780636dc8eb751461034c5780636e553f651461035f57806370a082311461037257600080fd5b80632eb4a7ab146102bf578063313ce567146102c857806338d52e0f146102d7578063395093511461031157600080fd5b806309823cde116101e457806309823cde1461027c5780630a28a4771461029157806318160ddd146102a457806323b872dd146102ac57600080fd5b806301e1d1141461021657806306fdde031461023157806307a2d13a14610246578063095ea7b314610259575b600080fd5b61021e610503565b6040519081526020015b60405180910390f35b6102396105a2565b6040516102289190611f79565b61021e610254366004611ea0565b610634565b61026c610267366004611dca565b6107a4565b6040519015158152602001610228565b61028f61028a366004611df4565b6107bc565b005b61021e61029f366004611ea0565b610982565b60025461021e565b61026c6102ba366004611d8e565b6109b6565b61021e60065481565b60405160128152602001610228565b7f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b039091168152602001610228565b61026c61031f366004611dca565b6109da565b61021e610332366004611d40565b5060001990565b61021e610347366004611ea0565b610a19565b61028f61035a366004611df4565b610a2a565b61021e61036d366004611ed2565b610aa2565b61021e610380366004611d40565b6001600160a01b031660009081526020819052604090205490565b6008546102f9906001600160a01b031681565b61021e6103bc366004611ed2565b610b54565b610239610be8565b61028f6103d7366004611df4565b610bf7565b61026c6103ea366004611dca565b610d33565b61026c6103fd366004611dca565b610dc5565b61021e610410366004611ea0565b610dd3565b61021e610423366004611ef5565b610deb565b61021e610436366004611ef5565b610f15565b61021e610449366004611ea0565b61102e565b61021e61045c366004611d40565b611087565b61021e61046f366004611d40565b6110a9565b61021e610482366004611d5b565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61021e7f000000000000000000000000000000000000000000000000000000000000000081565b61021e6104e2366004611ea0565b6110c7565b61021e60055481565b61028f6104fe366004611ea0565b6110d2565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a082319060240160206040518083038186803b15801561056557600080fd5b505afa158015610579573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061059d9190611eb9565b905090565b6060600380546105b190612078565b80601f01602080910402602001604051908101604052809291908181526020018280546105dd90612078565b801561062a5780601f106105ff5761010080835404028352916020019161062a565b820191906000526020600020905b81548152906001019060200180831161060d57829003601f168201915b5050505050905090565b60008061064060025490565b90506106726040518060400160405280600f81526020016e636f6e76657274546f41737365747360881b8152506111a8565b61069c60405180604001604052806008815260200167039b430b932b99d160c51b815250846111ee565b6106c660405180604001604052806008815260200167039bab838363c9d160c51b815250826111ee565b6107136040518060400160405280600b81526020016a02fb1b7b73b2930ba329d160ad1b8152507f00000000000000000000000000000000000000000000000000000000000000006111ee565b61074b6040518060400160405280600f81526020016e03a37ba30b620b9b9b2ba3994149d1608d1b815250610746610503565b6111ee565b8015610773578061075a610503565b6107649085612016565b61076e9190611ff4565b61079d565b61079d7f000000000000000000000000000000000000000000000000000000000000000084611ff4565b9392505050565b6000336107b2818585611233565b5060019392505050565b6107c7848433611357565b6107d384848484610a2a565b6108136040518060400160405280601881526020017f2d2d2d2d20636c61696d5265776172642829202d2d2d2d20000000000000000081525085856113b3565b6108456040518060400160405280600d81526020016c746f74616c537570706c79282960981b81525061074660025490565b6108766040518060400160405280600d81526020016c746f74616c417373657473282960981b815250610746610503565b6108bf6040518060400160405280600e81526020016d1cda185c995cc818db185a5b595960921b815250610746866001600160a01b031660009081526020819052604090205490565b6108e86108e1856001600160a01b031660009081526020819052604090205490565b8586610f15565b506109196040518060400160405280600f81526020016e1c995919595b4a0a4818d85b1b1959608a1b8152506111a8565b61094b6040518060400160405280600d81526020016c746f74616c537570706c79282960981b81525061074660025490565b61097c6040518060400160405280600d81526020016c746f74616c417373657473282960981b815250610746610503565b50505050565b60008061098e8361102e565b90508261099a82610634565b106109a65760006109a9565b60015b61079d9060ff1682611fdc565b6000336109c48582856113fa565b6109cf858585611486565b506001949350505050565b3360008181526001602090815260408083206001600160a01b03871684529091528120549091906107b29082908690610a14908790611fdc565b611233565b6000610a2482610634565b92915050565b6001600160a01b03841660009081526007602052604090205460ff16151560011415610a6957604051630c8d9eab60e31b815260040160405180910390fd5b6001600160a01b0384166000908152600760205260409020805460ff19166001179055610a9884848484610bf7565b61097c8484611654565b6000610ab2565b60405180910390fd5b336000610abe856110c7565b9050610aec7f0000000000000000000000000000000000000000000000000000000000000000833088611719565b610af68482611784565b836001600160a01b0316826001600160a01b03167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78784604051610b44929190918252602082015260400190565b60405180910390a3949350505050565b6000336000610b6285610dd3565b9050610b907f0000000000000000000000000000000000000000000000000000000000000000833084611719565b610b9a8486611784565b836001600160a01b0316826001600160a01b03167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78388604051610b44929190918252602082015260400190565b6060600480546105b190612078565b6040516bffffffffffffffffffffffff19606086901b16602082015260348101849052600090605401604051602081830303815290604052805190602001209050610c6d604051806040016040528060148152602001732d2d2d2d20636865636b50726f6f66202d2d2d2d60601b8152506111a8565b610c7681611863565b610cb78383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152505060065491508490506118a8565b610d0157610ce86040518060400160405280600c81526020016b1b195859881a5b9d985b1a5960a21b8152506111a8565b6040516309bde33960e01b815260040160405180910390fd5b610d2c6040518060400160405280600a8152602001691b195859881d985b1a5960b21b8152506111a8565b5050505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919083811015610db85760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610aa9565b6109cf8286868403611233565b6000336107b2818585611486565b600080610ddf83610634565b90508261099a8261102e565b6000610df682611087565b841115610e455760405162461bcd60e51b815260206004820152601f60248201527f455243343632363a207769746864726177206d6f7265207468656e206d6178006044820152606401610aa9565b336000610e5186610982565b9050836001600160a01b0316826001600160a01b031614610e7757610e778483836113fa565b610e8184826118be565b610eac7f00000000000000000000000000000000000000000000000000000000000000008688611a0c565b836001600160a01b0316856001600160a01b0316836001600160a01b03167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db8985604051610f04929190918252602082015260400190565b60405180910390a495945050505050565b6000610f20826110a9565b841115610f6f5760405162461bcd60e51b815260206004820152601d60248201527f455243343632363a2072656465656d206d6f7265207468656e206d61780000006044820152606401610aa9565b336000610f7b86610a19565b9050836001600160a01b0316826001600160a01b031614610fa157610fa18483886113fa565b610fab84876118be565b610fd67f00000000000000000000000000000000000000000000000000000000000000008683611a0c565b836001600160a01b0316856001600160a01b0316836001600160a01b03167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db848a604051610f04929190918252602082015260400190565b60008061103a60025490565b9050821580611047575080155b61105d57611053610503565b6107648285612016565b61079d7f000000000000000000000000000000000000000000000000000000000000000084612016565b6001600160a01b038116600090815260208190526040812054610a2490610634565b6001600160a01b038116600090815260208190526040812054610a24565b6000610a248261102e565b6008546001600160a01b031633146110fd57604051635fc483c560e01b815260040160405180910390fd5b60085460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb90604401602060405180830381600087803b15801561116c57600080fd5b505af1158015611180573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111a49190611e7e565b5050565b6111eb816040516024016111bc9190611f79565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b179052611a3c565b50565b6111a48282604051602401611204929190611fba565b60408051601f198184030181529190526020810180516001600160e01b03166309710a9d60e41b179052611a3c565b6001600160a01b0383166112955760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610aa9565b6001600160a01b0382166112f65760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610aa9565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6040516001600160a01b03808516602483015260448201849052821660648201526113ae9060840160408051601f198184030181529190526020810180516001600160e01b03166325fb28e560e21b179052611a3c565b505050565b6113ae8383836040516024016113cb93929190611f8c565b60408051601f198184030181529190526020810180516001600160e01b03166307c8121760e01b179052611a3c565b6001600160a01b03838116600090815260016020908152604080832093861683529290522054600019811461097c57818110156114795760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610aa9565b61097c8484848403611233565b6001600160a01b0383166114ea5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610aa9565b6001600160a01b03821661154c5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610aa9565b6001600160a01b038316600090815260208190526040902054818110156115c45760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610aa9565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906115fb908490611fdc565b92505081905550826001600160a01b0316846001600160a01b03167f84134276be93ac80587d61574df53197425e0dda5a479ef148d2ab119f92bbed8460405161164791815260200190565b60405180910390a361097c565b6001600160a01b0382166116aa5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610aa9565b6001600160a01b038216600090815260208190526040812080548392906116d2908490611fdc565b90915550506040518181526001600160a01b038316907ff254aace0ef98d6ac1a0d84c95648f8e3f7a1881dbb43393709ecd004b00f1039060200160405180910390a25050565b6040516001600160a01b038085166024830152831660448201526064810182905261097c9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611a5d565b6001600160a01b0382166117da5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610aa9565b80600260008282546117ec9190611fdc565b90915550506001600160a01b03821660009081526020819052604081208054839290611819908490611fdc565b90915550506040518181526001600160a01b038316906000907f84134276be93ac80587d61574df53197425e0dda5a479ef148d2ab119f92bbed9060200160405180910390a35050565b6111eb8160405160240161187991815260200190565b60408051601f198184030181529190526020810180516001600160e01b03166327b7cf8560e01b179052611a3c565b6000826118b58584611b2f565b14949350505050565b6001600160a01b03821661191e5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610aa9565b6001600160a01b038216600090815260208190526040902054818110156119925760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610aa9565b6001600160a01b03831660009081526020819052604081208383039055600280548492906119c1908490612035565b90915550506040518281526000906001600160a01b038516907f84134276be93ac80587d61574df53197425e0dda5a479ef148d2ab119f92bbed9060200160405180910390a3505050565b6040516001600160a01b0383166024820152604481018290526113ae90849063a9059cbb60e01b9060640161174d565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6000611ab2826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611ba39092919063ffffffff16565b8051909150156113ae5780806020019051810190611ad09190611e7e565b6113ae5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610aa9565b600081815b8451811015611b9b576000858281518110611b5157611b516120e4565b60200260200101519050808311611b775760008381526020829052604090209250611b88565b600081815260208490526040902092505b5080611b93816120b3565b915050611b34565b509392505050565b6060611bb28484600085611bba565b949350505050565b606082471015611c1b5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610aa9565b6001600160a01b0385163b611c725760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610aa9565b600080866001600160a01b03168587604051611c8e9190611f5d565b60006040518083038185875af1925050503d8060008114611ccb576040519150601f19603f3d011682016040523d82523d6000602084013e611cd0565b606091505b5091509150611ce0828286611ceb565b979650505050505050565b60608315611cfa57508161079d565b825115611d0a5782518084602001fd5b8160405162461bcd60e51b8152600401610aa99190611f79565b80356001600160a01b0381168114611d3b57600080fd5b919050565b600060208284031215611d5257600080fd5b61079d82611d24565b60008060408385031215611d6e57600080fd5b611d7783611d24565b9150611d8560208401611d24565b90509250929050565b600080600060608486031215611da357600080fd5b611dac84611d24565b9250611dba60208501611d24565b9150604084013590509250925092565b60008060408385031215611ddd57600080fd5b611de683611d24565b946020939093013593505050565b60008060008060608587031215611e0a57600080fd5b611e1385611d24565b935060208501359250604085013567ffffffffffffffff80821115611e3757600080fd5b818701915087601f830112611e4b57600080fd5b813581811115611e5a57600080fd5b8860208260051b8501011115611e6f57600080fd5b95989497505060200194505050565b600060208284031215611e9057600080fd5b8151801515811461079d57600080fd5b600060208284031215611eb257600080fd5b5035919050565b600060208284031215611ecb57600080fd5b5051919050565b60008060408385031215611ee557600080fd5b82359150611d8560208401611d24565b600080600060608486031215611f0a57600080fd5b83359250611f1a60208501611d24565b9150611f2860408501611d24565b90509250925092565b60008151808452611f4981602086016020860161204c565b601f01601f19169290920160200192915050565b60008251611f6f81846020870161204c565b9190910192915050565b60208152600061079d6020830184611f31565b606081526000611f9f6060830186611f31565b6001600160a01b039490941660208301525060400152919050565b604081526000611fcd6040830185611f31565b90508260208301529392505050565b60008219821115611fef57611fef6120ce565b500190565b60008261201157634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615612030576120306120ce565b500290565b600082821015612047576120476120ce565b500390565b60005b8381101561206757818101518382015260200161204f565b8381111561097c5750506000910152565b600181811c9082168061208c57607f821691505b602082108114156120ad57634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156120c7576120c76120ce565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fdfea26469706673582212207bbd153fe83a7846af84a481bc45af4c89c7091e6ffa4e662add07b8441fdd9a64736f6c63430008060033a26469706673582212209a1f22aef9472422faeb914860ae3078739117ee87faa6ed78ef01110d2e58f664736f6c63430008060033";

type CampaignFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CampaignFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CampaignFactory__factory extends ContractFactory {
  constructor(...args: CampaignFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "CampaignFactory";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CampaignFactory> {
    return super.deploy(overrides || {}) as Promise<CampaignFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CampaignFactory {
    return super.attach(address) as CampaignFactory;
  }
  connect(signer: Signer): CampaignFactory__factory {
    return super.connect(signer) as CampaignFactory__factory;
  }
  static readonly contractName: "CampaignFactory";
  public readonly contractName: "CampaignFactory";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CampaignFactoryInterface {
    return new utils.Interface(_abi) as CampaignFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CampaignFactory {
    return new Contract(address, _abi, signerOrProvider) as CampaignFactory;
  }
}
