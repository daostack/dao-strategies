import { Balances, BalanceTree } from '@dao-strategies/core';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
// import { deployMockContract } from '@ethereum-waffle/mock-contract';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import {
  TestErc20,
  TestErc20__factory,
  Erc20Campaign,
  Erc20Campaign__factory,
  Erc20CampaignFactory__factory,
  CampaignFactory__factory,
  EthCampaign__factory,
} from './../typechain';
import { toBigNumber, fastForwardToTimestamp } from './support';
// import { MockContract } from '@ethereum-waffle/mock-contract';

(BigNumber.prototype as any).toJSON = function () {
  // eslint-disable-next-line
  return this.toString();
};

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const URI = '0x5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8';
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
  campaign: Erc20Campaign;
  rewardToken: TestErc20;
}

describe('Erc20Campaign', () => {
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
    const campaignFactoryDeployer = await ethers.getContractFactory<CampaignFactory__factory>('CampaignFactory');
    const erc20CampaignDeployer = await ethers.getContractFactory<Erc20Campaign__factory>('Erc20Campaign');
    const ethCampaignDeployer = await ethers.getContractFactory<EthCampaign__factory>('EthCampaign');
    const rewardTokenDeployer = await ethers.getContractFactory<TestErc20__factory>('TestErc20');

    // deploy contracts
    const erc20CampaignMaster = await erc20CampaignDeployer.deploy(); // deploy cmapign master implementation
    const ethCampaignMaster = await ethCampaignDeployer.deploy(); // deploy cmapign master implementation
    const campaignFactory = await campaignFactoryDeployer.deploy(erc20CampaignMaster.address, ethCampaignMaster.address);
    const rewardToken = await rewardTokenDeployer.deploy(toBigNumber('1000', 18), admin.address);

    // create new campaign
    const campaignCreationTx = await campaignFactory.createErc20Campaign(
      publishShares ? merkleRoot : ZERO_BYTES32,
      publishShares ? URI : ZERO_BYTES32,
      URI,
      guardian.address,
      oracle.address,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('1')),
      rewardToken.address
    );
    const campaignCreationReceipt = await campaignCreationTx.wait();
    const campaignAddress: string = (campaignCreationReceipt as any).events[1].args[1]; // get campaign proxy address from the CampaignCreated event
    const campaign = erc20CampaignDeployer.attach(campaignAddress);

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
      rewardToken,
    };
  }

  it('predefined shares at creation', async () => {
    const sharesArray = [TOTAL_SHARES.div(6), TOTAL_SHARES.div(3), TOTAL_SHARES.div(2)];

    const { admin, guardian, oracle, claimers, funders, tree, merkleRoot, claimersBalances, campaign, rewardToken } = await setUp(sharesArray, true);

    // sanity checks
    expect(await campaign.pendingMerkleRoot()).to.equal(merkleRoot);
    expect(await campaign.guardian()).to.equal(guardian.address);
    expect(await campaign.oracle()).to.equal(oracle.address);
    expect(await campaign.strategyUri()).to.equal(URI);

    // funder sends 1000 tokens to the campaign
    await rewardToken.connect(admin).transfer(funders[0].address, toBigNumber('1000', 18));
    await rewardToken.connect(funders[0]).increaseAllowance(campaign.address, toBigNumber('1000', 18));
    await campaign.connect(funders[0]).transferValueIn(toBigNumber('1000', 18));
    expect(await campaign.providers(funders[0].address)).to.equal(toBigNumber('1000', 18));
    expect(await rewardToken.balanceOf(campaign.address)).to.equal(toBigNumber('1000', 18));
    expect(await campaign.totalReward()).to.equal(toBigNumber('1000', 18));

    // fast forward to claim period
    const _activationTime = await campaign.activationTime();
    await fastForwardToTimestamp(_activationTime.add(10));

    // claimer1 claims, should receive 1/6 of the tokens
    const claimer1BalanceBefore = await rewardToken.balanceOf(claimers[0].address);
    const proofClaimer1 = tree.getProof(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber);
    await campaign.claim(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber, proofClaimer1);
    const claimer1BalanceAfter = await rewardToken.balanceOf(claimers[0].address);
    expect(claimer1BalanceAfter.sub(claimer1BalanceBefore)).to.equal(toBigNumber('1000', 18).mul(sharesArray[0]).div(TOTAL_SHARES));

    // claimer2 claims, should receive 1/3 of the tokens
    const claimer2BalanceBefore = await rewardToken.balanceOf(claimers[1].address);
    const proofClaimer2 = tree.getProof(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber);
    await campaign.claim(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber, proofClaimer2);
    const claimer2BalanceAfter = await rewardToken.balanceOf(claimers[1].address);
    expect(claimer2BalanceAfter.sub(claimer2BalanceBefore)).to.equal(toBigNumber('1000', 18).mul(sharesArray[1]).div(TOTAL_SHARES));

    // claimer3 claims, should receive 1/2 of the tokens
    const claimer3BalanceBefore = await rewardToken.balanceOf(claimers[2].address);
    const proofClaimer3 = tree.getProof(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber);
    await campaign.claim(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber, proofClaimer3);
    const claimer3BalanceAfter = await rewardToken.balanceOf(claimers[2].address);
    expect(claimer3BalanceAfter.sub(claimer3BalanceBefore)).to.equal(toBigNumber('1000', 18).mul(sharesArray[2]).div(TOTAL_SHARES));
  });

  it('publish shares ones after creation', async () => {
    const sharesArray = [TOTAL_SHARES.div(6), TOTAL_SHARES.div(3), TOTAL_SHARES.div(2)];

    const { admin, guardian, oracle, claimers, funders, tree, merkleRoot, claimersBalances, campaign, rewardToken } = await setUp(sharesArray, false);

    // sanity checks
    expect(await campaign.pendingMerkleRoot()).to.equal(ZERO_BYTES32);
    expect(await campaign.guardian()).to.equal(guardian.address);
    expect(await campaign.oracle()).to.equal(oracle.address);
    expect(await campaign.strategyUri()).to.equal(URI);

    // funder sends 1000 tokens to the campaign
    await rewardToken.connect(admin).transfer(funders[0].address, toBigNumber('1000', 18));
    await rewardToken.connect(funders[0]).increaseAllowance(campaign.address, toBigNumber('1000', 18));
    await campaign.connect(funders[0]).transferValueIn(toBigNumber('1000', 18));
    expect(await campaign.providers(funders[0].address)).to.equal(toBigNumber('1000', 18));
    expect(await rewardToken.balanceOf(campaign.address)).to.equal(toBigNumber('1000', 18));
    expect(await campaign.totalReward()).to.equal(toBigNumber('1000', 18));

    // oracle publishes shares
    await campaign.connect(oracle).proposeShares(merkleRoot, URI);

    // fast forward to claim period
    const _activationTime = await campaign.activationTime();
    await fastForwardToTimestamp(_activationTime.add(10));

    // claimer1 claims, should receive 1/6 of the tokens
    const claimer1BalanceBefore = await rewardToken.balanceOf(claimers[0].address);
    const proofClaimer1 = tree.getProof(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber);
    await campaign.claim(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber, proofClaimer1);
    const claimer1BalanceAfter = await rewardToken.balanceOf(claimers[0].address);
    expect(claimer1BalanceAfter.sub(claimer1BalanceBefore)).to.equal(toBigNumber('1000', 18).mul(sharesArray[0]).div(TOTAL_SHARES));

    // claimer2 claims, should receive 1/3 of the tokens
    const claimer2BalanceBefore = await rewardToken.balanceOf(claimers[1].address);
    const proofClaimer2 = tree.getProof(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber);
    await campaign.claim(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber, proofClaimer2);
    const claimer2BalanceAfter = await rewardToken.balanceOf(claimers[1].address);
    expect(claimer2BalanceAfter.sub(claimer2BalanceBefore)).to.equal(toBigNumber('1000', 18).mul(sharesArray[1]).div(TOTAL_SHARES));

    // claimer3 claims, should receive 1/2 of the tokens
    const claimer3BalanceBefore = await rewardToken.balanceOf(claimers[2].address);
    const proofClaimer3 = tree.getProof(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber);
    await campaign.claim(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber, proofClaimer3);
    const claimer3BalanceAfter = await rewardToken.balanceOf(claimers[2].address);
    expect(claimer3BalanceAfter.sub(claimer3BalanceBefore)).to.equal(toBigNumber('1000', 18).mul(sharesArray[2]).div(TOTAL_SHARES));
  });
});
