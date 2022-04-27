//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Campaign.sol";

contract CampaignFactory {
    Campaign private master;

    event CampaignCreated(
        address creator,
        address newCampaign,
        bytes32 _sharesRoot,
        uint256 _sharesTotal,
        bytes32 _uri,
        address _guardian,
        address _oracle,
        bool _sharesPublished,
        uint256 _claimPeriodStart,
        bytes32 salt
    );

    constructor(address payable _master) {
        master = Campaign(_master);
    }

    function createCampaign(
        Campaign.SharesData memory _shares,
        bytes32 _uri,
        address _guardian,
        address _oracle,
        bool _sharesPublished,
        uint256 _claimPeriodStart,
        bytes32 salt
    ) external {
        address payable proxy = payable(Clones.cloneDeterministic(address(master), salt));
        Campaign(proxy).initCampaign(_shares, _uri, _guardian, _oracle, _sharesPublished, _claimPeriodStart);

        emit CampaignCreated(
            msg.sender,
            proxy,
            _shares.sharesMerkleRoot,
            _shares.totalShares,
            _uri,
            _guardian,
            _oracle,
            _sharesPublished,
            _claimPeriodStart,
            salt
        );
    }
}
