// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./Campaign.sol";

/**
 * @title EthCampaign
 */
contract EthCampaign is Campaign {
    function transferValueOut(address to, uint256 amount) internal override returns (bool) {
        (bool success, ) = to.call{ value: amount }("");
        return success;
    }
}
