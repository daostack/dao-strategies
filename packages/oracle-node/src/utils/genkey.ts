import { ethers } from 'ethers';

const wallet = ethers.Wallet.createRandom();
console.log({ wallet: wallet._mnemonic() });
