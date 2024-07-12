//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

import  "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract FirstContract is ERC721{

    // Direccion de la persona que despliega el contrato
    address public owner;


    //almacenamos en la variable owner la dirección de la persona que despliega el contrato
    constructor(string memory _name, string memory _symbol )ERC721(_name, _symbol){
        owner = msg.sender;

    }
}
