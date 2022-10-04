import { Balances, BalanceTree } from '@dao-strategies/core';
import { CampaignFactory } from '@dao-strategies/core/dist/types/generated/typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import { Campaign, Campaign__factory, CampaignFactory__factory } from './../typechain';
import { toWei, toBigNumber, fastForwardToTimestamp, getTimestamp } from './support';

const TOTAL_SHARES = toBigNumber('1', 18);
const ZERO_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
const SECONDS_IN_WEEK = 604800;
const SECONDS_IN_DAY = 86400;

enum ChallengeAction {
    CancelPending,
    CancelPendingAndLockCurrent,
    CancelCampaign
}

const deployCampaign = async () => {
    const campaignDeployer = await ethers.getContractFactory<Campaign__factory>('Campaign');
    const campaign = await campaignDeployer.deploy();
    return await campaign.deployed();
}

const deployCampaignFactory = async (campaignMasterAddress: string) => {
    const campaignFactoryDeployer = await ethers.getContractFactory<CampaignFactory__factory>('CampaignFactory');
    const campaignFactory = await campaignFactoryDeployer.deploy(campaignMasterAddress);
    return await campaignFactory.deployed();
}

describe("Campaign via Factory", () => {
    let campaignFactory: CampaignFactory;
    let counter = 0;
    before(async () => {
        let campaignMaster = await deployCampaign();
        campaignFactory = await deployCampaignFactory(campaignMaster.address);
    });

    describe("when there are two contributors with 50-50 shares", () => {
        let campaginProxy: Campaign;
        let funder: SignerWithAddress;
        let account1: SignerWithAddress;
        let account2: SignerWithAddress;
        let handler: SignerWithAddress;
        let guardian: SignerWithAddress;
        let oracle: SignerWithAddress;
        const claimer1Shares = toBigNumber('0.5', 18);
        const claimer2Shares = toBigNumber('0.5', 18);

        beforeEach(async () => {
            [funder, account1, account2, handler, guardian, oracle] = await ethers.getSigners();
            const campaignCreationTx = await campaignFactory.createCampaign(
                ZERO_BYTES,
                guardian.address,
                oracle.address,
                0,
                SECONDS_IN_WEEK,
                SECONDS_IN_WEEK,
                SECONDS_IN_DAY,
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(counter.toString()))
            );
            counter++;
            const campaignCreationReceipt = await campaignCreationTx.wait();
            const campaignProxyAddress: string = (campaignCreationReceipt as any).events[1].args[1]; // get campaign proxy address from the CampaignCreated event
            campaginProxy = await ethers.getContractAt("Campaign", campaignProxyAddress);
        });

        describe("and the oracle includes them both in the tree", () => {
            let tree: BalanceTree;

            beforeEach(async () => {
                const claimersBalances: Balances = new Map();
                claimersBalances.set(account1.address, claimer1Shares);
                claimersBalances.set(account2.address, claimer2Shares);
                tree = new BalanceTree(claimersBalances);
                let tx = await campaginProxy.connect(oracle).proposeShares(tree.getHexRoot(), ZERO_BYTES);
                await tx.wait();
            });

            describe("and a funder sends 1 Eth with the fund function", () => {
                beforeEach(async () => {
                    let tx = await campaginProxy.connect(funder).fund(ethers.constants.AddressZero, ethers.utils.parseEther("1.0"), { value: ethers.utils.parseEther("1.0") });
                    await tx.wait();
                });

                it("returns 1 Eth for balanceOfAsset", async () => {
                    expect(await campaginProxy.balanceOfAsset(ethers.constants.AddressZero)).to.eq(
                        ethers.utils.parseEther("1.0").toString()
                    );
                });

                describe("and first account tries to claim while challenge period", () => {
                    it("reverts with InvalidProof", async () => {
                        const proofAccount1 = tree.getProof(account1.address, claimer1Shares);
                        let tx = await campaginProxy.connect(account1).claim(account1.address, claimer1Shares, proofAccount1, [ethers.constants.AddressZero], account1.address);
                        await expect(tx.wait()).to.be.reverted;
                    });
                });

                describe("and the oracle tries to update the root while challenge period", () => {
                    it("reverts with ChallengePeriodActive", async () => {
                        let tx = await campaginProxy.connect(oracle).proposeShares(ZERO_BYTES, ZERO_BYTES);
                        await expect(tx.wait()).to.be.reverted;
                    });
                });

                describe("and the guardian cancels the campaign", () => {
                    beforeEach(async () => {
                        let tx = await campaginProxy.connect(guardian).challenge(ChallengeAction.CancelCampaign);
                        tx.wait();
                    });

                    it("reverts when first account tries to claim", async () => {
                        const proofAccount1 = tree.getProof(account1.address, claimer1Shares);
                        let tx = await campaginProxy.connect(account1).claim(account1.address, claimer1Shares, proofAccount1, [ethers.constants.AddressZero], account1.address);
                        await expect(tx.wait()).to.be.reverted;
                    });

                    it("funder withdraws his funds", async () => {
                        let funderBalanceBeforeWithdraw = await ethers.provider.getBalance(funder.address);
                        let tx = await campaginProxy.connect(funder).withdrawAssets(funder.address, ethers.constants.AddressZero);
                        const { gasUsed, effectiveGasPrice } = await tx.wait();
                        const gasCostWithdraw = gasUsed.mul(effectiveGasPrice);
                        let funderBalanceAfterWithdraw = await ethers.provider.getBalance(funder.address);
                        expect(funderBalanceAfterWithdraw.add(gasCostWithdraw)).to.eq(funderBalanceBeforeWithdraw.add(ethers.utils.parseEther('1')));
                    });
                });

                describe("and the guardian cancels the pending root", () => {
                    beforeEach(async () => {
                        let tx = await campaginProxy.connect(guardian).challenge(ChallengeAction.CancelPending);
                        await tx.wait();
                    });

                    it("reverts when first account tries to claim", async () => {
                        const proofAccount1 = tree.getProof(account1.address, claimer1Shares);
                        let tx = await campaginProxy.connect(account1).claim(account1.address, claimer1Shares, proofAccount1, [ethers.constants.AddressZero], account1.address);
                        await expect(tx.wait()).to.be.reverted;
                    });

                    describe("and the challenge period passes", () => {
                        beforeEach(async () => {
                            const activationTime = await campaginProxy.activationTime();
                            await fastForwardToTimestamp(activationTime.add(10));
                        });

                        it("reverts when first account tries to claim", async () => {
                            const proofAccount1 = tree.getProof(account1.address, claimer1Shares);
                            let tx = await campaginProxy.connect(account1).claim(account1.address, claimer1Shares, proofAccount1, [ethers.constants.AddressZero], account1.address);
                            await expect(tx.wait()).to.be.reverted;
                        });
                    });

                });

                describe("and first account claims after challenge period", () => {
                    let account1BalanceBeforeClaim: BigNumber;
                    let gasCostClaim: BigNumber;

                    beforeEach(async () => {
                        account1BalanceBeforeClaim = await ethers.provider.getBalance(account1.address);
                        // fast forward to claim period and then claim
                        const activationTime = await campaginProxy.activationTime();
                        await fastForwardToTimestamp(activationTime.add(10));
                        const proofAccount1 = tree.getProof(account1.address, claimer1Shares);
                        let tx = await campaginProxy.connect(account1).claim(account1.address, claimer1Shares, proofAccount1, [ethers.constants.AddressZero], account1.address);
                        const { gasUsed, effectiveGasPrice } = await tx.wait();
                        gasCostClaim = gasUsed.mul(effectiveGasPrice);
                    });

                    it("account1 received the reward", async () => {
                        let account1balanceAfterClaim = await ethers.provider.getBalance(account1.address);
                        expect(account1balanceAfterClaim.add(gasCostClaim)).to.eq(account1BalanceBeforeClaim.add(ethers.utils.parseEther('0.5')));
                    });

                    describe("and the funder sends 1 more Eth", () => {
                        beforeEach(async () => {
                            let tx = await campaginProxy.connect(funder).fund(ethers.constants.AddressZero, ethers.utils.parseEther("1.0"), { value: ethers.utils.parseEther("1.0") });
                            await tx.wait();
                        });

                        describe("and first account claims again", () => {
                            let account1BalanceBeforeClaim: BigNumber;
                            let gasCostClaim: BigNumber;

                            beforeEach(async () => {
                                account1BalanceBeforeClaim = await ethers.provider.getBalance(account1.address);
                                // fast forward to claim period and then claim
                                const proofAccount1 = tree.getProof(account1.address, claimer1Shares);
                                let tx = await campaginProxy.connect(account1).claim(account1.address, claimer1Shares, proofAccount1, [ethers.constants.AddressZero], account1.address);
                                const { gasUsed, effectiveGasPrice } = await tx.wait();
                                gasCostClaim = gasUsed.mul(effectiveGasPrice);
                            });

                            it("account1 received the reward", async () => {
                                let account1balanceAfterClaim = await ethers.provider.getBalance(account1.address);
                                expect(account1balanceAfterClaim.add(gasCostClaim)).to.eq(account1BalanceBeforeClaim.add(ethers.utils.parseEther('0.5')));
                            });

                            describe("and second account claims", () => {
                                let account2BalanceBeforeClaim: BigNumber;
                                let gasCostClaim: BigNumber;

                                beforeEach(async () => {
                                    account2BalanceBeforeClaim = await ethers.provider.getBalance(account2.address);
                                    // fast forward to claim period and then claim
                                    const proofAccount2 = tree.getProof(account2.address, claimer1Shares);
                                    let tx = await campaginProxy.connect(account2).claim(account2.address, claimer2Shares, proofAccount2, [ethers.constants.AddressZero], account2.address);
                                    const { gasUsed, effectiveGasPrice } = await tx.wait();
                                    gasCostClaim = gasUsed.mul(effectiveGasPrice);
                                });

                                it("account2 received the reward", async () => {
                                    let account2balanceAfterClaim = await ethers.provider.getBalance(account2.address);
                                    expect(account2balanceAfterClaim.add(gasCostClaim)).to.eq(account2BalanceBeforeClaim.add(ethers.utils.parseEther('1')));
                                });
                            });
                        })
                    });

                });

            });

            describe("and a funder sends 1 Eth directly to the contract", () => {
                beforeEach(async () => {
                    let tx = await funder.sendTransaction({ to: campaginProxy.address, value: ethers.utils.parseEther("1") });
                    await tx.wait();
                });

                it("returns 1 Eth for balanceOfAsset for Eth", async () => {
                    expect(await campaginProxy.balanceOfAsset(ethers.constants.AddressZero)).to.eq(
                        ethers.utils.parseEther("1.0").toString()
                    );
                });

            });



        });

    });
});
