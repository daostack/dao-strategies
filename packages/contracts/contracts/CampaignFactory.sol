//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Campaign.sol";

contract CampaignFactory {
    Campaign private master;

    event CampaignCreated(
        address creator,
        address newCampaign,
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        bytes32 salt
    );

    constructor(address payable _master) {
        master = Campaign(_master);
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
        uint256 _challengePeriod,
        bytes32 salt
    ) external {
        address payable proxy = payable(Clones.cloneDeterministic(address(master), salt));
        Campaign(proxy).initCampaign(_sharesMerkleRoot, _strategyUri, _guardian, _oracle, _challengePeriod);

        emit CampaignCreated(msg.sender, proxy, _sharesMerkleRoot, _sharesUri, _strategyUri, _guardian, _oracle, salt);
    }
}
