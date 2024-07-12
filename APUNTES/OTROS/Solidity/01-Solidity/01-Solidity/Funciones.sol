// SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract Functions{


    function getName() public pure returns(string memory){

        return "Migue";
    }

    uint256 x= 100;

    function getNumber() public view returns(uint256){
        return x*2;
    } 

    

}