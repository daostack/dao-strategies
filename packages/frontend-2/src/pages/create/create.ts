import { BigNumber, ethers } from 'ethers';
import { CID } from 'multiformats/cid';
import { base32 } from 'multiformats/bases/base32';

import { CampaignCreatedEvent } from '../../generated/typechain/CampaignFactory';
import { CampaignFactory } from '../../generated/typechain';

const ZERO_BYTES32 = '0x' + '0'.repeat(64);

export const createCampaign = async (campaignFactory: CampaignFactory, account: string, uri: string) => {
  const salt = ethers.utils.keccak256(ethers.utils.hashMessage(account + Date.now().toString()));
  const uriCid = CID.parse(uri, base32);

  if (uriCid == null) throw new Error(`uri ${uri} is not a CID`);

  const ex = await campaignFactory.createCampaign(
    { sharesMerkleRoot: ZERO_BYTES32, totalShares: BigNumber.from(0) },
    uriCid.multihash.digest,
    account,
    account,
    false,
    ethers.BigNumber.from(1000),
    salt
  );
  const txReceipt = await ex.wait();

  if (txReceipt.events === undefined) throw new Error('txReceipt.events undefined');
  const event = txReceipt.events.find((e) => e.event === 'CampaignCreated') as CampaignCreatedEvent;

  if (event === undefined) throw new Error('event undefined');
  if (event.args === undefined) throw new Error('event.args undefined');

  return event.args.newCampaign;
};
