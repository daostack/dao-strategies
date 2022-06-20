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

    enum ChallengeAction {
        CancelPending,
        CacncelPendingAndLockCurrent,
        CancelCampaign
    }

    bytes32 public approvedMerkleRoot;

    bytes32 public pendingMerkleRoot;
    uint256 public activationTime;

    bytes32 public strategyUri;
    address public guardian;
    address public oracle;

    uint256 public totalClaimed;
    uint256 public totalReward;

    bool public locked;

    mapping(address => uint256) public claimed;
    mapping(address => uint256) public providers;

    event SharesMerkleRoot(bytes32 sharesMerkleRoot, bytes32 sharesUri, uint256 activationTime);
    event Claim(address account, uint256 share, uint256 reward);
    event Challenge(ChallengeAction action);
    event Withdraw(address account, uint256 amount);

    error InvalidProof();
    error ActiveChallengePeriod();
    error NoRewardAvailable();
    error OnlyGuardian();
    error WithdrawalNotAllowed();
    error ClaimingNotAllowed();
    error NoFunds();
    error OnlyOracle();
    error Locked();
    error OnlyInChallengePeriod();

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

    modifier notLocked() {
        if (locked) {
            revert Locked();
        }
        _;
    }

    function initCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle
    ) public initializer {
        strategyUri = _strategyUri;
        guardian = _guardian;
        oracle = _oracle;

        if (_sharesMerkleRoot != bytes32(0)) {
            pendingMerkleRoot = _sharesMerkleRoot;
            activationTime = block.timestamp + CHALLENGE_PERIOD;
        } else {
            activationTime = type(uint256).max;
        }
    }

    function proposeShares(bytes32 _sharesMerkleRoot, bytes32 _sharesUri) external onlyOracle notLocked {
        if (pendingMerkleRoot != bytes32(0) && block.timestamp < activationTime) {
            revert ActiveChallengePeriod();
        }

        approvedMerkleRoot = pendingMerkleRoot;
        pendingMerkleRoot = _sharesMerkleRoot;
        activationTime = block.timestamp + CHALLENGE_PERIOD;

        emit SharesMerkleRoot(_sharesMerkleRoot, _sharesUri, activationTime);
    }

    function claim(
        address account,
        uint256 share,
        bytes32[] calldata proof
    ) external {
        bytes32 claimingMerkleRoot = block.timestamp > activationTime ? pendingMerkleRoot : approvedMerkleRoot;

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

        emit Claim(account, share, reward);
    }

    function setLock(bool _lock) external onlyGuardian {
        locked = _lock;
    }

    function challenge(ChallengeAction action) external onlyGuardian notLocked {
        if (pendingMerkleRoot != bytes32(0) && block.timestamp > activationTime) {
            revert OnlyInChallengePeriod();
        }

        pendingMerkleRoot = bytes32(0);
        activationTime = type(uint256).max;
        if (action == ChallengeAction.CacncelPendingAndLockCurrent) {
            this.setLock(true);
        } else if (action == ChallengeAction.CancelCampaign) {
            this.setLock(true);
            approvedMerkleRoot = bytes32(0);
        }

        emit Challenge(action);
    }

    function withdrawFunds(address account) external {
        if (locked && approvedMerkleRoot == bytes32(0)) {
            uint256 amount = providers[account] / totalReward;
            if (amount == 0) {
                revert NoFunds();
            }
            providers[account] = 0;

            transferValueOut(account, amount);

            emit Withdraw(account, amount);
        } else {
            revert WithdrawalNotAllowed();
        }
    }

    /**
    @dev recerts on failure
     */
    function transferValueOut(address to, uint256 amount) internal virtual;
}
