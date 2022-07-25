//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Campaign.sol";

contract CampaignFactory {
    Campaign private master;

    event CampaignCreated(address creator, address newCampaign, bytes32 _strategyUri, address _guardian, address _oracle, uint256 activationTime, bytes32 salt);

    constructor(address payable _master) {
        master = Campaign(_master);
    }

    function campaignAddress(bytes32 salt) public view returns (address) {
        return Clones.predictDeterministicAddress(address(master), salt);
    }

    function createCampaign(
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        uint256 _activationTime,
        uint256 _CHALLENGE_PERIOD,
        uint256 _ACTIVATION_PERIOD,
        uint256 _ACTIVE_DURATION,
        bytes32 salt
    ) external returns (address payable proxy) {
        proxy = payable(Clones.cloneDeterministic(address(master), salt));
        Campaign(proxy).initCampaign(_strategyUri, _guardian, _oracle, _activationTime, _CHALLENGE_PERIOD, _ACTIVATION_PERIOD, _ACTIVE_DURATION);

        emit CampaignCreated(msg.sender, proxy, _strategyUri, _guardian, _oracle, _activationTime, salt);

        return proxy;
    }

    function createAndPublishCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        uint256 _activationTime,
        uint256 _CHALLENGE_PERIOD,
        uint256 _ACTIVATION_PERIOD,
        uint256 _ACTIVE_DURATION,
        bytes32 salt
    ) external {
        address payable proxy = this.createCampaign(
            _strategyUri,
            _guardian,
            _oracle,
            _activationTime,
            _CHALLENGE_PERIOD,
            _ACTIVATION_PERIOD,
            _ACTIVE_DURATION,
            salt
        );
        Campaign(proxy).proposeShares(_sharesMerkleRoot, _sharesUri);
    }
}
