// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title Campaign
 */
abstract contract Campaign is Initializable {
    uint256 public constant TOTAL_SHARES = 10**18;
    uint256 public constant CHALLENGE_PERIOD = 604800;

    struct SharesData {
        bytes32 sharesMerkleRoot;
        bytes32 sharesUri;
        uint256 activationTime;
    }

    uint256 currentSharesId;
    mapping(uint256 => SharesData) public shares;

    bytes32 public strategyUri;
    address public guardian;
    address public oracle;

    uint256 public totalClaimed;
    uint256 public totalReward;

    bool public locked;

    mapping(address => uint256) public claimed;
    mapping(address => uint256) public providers;

    error InvalidProof();
    error ActiveChallengePeriod();
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
        bytes32 _sharesUri,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle
    ) public initializer {
        currentSharesId += 1;
        SharesData storage newShares = shares[currentSharesId];
        newShares.sharesMerkleRoot = _sharesMerkleRoot;
        newShares.sharesUri = _sharesUri;
        newShares.activationTime = block.timestamp + CHALLENGE_PERIOD;

        strategyUri = _strategyUri;
        guardian = _guardian;
        oracle = _oracle;
    }

    function initCampaign(
        bytes32 _strategyUri,
        address _guardian,
        address _oracle
    ) public initializer {
        strategyUri = _strategyUri;
        guardian = _guardian;
        oracle = _oracle;
    }

    function updateShares(bytes32 _sharesMerkleRoot, bytes32 _sharesUri) external onlyOracle {
        if (block.timestamp < shares[currentSharesId].activationTime) {
            revert ActiveChallengePeriod();
        }

        currentSharesId += 1;
        SharesData storage newShares = shares[currentSharesId];
        newShares.sharesMerkleRoot = _sharesMerkleRoot;
        newShares.sharesUri = _sharesUri;
        newShares.activationTime = block.timestamp + CHALLENGE_PERIOD;
    }

    function claim(
        address account,
        uint256 share,
        bytes32[] calldata proof
    ) external {
        if (currentSharesId == 0) {
            revert ClaimingNotAllowed();
        }

        bytes32 claimingMerkleRoot;
        if (block.timestamp > shares[currentSharesId].activationTime) {
            claimingMerkleRoot = shares[currentSharesId].sharesMerkleRoot;
        } else if (currentSharesId != 1 && block.timestamp > shares[currentSharesId - 1].activationTime) {
            claimingMerkleRoot = shares[currentSharesId - 1].sharesMerkleRoot;
        } else {
            revert ClaimingNotAllowed();
        }

        bytes32 leaf = keccak256(abi.encodePacked(account, share));
        if (MerkleProof.verify(proof, claimingMerkleRoot, leaf) == false) {
            revert InvalidProof();
        }

        uint256 totalFundsReceived = totalReward + totalClaimed;
        uint256 reward = (totalFundsReceived * share) / TOTAL_SHARES - claimed[account];
        if (reward == 0) {
            revert NoRewardAvailable();
        }
        claimed[account] += reward;
        totalClaimed += reward;
        totalReward -= reward;

        transferValueOut(account, reward);
    }

    function challenge() external onlyGuardian {
        if (currentSharesId == 0) {
            locked = true;
        }
        if (block.timestamp < shares[currentSharesId].activationTime) {
            currentSharesId -= 1;
            locked = true;
        }
    }

    function withdrawFunds(address account) external {
        if (locked && currentSharesId == 0) {
            uint256 amount = providers[account] / totalReward;
            if (amount == 0) {
                revert NoFunds();
            }
            providers[account] = 0;

            transferValueOut(account, amount);
        } else {
            revert WithdrawalNotAllowed();
        }
    }

    /**
    @dev recerts on failure
     */
    function transferValueOut(address to, uint256 amount) internal virtual;
}
