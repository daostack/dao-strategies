// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../abstract/Campaign.sol";

/**
 * @title EthCampaign
 */
contract EthCampaign is Campaign {
    function initEthCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _uri,
        address _guardian,
        address _oracle,
        bool _sharesPublished,
        uint256 _claimPeriodStart
    ) public initializer {
        super.initCampaign(_sharesMerkleRoot, _uri, _guardian, _oracle, _sharesPublished, _claimPeriodStart);
    }

    receive() external payable {
        funds[msg.sender] += msg.value;
        totalReward += msg.value;
    }

    function transferValueOut(address to, uint256 amount) internal override {
        (bool success, ) = to.call{ value: amount }("");
        require(success, "ether transfer failed");
    }
}