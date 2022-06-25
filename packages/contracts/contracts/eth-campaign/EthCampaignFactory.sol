//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./EthCampaign.sol";

contract EthCampaignFactory {
    EthCampaign private master;

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
        master = EthCampaign(_master);
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
        bytes32 salt
    ) external {
        address payable proxy = payable(Clones.cloneDeterministic(address(master), salt));
        EthCampaign(proxy).initEthCampaign(_sharesMerkleRoot, _strategyUri, _guardian, _oracle);

        emit CampaignCreated(msg.sender, proxy, _sharesMerkleRoot, _sharesUri, _strategyUri, _guardian, _oracle, salt);
    }
}
