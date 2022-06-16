//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Erc20Campaign.sol";

contract Erc20CampaignFactory {
    Erc20Campaign private master;

    event CampaignCreated(
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

    constructor(address payable _master) {
        master = Erc20Campaign(_master);
    }

    function campaignAddress(bytes32 salt) public view returns (address) {
        return Clones.predictDeterministicAddress(address(master), salt);
    }

    function createCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        bytes32 salt,
        IERC20 _rewardToken
    ) external {
        address payable proxy = payable(Clones.cloneDeterministic(address(master), salt));
        Erc20Campaign(proxy).initErc20Campaign(_sharesMerkleRoot, _strategyUri, _guardian, _oracle, _rewardToken);

        emit CampaignCreated(msg.sender, proxy, _sharesMerkleRoot, _sharesUri, _strategyUri, _guardian, _oracle, _rewardToken, salt);
    }
}
