// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title Campaign
 */
contract Campaign {
    struct SharesData {
        uint256 totalShares;
        bytes32 sharesMerkleRoot;
    }

    SharesData public shares;
    bytes32 public uri;
    address public guardian;
    address public oracle;
    uint256 public evaluationPeriodEnd;
    uint256 public totalClaimed;
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

    constructor(
        SharesData memory _shares,
        bytes32 _uri,
        address _guardian,
        address _oracle,
        bool _sharesPublished,
        uint256 _evaluationPeriodEnd
    ) {
        shares = _shares;
        uri = _uri;
        guardian = _guardian;
        oracle = _oracle;
        sharesPublished = _sharesPublished;
        evaluationPeriodEnd = _evaluationPeriodEnd;
    }

    function publishShares(SharesData memory _shares) external onlyOracle {
        if (sharesPublished) {
            revert SharesAlreadyPublished();
        }
        sharesPublished = true;
        shares = _shares;
    }

    function claim(
        address account,
        uint256 share,
        bytes32[] calldata proof
    ) external {
        bytes32 leaf = keccak256(abi.encodePacked(account, share));
        if (MerkleProof.verify(proof, shares.sharesMerkleRoot, leaf) == false) {
            revert InvalidProof();
        }

        uint256 totalFundsReceived = address(this).balance + totalClaimed;
        uint256 reward = (totalFundsReceived * share) / shares.totalShares - claimed[account];
        if (reward == 0) {
            revert NoRewardAvailable();
        }
        claimed[account] += reward;
        totalClaimed += reward;

        (bool success, ) = account.call{ value: reward }("");
        if (!success) {
            revert RewardTransferFailed();
        }
    }

    function cancelCampaign() external onlyGuardian {
        if (block.timestamp > evaluationPeriodEnd) {
            revert OnlyDuringEvaluationPeriod();
        }
        campaignCancelled = true;
    }

    receive() external payable {
        funds[msg.sender] += msg.value;
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

        (bool success, ) = account.call{ value: amount }("");
        if (!success) {
            revert WithdrawTransferFailed();
        }
    }

    function withdrawAllowed() private view returns (bool) {
        return campaignCancelled || (block.timestamp > evaluationPeriodEnd && !sharesPublished);
    }
}
