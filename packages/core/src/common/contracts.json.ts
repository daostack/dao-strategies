import contractsJson from '../generated/hardhat_contracts.json';

export class ContractsJson {
  /** eslint-disable */
  static jsonOfChain(): any {
    return contractsJson['1337']['localhost'];
  }
  /** eslint-enable */
}
