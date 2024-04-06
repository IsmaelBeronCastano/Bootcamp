//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{

    function store(uint256 _favoriteNum) public override{
        favoriteNum = _favoriteNum + 5;
    }

}