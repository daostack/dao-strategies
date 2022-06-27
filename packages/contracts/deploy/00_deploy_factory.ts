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
  const { deployments } = hre;
  const { deploy } = deployments;
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];

  const campaignErc20 = await deploy('Erc20Campaign', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer.address,
    args: [],
    log: true,
  });

  const campaignEth = await deploy('EthCampaign', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer.address,
    args: [],
    log: true,
  });

  const erc20token = await deploy('TestErc20', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer.address,
    args: [hre.ethers.utils.parseEther('1000000'), deployer.address],
    log: true,
  });

  await deploy('CampaignFactory', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer.address,
    args: [campaignErc20.address, campaignEth.address],
    log: true,
  });

  /** transfer DAI to accounts */
  const token = new hre.ethers.Contract(erc20token.address, erc20Abi, deployer) as TestErc20;
  await (await token.transfer(signers[1].address, hre.ethers.utils.parseEther('100000'))).wait();
  await (await token.transfer(signers[2].address, hre.ethers.utils.parseEther('200000'))).wait();
  await (await token.transfer(signers[3].address, hre.ethers.utils.parseEther('300000'))).wait();
  await (await token.transfer(signers[4].address, hre.ethers.utils.parseEther('400000'))).wait();
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
