import {
  Wallet,
  Signer,
  Contract,
  BigNumber,
  ContractInterface,
  providers,
} from 'ethers';
import { CID } from 'multiformats';
import { base32 } from 'multiformats/bases/base32';

import hardhatContractsJson from '../generated/hardhat_contracts.json';
import { Campaign, CampaignFactory } from '../generated/typechain';
import { CampaignCreatedEvent } from '../generated/typechain/CampaignFactory';

import { CampaignCreateDetails } from './types';

/* eslint-disable */
const CampaignFactoryJson: any = (hardhatContractsJson as any)['31337'][
  'localhost'
]['contracts']['CampaignFactory'];

const CampaignJson: any = (hardhatContractsJson as any)['31337']['localhost'][
  'contracts'
]['Campaign'];
/* eslint-enable */

export class OnChainService {
  readonly signer: Signer;
  readonly provider: providers.JsonRpcProvider;
  readonly campaignFactory: CampaignFactory;

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
    ) as CampaignFactory;
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
    shares: Campaign.SharesDataStruct,
    details: CampaignCreateDetails,
    _salt?: Uint8Array
  ): Promise<string> {
    const uriCid = CID.parse(uri, base32);
    const salt = _salt || uriCid.multihash.digest;

    const tx = await this.campaignFactory.createCampaign(
      shares,
      uriCid.multihash.digest,
      details.guardian,
      details.oracle,
      false,
      0,
      salt
    );

    const txReceipt = await tx.wait();

    if (txReceipt.events === undefined)
      throw new Error('txReceipt.events undefined');
    const event = txReceipt.events.find(
      (e) => e.event === 'CampaignCreated'
    ) as CampaignCreatedEvent;

    if (event === undefined) throw new Error('event undefined');
    if (event.args === undefined) throw new Error('event.args undefined');

    return event.args.newCampaign;
  }

  async publishShares(address: string, root: string): Promise<void> {
    const campaign = new Contract(
      address,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      CampaignJson.abi as ContractInterface,
      this.signer
    ) as Campaign;
    const tx = await campaign.publishShares({
      sharesMerkleRoot: root,
      totalShares: BigNumber.from('1000000000000000000'),
    });
    const rec = await tx.wait();
    console.log({ rec });
  }
}
