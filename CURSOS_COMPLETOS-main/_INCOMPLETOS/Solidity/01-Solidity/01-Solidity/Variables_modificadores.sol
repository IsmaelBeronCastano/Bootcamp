// SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract variables_modifiers {
    
    uint a;
    uint8 b = 3;

    int256 c;
    int8 public d = -32;

    string str;
    string public str_public = "Esto es publico";

    bool public boolean_true = true;

    bytes1 first_byte;
    bytes21 second_bytes;

    bytes32 public hashing_keccak256 = keccak256(abi.encodePacked("Hola", "soy Miguel"));

    bytes32 public hashing_sha256= sha256(abi.encodePacked("Hola"));

    bytes20 public hashing_ripemd160 = ripemd160(abi.encodePacked("Hola"));

    address public address1= msg.sender;

    enum options {ON,OFF}

    options state;

    options constant defaultChoice = options.OFF;

    function turnOn() public {
        state = options.ON;
    }

    function turnOff() public {
        state= options.OFF;
     }

     function displayState() public view returns (options){
        return state;
     }



}