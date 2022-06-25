//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./erc20-campaign/Erc20Campaign.sol";
import "./eth-campaign/EthCampaign.sol";

contract CampaignFactory {
    Erc20Campaign private masterErc20;
    EthCampaign private masterEth;

    event Erc20CampaignCreated(
        address creator,
        address newCampaign,
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        IERC20 _rewardToken,
        bytes32 salt
    );

    event EthCampaignCreated(
        address creator,
        address newCampaign,
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        bytes32 salt
    );

    constructor(address payable _masterErc20, address payable _masterEth) {
        masterErc20 = Erc20Campaign(_masterErc20);
        masterEth = EthCampaign(_masterEth);
    }

    function ethCampaignAddress(bytes32 salt) public view returns (address) {
        return campaignAddress(address(masterEth), salt);
    }

    function erc20CampaignAddress(bytes32 salt) public view returns (address) {
        return campaignAddress(address(masterErc20), salt);
    }

    function campaignAddress(address master, bytes32 salt) public view returns (address) {
        return Clones.predictDeterministicAddress(address(master), salt);
    }

    function createErc20Campaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        bytes32 salt,
        IERC20 _rewardToken
    ) external {
        address payable proxy = payable(Clones.cloneDeterministic(address(masterErc20), salt));
        Erc20Campaign(proxy).initErc20Campaign(_sharesMerkleRoot, _strategyUri, _guardian, _oracle, _rewardToken);

        emit Erc20CampaignCreated(msg.sender, proxy, _sharesMerkleRoot, _sharesUri, _strategyUri, _guardian, _oracle, _rewardToken, salt);
    }

    function createEthCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        bytes32 salt
    ) external {
        address payable proxy = payable(Clones.cloneDeterministic(address(masterEth), salt));
        EthCampaign(proxy).initEthCampaign(_sharesMerkleRoot, _strategyUri, _guardian, _oracle);

        emit EthCampaignCreated(msg.sender, proxy, _sharesMerkleRoot, _sharesUri, _strategyUri, _guardian, _oracle, salt);
    }
}
