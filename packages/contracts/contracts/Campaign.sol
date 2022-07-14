// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Campaign
 */
contract Campaign is Initializable {
    using SafeERC20 for IERC20;

    /** Shares are considered a ratio [0-1] with 18 digits where 1E18 = 1 */
    uint256 public constant TOTAL_SHARES = 10**18;
    uint256 public constant CHALLENGE_PERIOD = 604800;

    enum ChallengeAction {
        CancelPending,
        CacncelPendingAndLockCurrent,
        CancelCampaign
    }

    bytes32 public approvedMerkleRoot;

    /** Optimistic flow used to update merkleRoot.
     * - Oracle propose update and Guardian can block
     * - Guardian cannot initiate an update */
    bytes32 public pendingMerkleRoot;
    uint256 public activationTime;

    bytes32 public strategyUri;
    address public guardian;
    address public oracle;

    /** Counters of the total amount of funds provided by all providers
     * and claimed by all claimers */
    mapping(address => uint256) public totalReward;
    mapping(address => uint256) public totalClaimed;

    /** Once locked, the merkleRoot cannot be updated anymore.
     * Once locked, it cannot be un-locked  */
    bool public locked;

    mapping(address => mapping(address => uint256)) public claimed;
    mapping(address => mapping(address => uint256)) public providers;

    event Fund(address provider, uint256 amount, address asset);
    event SharesMerkleRoot(bytes32 sharesMerkleRoot, bytes32 sharesUri, uint256 activationTime);
    event Claim(address account, uint256 share, uint256 reward, address assset);
    event Challenge(ChallengeAction action);
    event Withdraw(address account, uint256 amount, address asset);

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

    /** called at deploy (using the campaign factory). It may or may not
     * include a non-zero merkleRoot */
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

    function _fund(
        uint256 amount,
        address asset,
        address from
    ) internal {
        /** Not sure if this assigmations should be done after the funds where received. JIC */
        providers[asset][from] += amount;
        totalReward[asset] += amount;
        if (asset != address(0)) {
            IERC20(asset).safeTransferFrom(from, address(this), amount);
        }
        emit Fund(from, amount, address(asset));
    }

    receive() external payable {
        _fund(msg.value, address(0), msg.sender);
    }

    /** Fund campaign with ETH or any ERC20 token */
    function fund(address asset, uint256 amount) public payable {
        if (asset == address(0)) {
            _fund(msg.value, asset, msg.sender);
        } else {
            _fund(amount, asset, msg.sender);
        }
    }

    function balanceOfAsset(address asset) public view returns (uint256) {
        return asset == address(0) ? address(this).balance : IERC20(asset).balanceOf(address(this));
    }

    function convertToReward(address asset) external {
        uint256 available = totalFundsReceived(asset) - balanceOfAsset(asset);
        _fund(available, asset, address(this));
    }

    function transferValueOut(
        address to,
        uint256 amount,
        address asset
    ) internal {
        if (asset == address(0)) {
            (bool success, ) = to.call{ value: amount }("");
            require(success, "ether transfer failed");
        } else {
            IERC20(asset).safeTransfer(to, amount);
        }
    }

    /** Only the oracle can propose new merkleRoot. The proposal is stored and becomes active only
     * after a CHALLENGE_PERIOD */
    function proposeShares(bytes32 _sharesMerkleRoot, bytes32 _sharesUri) external onlyOracle notLocked {
        if (pendingMerkleRoot != bytes32(0) && block.timestamp < activationTime) {
            revert ActiveChallengePeriod();
        }

        approvedMerkleRoot = pendingMerkleRoot;
        pendingMerkleRoot = _sharesMerkleRoot;
        activationTime = block.timestamp + CHALLENGE_PERIOD;

        emit SharesMerkleRoot(_sharesMerkleRoot, _sharesUri, activationTime);
    }

    /** Valid root is either the approved or pending one depending on the activation time */
    function getValidRoot() public view returns (bytes32 root) {
        return block.timestamp > activationTime ? pendingMerkleRoot : approvedMerkleRoot;
    }

    /** Total funds received by the contract */
    function totalFundsReceived(address asset) public view returns (uint256 total) {
        return totalReward[asset] + totalClaimed[asset];
    }

    /** Validates the shares of an account and computes the available rewards it */
    function rewardsAvailableToClaimer(
        address account,
        uint256 share,
        address asset
    ) public view returns (uint256 total) {
        /** Rewards by claimer are a portion of the total funds received. If new funds are received, new rewards will become available */
        return (totalFundsReceived(asset) * share) / TOTAL_SHARES - claimed[asset][account];
    }

    function verifyShares(
        address account,
        uint256 share,
        bytes32[] calldata proof
    ) public view {
        bytes32 claimingMerkleRoot = getValidRoot();

        bytes32 leaf = keccak256(abi.encodePacked(account, share));
        if (MerkleProof.verify(proof, claimingMerkleRoot, leaf) == false) {
            revert InvalidProof();
        }
    }

    /** Claiming is always enabled (effectively possible only when a non-zero approved merkleRoot is set) proportional */
    function claim(
        address account,
        uint256 share,
        bytes32[] calldata proof,
        address asset
    ) external {
        verifyShares(account, share, proof);
        uint256 reward = rewardsAvailableToClaimer(account, share, asset);

        if (reward == 0) {
            revert NoRewardAvailable();
        }
        claimed[asset][account] += reward;
        totalClaimed[asset] += reward;
        totalReward[asset] -= reward;

        transferValueOut(account, reward, asset);

        emit Claim(account, share, reward, asset);
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

    function withdrawFunds(address account, address asset) external {
        if (locked && approvedMerkleRoot == bytes32(0)) {
            uint256 amount = providers[asset][account] / totalReward[asset];
            if (amount == 0) {
                revert NoFunds();
            }
            providers[asset][account] = 0;

            transferValueOut(account, amount, asset);

            emit Withdraw(account, amount, asset);
        } else {
            revert WithdrawalNotAllowed();
        }
    }
}
