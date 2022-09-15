/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import contractsJson from '../generated/hardhat_contracts.json';

export class ContractsJson {
  /** eslint-disable */
  static jsonOfChain(chainId: number): any {
    const json = (contractsJson as any)[chainId.toString()];
    if (json === undefined)
      throw new Error(`JSON of chain ${chainId} not found`);

    const chainName = Object.getOwnPropertyNames(json);
    if (chainName.length === 0)
      throw new Error(`JSON of chain ${chainId} not found`);

    return json[chainName[0]];
  }

  static defaultJson(): any {
    /** default json is useful to get the abi without needing to know the chainId.
     * It assumes the abi is the same on all chains */
    return contractsJson['1337']['localhost'];
  }

  static chainIds(): number[] {
    const chainsNames = Object.getOwnPropertyNames(contractsJson);
    return chainsNames.map((name) => +name);
  }

  /** eslint-enable */
}
