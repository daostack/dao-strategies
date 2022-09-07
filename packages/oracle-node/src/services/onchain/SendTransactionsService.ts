import {
  campaignInstance,
  CampaignCreateDetails,
  ContractsJson,
  Typechain,
} from '@dao-strategies/core';

import { Wallet, Signer, Contract, providers } from 'ethers';
import { CID } from 'multiformats';
import { base32 } from 'multiformats/bases/base32';
import { appLogger } from '../../logger';

export const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

/* eslint-disable */
const CampaignFactoryJson =
  ContractsJson.jsonOfChain().contracts.CampaignFactory;
/* eslint-enable */

export class SendTransactionService {
  readonly campaignFactory: Typechain.CampaignFactory;

  constructor(
    protected signer: Signer,
    protected provider: providers.Provider
  ) {
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
      uriCid.multihash.digest,
      details.guardian,
      details.oracle,
      details.activationTime,
      details.CHALLENGE_PERIOD,
      details.ACTIVATION_PERIOD,
      details.ACTIVE_DURATION,
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
    const campaign = campaignInstance(address, this.signer);
    const tx = await campaign.proposeShares(root, ZERO_BYTES32);
    const rec = await tx.wait();
    appLogger.info(
      `OnChainService - publishedShares, address: ${address}, root: ${root}, block: ${rec.blockNumber}`
    );
  }
}