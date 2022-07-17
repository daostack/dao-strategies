import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { TestErc20 } from './../typechain';

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getChainId } = hre;
  const { deploy } = deployments;
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];

  const chainId = await getChainId();

  console.log(`deploying to chain id: ${chainId}`);

  const campaign = await deploy('Campaign', {
    from: deployer.address,
    args: [],
    log: true,
  });

  await deploy('CampaignFactory', {
    from: deployer.address,
    args: [campaign.address],
    log: true,
  });

  if (chainId == '31337') { //hardhat or localhost
    const erc20token = await deploy('TestErc20', {
      from: deployer.address,
      args: [hre.ethers.utils.parseEther('1000000'), deployer.address],
      log: true,
      contract: 'TestErc20',
    });

    const erc20token2 = await deploy('TestErc20_02', {
      from: deployer.address,
      args: [hre.ethers.utils.parseEther('1000000'), deployer.address],
      log: true,
      contract: 'TestErc20',
    });


    /** transfer DAI to accounts */
    await Promise.all(
      [erc20token.address, erc20token2.address].map(async (address: string) => {
        const token = new hre.ethers.Contract(address, erc20Abi, deployer) as TestErc20;
        await (await token.transfer(signers[1].address, hre.ethers.utils.parseEther('100000'))).wait();
        await (await token.transfer(signers[2].address, hre.ethers.utils.parseEther('200000'))).wait();
        await (await token.transfer(signers[3].address, hre.ethers.utils.parseEther('300000'))).wait();
        await (await token.transfer(signers[4].address, hre.ethers.utils.parseEther('400000'))).wait();
      })
    );
  }
};

export default deploy;

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
