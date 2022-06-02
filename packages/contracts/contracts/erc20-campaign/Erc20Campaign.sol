// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../abstract/Campaign.sol";

/**
 * @title Erc20Campaign
 */
contract Erc20Campaign is Campaign {
    using SafeERC20 for IERC20;
    IERC20 public rewardToken;

    function initErc20Campaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _uri,
        address _guardian,
        address _oracle,
        bool _sharesPublished,
        uint256 _claimPeriodStart,
        IERC20 _rewardToken
    ) public {
        super.initCampaign(_sharesMerkleRoot, _uri, _guardian, _oracle, _sharesPublished, _claimPeriodStart);
        rewardToken = _rewardToken;
    }

    function transferValueIn(uint256 amount) external {
        funds[msg.sender] += amount;
        totalReward += amount;
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function transferValueOut(address to, uint256 amount) internal override {
        rewardToken.safeTransfer(to, amount);
    }
}
