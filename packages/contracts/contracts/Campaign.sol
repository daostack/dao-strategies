// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title Campaign
 */
abstract contract Campaign is Initializable {
    uint256 public constant totalShares = 10**18;

    bytes32 public sharesMerkleRoot;
    bytes32 public uri;
    address public guardian;
    address public oracle;
    uint256 public claimPeriodStart;
    uint256 public totalClaimed;
    uint256 public totalReward;
    bool public campaignCancelled;
    bool public sharesPublished;

    mapping(address => uint256) public claimed;
    mapping(address => uint256) public funds;

    error InvalidProof();
    error NoRewardAvailable();
    error RewardTransferFailed();
    error OnlyGuardian();
    error OnlyDuringEvaluationPeriod();
    error WithdrawalNotAllowed();
    error ClaimingNotAllowed();
    error WithdrawTransferFailed();
    error NoFunds();
    error SharesAlreadyPublished();
    error OnlyOracle();

    modifier onlyGuardian() {
        if (msg.sender != guardian) {
            revert OnlyGuardian();
        }
        _;
    }

    modifier onlyOracle() {
        if (msg.sender != oracle) {
            revert OnlyOracle();
        }
        _;
    }

    function initCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _uri,
        address _guardian,
        address _oracle,
        bool _sharesPublished,
        uint256 _claimPeriodStart
    ) public initializer {
        sharesMerkleRoot = _sharesMerkleRoot;
        uri = _uri;
        guardian = _guardian;
        oracle = _oracle;
        sharesPublished = _sharesPublished;
        claimPeriodStart = _claimPeriodStart;
    }

    function publishShares(bytes32 _sharesMerkleRoot) external onlyOracle {
        if (sharesPublished) {
            revert SharesAlreadyPublished();
        }
        sharesPublished = true;
        sharesMerkleRoot = _sharesMerkleRoot;
    }

    function claim(
        address account,
        uint256 share,
        bytes32[] calldata proof
    ) external {
        if (!claimAllowed()) {
            revert ClaimingNotAllowed();
        }
        bytes32 leaf = keccak256(abi.encodePacked(account, share));
        if (MerkleProof.verify(proof, sharesMerkleRoot, leaf) == false) {
            revert InvalidProof();
        }

        uint256 totalFundsReceived = totalReward + totalClaimed;
        uint256 reward = (totalFundsReceived * share) / totalShares - claimed[account];
        if (reward == 0) {
            revert NoRewardAvailable();
        }
        claimed[account] += reward;
        totalClaimed += reward;
        totalReward -= reward;

        bool success = transferValueOut(account, reward);

        if (!success) {
            revert RewardTransferFailed();
        }
    }

    function cancelCampaign() external onlyGuardian {
        if (block.timestamp > claimPeriodStart) {
            revert OnlyDuringEvaluationPeriod();
        }
        campaignCancelled = true;
    }

    receive() external payable {
        funds[msg.sender] += msg.value;
        totalReward += msg.value;
    }

    function withdrawFunds(address account) external {
        if (!withdrawAllowed()) {
            revert WithdrawalNotAllowed();
        }

        uint256 amount = funds[account];
        if (amount == 0) {
            revert NoFunds();
        }
        funds[account] = 0;

        bool success = transferValueOut(account, amount);

        if (!success) {
            revert WithdrawTransferFailed();
        }
    }

    function transferValueOut(address to, uint256 amount) internal virtual returns (bool);

    function withdrawAllowed() private view returns (bool) {
        return campaignCancelled || ((block.timestamp > claimPeriodStart) && !sharesPublished);
    }

    function claimAllowed() private view returns (bool) {
        return (block.timestamp > claimPeriodStart) && sharesPublished && !campaignCancelled;
    }
}
