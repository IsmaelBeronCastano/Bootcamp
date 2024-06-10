//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract maths {
    
    function suma (uint a, uint b) public pure returns(uint){
     return a+ b;
    }

    function resta( uint a, uint b) public pure returns(uint){
        return a - b;
    }

    function _addmod( uint x, uint y, uint k) public pure returns(uint, uint){
        return (addmod(x,y,k), (x+y)%k);
    }
}