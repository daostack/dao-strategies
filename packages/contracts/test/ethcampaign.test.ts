import { Balances, BalanceTree } from '@dao-strategies/core';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import { EthCampaign, EthCampaign__factory, EthCampaignFactory__factory } from './../typechain';
import { toWei, toBigNumber, fastForwardToTimestamp } from './support';

(BigNumber.prototype as any).toJSON = function () {
  // eslint-disable-next-line
  return this.toString();
};

const RANDOM_BYTES32 = '0x5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8';
const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const URI = RANDOM_BYTES32;
const TOTAL_SHARES = toBigNumber('1', 18);

interface SetupData {
  admin: SignerWithAddress;
  guardian: SignerWithAddress;
  oracle: SignerWithAddress;
  claimers: SignerWithAddress[];
  funders: SignerWithAddress[];
  tree: BalanceTree;
  merkleRoot: string;
  claimersBalances: Balances;
  campaign: EthCampaign;
}

describe('EthCampaign', () => {
  async function setUp(sharesDistribution: BigNumber[], publishShares: boolean): Promise<SetupData> {
    const addresses = await ethers.getSigners();
    const admin = addresses[0];
    const guardian = addresses[1];
    const oracle = addresses[2];
    const claimers = addresses.slice(4, 4 + sharesDistribution.length);
    const funders = addresses.slice(4 + sharesDistribution.length);

    // compute shares merkle root
    const claimersBalances: Balances = new Map();
    claimers.forEach((claimer, index) => {
      claimersBalances.set(claimer.address, sharesDistribution[index]);
    });
    const tree = new BalanceTree(claimersBalances);
    const merkleRoot = tree.getHexRoot();

    // get deployers
    const campaignFactoryDeployer = await ethers.getContractFactory<EthCampaignFactory__factory>('EthCampaignFactory');
    const campaignDeployer = await ethers.getContractFactory<EthCampaign__factory>('EthCampaign');

    // deploy contracts
    const campaignMaster = await campaignDeployer.deploy(); // deploy cmapign master implementation
    const campaignFactory = await campaignFactoryDeployer.deploy(campaignMaster.address);

    // create new campaign
    const campaignCreationTx = await campaignFactory.createCampaign(
      publishShares ? merkleRoot : ZERO_BYTES32,
      publishShares ? URI : ZERO_BYTES32,
      URI,
      guardian.address,
      oracle.address,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('1'))
    );
    const campaignCreationReceipt = await campaignCreationTx.wait();
    const campaignAddress: string = (campaignCreationReceipt as any).events[1].args[1]; // get campaign proxy address from the CampaignCreated event
    const campaign = campaignDeployer.attach(campaignAddress);

    return {
      admin,
      guardian,
      oracle,
      claimers,
      funders,
      tree,
      merkleRoot,
      claimersBalances,
      campaign,
    };
  }

  it('predefined shares at creation', async () => {
    const sharesArray = [TOTAL_SHARES.div(6), TOTAL_SHARES.div(3), TOTAL_SHARES.div(2)];

    const { guardian, oracle, claimers, funders, tree, merkleRoot, claimersBalances, campaign } = await setUp(sharesArray, true);

    // sanity checks
    expect(await campaign.pendingMerkleRoot()).to.equal(merkleRoot);
    expect(await campaign.guardian()).to.equal(guardian.address);
    expect(await campaign.oracle()).to.equal(oracle.address);
    expect(await campaign.strategyUri()).to.equal(URI);

    // funder sends 1 ether to the campaign
    await funders[0].sendTransaction({ to: campaign.address, value: toWei('1') });
    expect(await campaign.providers(funders[0].address)).to.equal(toWei('1'));
    expect(await ethers.provider.getBalance(campaign.address)).to.equal(toWei('1'));

    // fast forward to claim period
    const _activationTime = await campaign.activationTime();
    await fastForwardToTimestamp(_activationTime.add(10));

    // claimer1 claims, should receive 1/6 ether
    const claimer1BalanceBefore = await ethers.provider.getBalance(claimers[0].address);
    const proofClaimer1 = tree.getProof(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber);
    await campaign.claim(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber, proofClaimer1);
    const claimer1BalanceAfter = await ethers.provider.getBalance(claimers[0].address);
    expect(claimer1BalanceAfter.sub(claimer1BalanceBefore)).to.equal(toWei('1').div(6));

    // claimer2 claims, should receive 1/3 ether
    const claimer2BalanceBefore = await ethers.provider.getBalance(claimers[1].address);
    const proofClaimer2 = tree.getProof(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber);
    await campaign.claim(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber, proofClaimer2);
    const claimer2BalanceAfter = await ethers.provider.getBalance(claimers[1].address);
    expect(claimer2BalanceAfter.sub(claimer2BalanceBefore)).to.equal(toWei('1').div(3));

    // claimer3 claims, should receive 1/2 ether
    const claimer3BalanceBefore = await ethers.provider.getBalance(claimers[2].address);
    const proofClaimer3 = tree.getProof(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber);
    await campaign.claim(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber, proofClaimer3);
    const claimer3BalanceAfter = await ethers.provider.getBalance(claimers[2].address);
    expect(claimer3BalanceAfter.sub(claimer3BalanceBefore)).to.equal(toWei('1').div(2));
  });

  it('publish shares ones after creation', async () => {
    const sharesArray = [TOTAL_SHARES.div(6), TOTAL_SHARES.div(3), TOTAL_SHARES.div(2)];

    const { guardian, oracle, claimers, funders, tree, merkleRoot, claimersBalances, campaign } = await setUp(sharesArray, false);

    // sanity checks
    expect(await campaign.pendingMerkleRoot()).to.equal(ZERO_BYTES32);
    expect(await campaign.guardian()).to.equal(guardian.address);
    expect(await campaign.oracle()).to.equal(oracle.address);
    expect(await campaign.strategyUri()).to.equal(URI);

    // funder sends 1 ether to the campaign
    await funders[0].sendTransaction({ to: campaign.address, value: toWei('1') });
    expect(await campaign.providers(funders[0].address)).to.equal(toWei('1'));
    expect(await ethers.provider.getBalance(campaign.address)).to.equal(toWei('1'));

    // oracle publishes shares
    await campaign.connect(oracle).proposeShares(merkleRoot, URI);

    // fast forward to claim period
    const _activationTime = await campaign.activationTime();
    await fastForwardToTimestamp(_activationTime.add(10));

    // claimer1 claims, should receive 1/6 ether
    const claimer1BalanceBefore = await ethers.provider.getBalance(claimers[0].address);
    const proofClaimer1 = tree.getProof(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber);
    await campaign.claim(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber, proofClaimer1);
    const claimer1BalanceAfter = await ethers.provider.getBalance(claimers[0].address);
    expect(claimer1BalanceAfter.sub(claimer1BalanceBefore)).to.equal(toWei('1').div(6));

    // claimer2 claims, should receive 1/3 ether
    const claimer2BalanceBefore = await ethers.provider.getBalance(claimers[1].address);
    const proofClaimer2 = tree.getProof(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber);
    await campaign.claim(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber, proofClaimer2);
    const claimer2BalanceAfter = await ethers.provider.getBalance(claimers[1].address);
    expect(claimer2BalanceAfter.sub(claimer2BalanceBefore)).to.equal(toWei('1').div(3));

    // claimer3 claims, should receive 1/2 ether
    const claimer3BalanceBefore = await ethers.provider.getBalance(claimers[2].address);
    const proofClaimer3 = tree.getProof(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber);
    await campaign.claim(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber, proofClaimer3);
    const claimer3BalanceAfter = await ethers.provider.getBalance(claimers[2].address);
    expect(claimer3BalanceAfter.sub(claimer3BalanceBefore)).to.equal(toWei('1').div(2));
  });
});
