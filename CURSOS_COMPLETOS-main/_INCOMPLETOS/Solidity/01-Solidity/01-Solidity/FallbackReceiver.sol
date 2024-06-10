//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract Fallback_Receive{

    event log( string, address, uint, bytes);

    fallback() external payable {
        emit log("fallback", msg.sender, msg.value, msg.data);
    }

    receive() external payable {
        emit log("receive", msg.sender, msg.value, "");
    }
}