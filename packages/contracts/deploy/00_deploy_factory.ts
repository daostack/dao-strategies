import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  //const campaign = await deploy('Campaign', {
  //  // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //  from: deployer,
  //  args: [],
  //  log: true,
  //});
  //
  //await deploy('CampaignFactory', {
  //  // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //  from: deployer,
  //  args: [campaign.address],
  //  log: true,
  //});
};

export default func;
func.tags = ['Campaign'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
