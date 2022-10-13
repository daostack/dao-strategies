import {
  campaignInstance,
  CampaignCreateDetails,
  Typechain,
  ChainsDetails,
} from '@dao-strategies/core';
import { ethers } from 'ethers';
import { CID } from 'multiformats';
import { base32 } from 'multiformats/bases/base32';
import fetch from 'node-fetch';

import { appLogger } from '../../logger';
import { ChainProviders } from '../../types';

export const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const gasStationGasPrice = async (url: string): Promise<string | undefined> => {
  try {
    const response = await fetch(url, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();

    return ethers.utils
      .parseUnits(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Math.ceil(data.fast.maxFee as number).toString(),
        'gwei'
      )
      .toString();
  } catch (e) {
    console.log(e);
  }
};

export class SendTransactionService {
  readonly campaignFactory: Typechain.CampaignFactory;
  private publishing: Map<string, Promise<void>> = new Map();

  constructor(protected providers: ChainProviders) {}

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

  async getGasPrice(chainId: number): Promise<string> {
    const chain = ChainsDetails.chainOfId(chainId);
    if (!chain) {
      return Promise.resolve(ethers.utils.parseUnits('4', 'gwei').toString());
    }

    const price = await (async (): Promise<string> => {
      switch (chainId) {
        case 1337:
        case 5:
          return ethers.utils.parseUnits('4', 'gwei').toString();

        case 137:
          const price = await gasStationGasPrice(
            'https://gasstation-mainnet.matic.network/v2'
          );
          return price;
      }
    })();

    return price;
  }

  async publishShares(
    address: string,
    chainId: number,
    root: string
  ): Promise<void> {
    const unique = `${chainId}-${address}-${root}`;

    if (this.publishing.has(unique)) {
      appLogger.warn(
        `OnChainService - publishShares - reentered, 
          unique: ${unique}`
      );
      return this.publishing.get(unique);
    }

    const publish = async (): Promise<void> => {
      const signer = this.providers.get(chainId).signer;
      const signerAddress = await signer.getAddress();

      const campaign = campaignInstance(address, signer);
      appLogger.info(
        `OnChainService - publishShares, 
          address: ${address}, 
          root: ${root}, 
          chainId: ${chainId}, 
          signer: ${signerAddress}`
      );
      const gasPrice = await this.getGasPrice(chainId);
      const tx = await campaign.proposeShares(root, ZERO_BYTES32, { gasPrice });
      const rec = await tx.wait();

      appLogger.info(
        `OnChainService - publishedShares! block: ${rec.blockNumber}`
      );
    };

    const publishing = publish();
    this.publishing.set(unique, publishing);

    try {
      await publishing;
    } catch (e) {
      appLogger.error(`error publishing ${unique}`);
      console.error(e);
    }

    this.publishing.delete(unique);
  }
}
