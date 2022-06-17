// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../abstract/Campaign.sol";

/**
 * @title EthCampaign
 */
contract EthCampaign is Campaign {
    event ValueIn(address provider, uint256 amount);

    function initEthCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle
    ) public initializer {
        super.initCampaign(_sharesMerkleRoot, _strategyUri, _guardian, _oracle);
    }

    receive() external payable {
        providers[msg.sender] += msg.value;
        totalReward += msg.value;

        emit ValueIn(msg.sender, msg.value);
    }

    function transferValueOut(address to, uint256 amount) internal override {
        (bool success, ) = to.call{ value: amount }("");
        require(success, "ether transfer failed");
    }
}
