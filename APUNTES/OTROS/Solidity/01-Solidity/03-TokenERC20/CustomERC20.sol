//SPDX-License_Identifier: MIT

import "./ERC20.sol";

pragma solidity ^0.8.4;

contract customERC20 is ERC20{
    constructor()ERC20("Migue", "MG"){}

    function createTokens()public{
        _mint(msg.sender, 1000);
    }
}