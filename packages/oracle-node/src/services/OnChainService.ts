import { Wallet, Signer, Contract, ContractInterface, providers } from 'ethers';
import { CID } from 'multiformats';
import { base32 } from 'multiformats/bases/base32';

import {
  CampaignCreateDetails,
  contractsJson,
  Typechain,
} from '@dao-strategies/core';

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

/* eslint-disable */
const CampaignFactoryJson: any = (contractsJson as any)['31337']['localhost'][
  'contracts'
]['CampaignFactory'];

const Erc20CampaignJson: any = (contractsJson as any)['31337']['localhost'][
  'contracts'
]['Erc20Campaign'];

const EthCampaignJson: any = (contractsJson as any)['31337']['localhost'][
  'contracts'
]['EthCampaign'];
/* eslint-enable */

export class OnChainService {
  readonly signer: Signer;
  readonly provider: providers.JsonRpcProvider;
  readonly campaignFactory: Typechain.CampaignFactory;

  constructor(_signer?: Signer, _provider?: providers.JsonRpcProvider) {
    const signer = _signer || new Wallet(process.env.ORACLE_PRIVATE_KEY);
    this.provider =
      _provider || new providers.JsonRpcProvider(process.env.JSON_RPC_URL);

    this.signer = signer.connect(this.provider);

    /* eslint-disable */

    this.campaignFactory = new Contract(
      CampaignFactoryJson.address,
      CampaignFactoryJson.abi,
      this.signer
    ) as Typechain.CampaignFactory;
    /* eslint-enable */
  }

  // async ready(): Promise<void> {
  //   if (this.signer.provider === undefined) {
  //     throw new Error('Provider undefined');
  //   }

  //   await this.signer.provider.ready();
  // }

  async deploy(
    uri: string,
    root: string,
    file: string,
    details: CampaignCreateDetails,
    _salt?: Uint8Array
  ): Promise<string> {
    const uriCid = CID.parse(uri, base32);
    const salt = _salt || uriCid.multihash.digest;

    /** TODO: What happens if two campaigns are deployed on the same block?
     * Anyway, this method is only for tests  */

    const tx = await this.campaignFactory.createCampaign(
      root,
      ZERO_BYTES32,
      uriCid.multihash.digest,
      details.guardian,
      details.oracle,
      salt
    );

    const txReceipt = await tx.wait();

    if (txReceipt.events === undefined)
      throw new Error('txReceipt.events undefined');

    /* eslint-disable */
    const event = txReceipt.events.find(
      (e) => e.event === 'CampaignCreated'
    ) as any;

    if (event === undefined) throw new Error('event undefined');
    if (event.args === undefined) throw new Error('event.args undefined');

    return event.args.newCampaign;
    /* eslint-enable */
  }

  async publishShares(address: string, root: string): Promise<void> {
    const campaign = new Contract(
      address,
      ['function proposeShares(bytes32,bytes32) external'],
      this.signer
    );

    /* eslint-disable */
    const tx = await campaign.proposeShares(root, ZERO_BYTES32);
    const rec = await tx.wait();
    /* eslint-enable */
  }
}
