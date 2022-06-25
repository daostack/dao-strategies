// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestErc20 is ERC20 {
    constructor(uint256 supply, address owner) ERC20("Test", "tst") {
        _mint(owner, supply);
    }
}
