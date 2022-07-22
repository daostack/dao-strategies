// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

/**
 * @title Campaign
 */
contract Campaign is Initializable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /** Shares are considered a ratio [0-1] with 18 digits where 1E18 = 1 */
    uint256 public constant TOTAL_SHARES = 10**18;
    uint256 public constant CHALLENGE_PERIOD = 604800; // 1 week
    uint256 public constant SECONDS_IN_DAY = 86400;
    uint256 public constant DAYS_IN_WEEK = 7;

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

    /** Uri pointing to the campaign's reward strategy */
    bytes32 public strategyUri;

    address public guardian;
    address public oracle;
    uint256 public challengePeriod;

    /** amount of total assets already claimed per asset address (zero address represents the native token) */
    mapping(address => uint256) public totalClaimed;
    /** amount of assets already claimed per claimer address, per asset address (zero address represents the native token) */
    mapping(address => mapping(address => uint256)) public claimed;

    /** Once locked, the merkleRoot cannot be updated anymore.
     * Once locked, it cannot be un-locked  */
    bool public locked;

    /** amount of rewards provided per address of provider, per asset address (zero address represents the native token) */
    mapping(address => mapping(address => uint256)) public providers;

    event Fund(address indexed provider, uint256 amount, address asset);
    event SharesMerkleRootUpdate(bytes32 sharesMerkleRoot, bytes32 sharesUri, uint256 activationTime);
    event Claim(address indexed account, uint256 share, uint256 reward, address assset);
    event Challenge(ChallengeAction action);
    event Withdraw(address indexed account, uint256 amount, address asset);
    event Lock(bool locked);

    error InvalidProof();
    error MerkleRootUpdateNotAllowed();
    error NoRewardAvailable();
    error OnlyGuardian();
    error WithdrawalNotAllowed();
    error NoAssetsToWithdraw();
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

    /***************
    EXTERNAL FUNCTIONS
    ***************/

    /** Campaign initialization, called once at deploy (using the campaign factory).
     * If shares distribution is known at creation, _sharesMerkleRoot will be non-zero, _activationTime is ignored
     * Otherwise, _sharesMerkleRoot will be zero, _activationTime will be set according to the time in which the shares distribution will be calculated */
    function initCampaign(
        bytes32 _sharesMerkleRoot,
        bytes32 _strategyUri,
        address _guardian,
        address _oracle,
        uint256 _activationTime
    ) external initializer {
        strategyUri = _strategyUri;
        guardian = _guardian;
        oracle = _oracle;

        if (_sharesMerkleRoot != bytes32(0)) {
            pendingMerkleRoot = _sharesMerkleRoot;
            activationTime = block.timestamp + challengePeriod;
        } else {
            activationTime = _activationTime;
        }
    }

    /** Fund campaign with native or any ERC20 token.
     * For native token, asset is the zero address.  */
    function fund(address asset, uint256 amount) external payable nonReentrant {
        if (asset == address(0)) {
            _fund(msg.value, asset, msg.sender);
        } else {
            _fund(amount, asset, msg.sender);
        }
    }

    /** Only the oracle can propose new merkleRoot. The proposal is stored and becomes active only
     * after a CHALLENGE_PERIOD */
    function proposeShares(bytes32 _sharesMerkleRoot, bytes32 _sharesUri) external onlyOracle notLocked {
        if (!merkleRootUpdateAllowed()) {
            revert MerkleRootUpdateNotAllowed();
        }

        approvedMerkleRoot = pendingMerkleRoot;
        pendingMerkleRoot = _sharesMerkleRoot;
        activationTime = block.timestamp + challengePeriod;

        emit SharesMerkleRootUpdate(_sharesMerkleRoot, _sharesUri, activationTime);
    }

    /** External function to start claiming one ore more assets. Proof verification is only done here */
    function claim(
        address account,
        uint256 share,
        bytes32[] calldata proof,
        address[] calldata assets
    ) external {
        verifyShares(account, share, proof);

        for (uint8 ix = 0; ix < assets.length; ix++) {
            _claim(account, share, assets[ix]);
        }
    }

    /** Claiming is always enabled (effectively possible only when a non-zero approved merkleRoot is set) proportional */
    function _claim(
        address account,
        uint256 share,
        address asset
    ) private {
        uint256 reward = rewardsAvailableToClaimer(account, share, asset);

        claimed[asset][account] += reward;
        totalClaimed[asset] += reward;

        transferAssetOut(account, reward, asset);

        emit Claim(account, share, reward, asset);
    }

    /** Guardian can challenge, with 3 possible actions:
     * 1. Only cancel the pending merkle root, future updates are possible
     * 2. Cancel the pending merkle root and lock the campaign, disabling any future merkle root updates
     * 3. Cancel the whole campaign, claiming is not allowed and asset providers can withdraw back their assets */
    function challenge(ChallengeAction action) external onlyGuardian notLocked {
        if (!isChallengePeriod()) {
            revert OnlyInChallengePeriod();
        }

        pendingMerkleRoot = bytes32(0);
        if (action == ChallengeAction.CacncelPendingAndLockCurrent) {
            locked = true;
        } else if (action == ChallengeAction.CancelCampaign) {
            locked = true;
            approvedMerkleRoot = bytes32(0);
        }

        emit Challenge(action);
    }

    /** Guardian can lock the campaign, meaning disable future merkle root updates.
     * Locking a campaign with no merkle root is equivalent to canceling the campaign, allowing asset providers to withdraw */
    function setLock(bool _lock) external onlyGuardian {
        locked = _lock;
        emit Lock(_lock);
    }

    /** asset providers can withdraw their assets only in case the campaign was cancelled by the guardian */
    function withdrawAssets(address account, address asset) external {
        if (withdrawAllowed()) {
            uint256 amount = providers[asset][account];
            if (amount == 0) {
                revert NoAssetsToWithdraw();
            }
            providers[asset][account] = 0;

            transferAssetOut(account, amount, asset);

            emit Withdraw(account, amount, asset);
        } else {
            revert WithdrawalNotAllowed();
        }
    }

    receive() external payable {
        _fund(msg.value, address(0), msg.sender);
    }

    /***************
    VIEW FUNCTIONS
    ***************/

    /** Returns the currrent balance that the campaign holds for an asset.
     * For the native token, asset is the zero address*/
    function balanceOfAsset(address asset) public view returns (uint256) {
        return asset == address(0) ? address(this).balance : IERC20(asset).balanceOf(address(this));
    }

    /** Validates the shares of an account and computes the available rewards for it */
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

    /** Calculates the amount of available rewards to claim for an account */
    function rewardsAvailableToClaimer(
        address account,
        uint256 share,
        address asset
    ) public view returns (uint256 total) {
        /** Rewards by claimer are a portion of the total assets received. If new assets are received, new rewards will become available */
        return (totalReceived(asset) * share) / TOTAL_SHARES - claimed[asset][account];
    }

    /** Valid root is either the approved or pending one depending on the activation time */
    function getValidRoot() public view returns (bytes32 root) {
        return block.timestamp > activationTime ? pendingMerkleRoot : approvedMerkleRoot;
    }

    /** Total assets received by the contract.
     * For the native token, asset is the zero address*/
    function totalReceived(address asset) public view returns (uint256 total) {
        return balanceOfAsset(asset) + totalClaimed[asset];
    }

    /** Indicates whether the campaign is currently at a challenge period */
    function isChallengePeriod() public view returns (bool) {
        if (block.timestamp < activationTime) {
            return true;
        }
        return false;
    }

    /** Indicates whether updating the merkle root is currently possible.
     * updating the merkle root is allowed only at predefined time windows:
     * [activationTime, activationTime + 1 day], [activationTime + 1 week, activationTime + 1 week + 1 day]... and so on for every consecutive week */
    function merkleRootUpdateAllowed() public view returns (bool) {
        if (isChallengePeriod()) {
            console.log("Challenge Period!");
            return false;
        }
        if (((uint256(block.timestamp) - uint256(activationTime)) / uint256(SECONDS_IN_DAY)) % DAYS_IN_WEEK != 0) {
            return false;
        }
        return true;
    }

    /** Indicates whether withdrawal for providers is allowed */
    function withdrawAllowed() public view returns (bool) {
        if (locked && approvedMerkleRoot == bytes32(0) && pendingMerkleRoot == bytes32(0)) {
            return true;
        }
        return false;
    }

    /***************
    INTERNAL FUNCTIONS
    ***************/

    function _fund(
        uint256 amount,
        address asset,
        address from
    ) internal {
        providers[asset][from] += amount;
        if (asset != address(0)) {
            IERC20(asset).safeTransferFrom(from, address(this), amount);
        }
        emit Fund(from, amount, address(asset));
    }

    function transferAssetOut(
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
}
