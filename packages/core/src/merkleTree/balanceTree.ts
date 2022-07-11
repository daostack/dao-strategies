import { BigNumber, utils } from 'ethers';

import { Balances } from '../types';

import { MerkleTree } from './merkleTree';

/** a tree from hash (bytes32) to bignumbers */
export class BalanceTree {
  private readonly tree: MerkleTree;
  readonly totalSupply: BigNumber;

  constructor(balances: Balances) {
    this.totalSupply = BigNumber.from(0);
    balances.forEach((balance) => this.totalSupply.add(balance));
    this.tree = new MerkleTree(
      Array.from(balances.entries()).map(([account, balance]) => {
        return BalanceTree.toNode(account, balance);
      })
    );
  }

  public static verifyProof(
    account: string,
    allocation: BigNumber,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(account, allocation);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  /** toNode hashes the concatenation of the address and the allocation and
   * keeps only the first byte */
  public static toNode(account: string, allocation: BigNumber): Buffer {
    const hash = Buffer.from(
      utils
        .solidityKeccak256(['address', 'uint256'], [account, allocation])
        .substr(2),
      'hex'
    );
    return hash;
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  public getProof(account: string, allocation: BigNumber): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(account, allocation));
  }
}
