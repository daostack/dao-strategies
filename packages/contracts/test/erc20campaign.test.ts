import { Balances, BalanceTree } from '@dao-strategies/core';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { deployMockContract } from '@ethereum-waffle/mock-contract';
import { expect } from 'chai';
import { BaseContract, BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import { TestErc20, TestErc20__factory, Erc20Campaign, Erc20Campaign__factory, Erc20CampaignFactory__factory } from './../typechain';
import { toWei, getTimestamp, fastForwardToTimestamp } from './support';
import { MockContract } from '@ethereum-waffle/mock-contract';

(BigNumber.prototype as any).toJSON = function () {
    // eslint-disable-next-line
    return this.toString();
};

const RANDOM_BYTES32 = '0x5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8';
const URI: string = RANDOM_BYTES32;
const SECONDS_IN_DAY = 86400;
const TOTAL_SHARES = ethers.BigNumber.from('1000000000000000000');

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
    async function setup(sharesDistribution: BigNumber[], publishShares: boolean): Promise<SetupData> {
        const addresses = await ethers.getSigners();
        const admin = addresses[0];
        const guardian = addresses[1];
        const oracle = addresses[2];
        const claimers = addresses.slice(4, 4 + sharesDistribution.length);
        const funders = addresses.slice(4 + sharesDistribution.length);
        // eslint-disable-next-line no-param-reassign
        //const totalShares = sharesDistribution.reduce((sum, currentNum) => (sum = sum.add(currentNum)), BigNumber.from(0));
        const claimersBalances: Balances = new Map();
        claimers.forEach((claimer, index) => {
            claimersBalances.set(claimer.address, sharesDistribution[index]);
        });

        const tree = new BalanceTree(claimersBalances);
        const merkleRoot = tree.getHexRoot();

        const currentTimestamp = await getTimestamp();
        const campaignFactoryDeployer = await ethers.getContractFactory<Erc20CampaignFactory__factory>('Erc20CampaignFactory');
        const campaignDeployer = await ethers.getContractFactory<Erc20Campaign__factory>('Erc20Campaign');
        const rewardTokenDeployer = await ethers.getContractFactory<TestErc20__factory>('TestErc20');


        const campaignMaster = await campaignDeployer.deploy(); // deploy cmapign master implementation
        const campaignFactory = await campaignFactoryDeployer.deploy(campaignMaster.address);
        const rewardToken = await rewardTokenDeployer.deploy(BigNumber.from("1000000000000000000000"), admin.address);

        const campaignCreationTx = await campaignFactory.createCampaign(
            merkleRoot,
            URI,
            guardian.address,
            oracle.address,
            publishShares,
            currentTimestamp.add(SECONDS_IN_DAY),
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes('1')),
            rewardToken.address
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
            rewardToken
        };
    }

    it('Should reward claimers according to shares', async () => {
        const sharesArray = [ethers.BigNumber.from('1000000000000000000').div(6), ethers.BigNumber.from('1000000000000000000').div(3), ethers.BigNumber.from('1000000000000000000').div(2)];

        const { admin, guardian, oracle, claimers, funders, tree, merkleRoot, claimersBalances, campaign, rewardToken } = await setup(sharesArray, true);

        // sanity checks
        expect(await campaign.sharesMerkleRoot()).to.equal(merkleRoot);
        expect(await campaign.guardian()).to.equal(guardian.address);
        expect(await campaign.oracle()).to.equal(oracle.address);
        expect(await campaign.uri()).to.equal(URI);
        expect(await campaign.sharesPublished()).to.equal(true);
        expect(await campaign.rewardToken()).to.equal(rewardToken.address);

        // funder sends 1000 tokens to the campaign
        await rewardToken.connect(admin).transfer(funders[0].address, BigNumber.from("1000000000000000000000"));
        await rewardToken.connect(funders[0]).increaseAllowance(campaign.address, BigNumber.from("1000000000000000000000"));
        await campaign.connect(funders[0]).transferValueIn(BigNumber.from("1000000000000000000000"));
        expect(await campaign.funds(funders[0].address)).to.equal(BigNumber.from("1000000000000000000000"));
        expect(await rewardToken.balanceOf(campaign.address)).to.equal(BigNumber.from("1000000000000000000000"));
        expect(await campaign.totalReward()).to.equal(BigNumber.from("1000000000000000000000"));

        // fast forward to claim period
        const _claimPeriodStart = await campaign.claimPeriodStart();
        await fastForwardToTimestamp(_claimPeriodStart.add(10));

        // claimer1 claims, should receive 1/6 of the tokens
        const claimer1BalanceBefore = await rewardToken.balanceOf(claimers[0].address);
        const proofClaimer1 = tree.getProof(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber);
        await campaign.claim(claimers[0].address, claimersBalances.get(claimers[0].address) as BigNumber, proofClaimer1);
        const claimer1BalanceAfter = await rewardToken.balanceOf(claimers[0].address);
        expect(claimer1BalanceAfter.sub(claimer1BalanceBefore)).to.equal(BigNumber.from("1000000000000000000000").mul(sharesArray[0]).div(TOTAL_SHARES));

        // claimer2 claims, should receive 1/3 of the tokens
        const claimer2BalanceBefore = await rewardToken.balanceOf(claimers[1].address);
        const proofClaimer2 = tree.getProof(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber);
        await campaign.claim(claimers[1].address, claimersBalances.get(claimers[1].address) as BigNumber, proofClaimer2);
        const claimer2BalanceAfter = await rewardToken.balanceOf(claimers[1].address);
        expect(claimer2BalanceAfter.sub(claimer2BalanceBefore)).to.equal(BigNumber.from("1000000000000000000000").mul(sharesArray[1]).div(TOTAL_SHARES));

        // claimer3 claims, should receive 1/2 of the tokens
        const claimer3BalanceBefore = await rewardToken.balanceOf(claimers[2].address);
        const proofClaimer3 = tree.getProof(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber);
        await campaign.claim(claimers[2].address, claimersBalances.get(claimers[2].address) as BigNumber, proofClaimer3);
        const claimer3BalanceAfter = await rewardToken.balanceOf(claimers[2].address);
        expect(claimer3BalanceAfter.sub(claimer3BalanceBefore)).to.equal(BigNumber.from("1000000000000000000000").mul(sharesArray[2]).div(TOTAL_SHARES));
    });
});
