import { BalancesFloat, BalanceTree } from "@dao-strategies/core";
import { toWei } from "./support";

function main() {
  const claimers = [
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  ];

  /**
   * Account 1 : 1000 shares
   * Account 2 : 2000 shares
   * Account 3 : 3000 shares
   */
  const claimersBalances: BalancesFloat = new Map();
  //= claimers.map((claimer, ix) => {
  //  return {
  //    account: claimer,
  //    balance: toWei((1000 * (ix + 1)).toString()),
  //  };
  //});
  claimersBalances.set("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 10);
  //const tree = new BalanceTree(claimersBalances);
  console.log("tree");
}

main();
