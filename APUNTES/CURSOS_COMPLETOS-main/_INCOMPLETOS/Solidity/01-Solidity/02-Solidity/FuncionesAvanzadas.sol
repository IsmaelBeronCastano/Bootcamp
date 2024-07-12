//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract Food{

    // Estructura de datos

    struct dinnerPlate{
        string name;
        string ingredients;
    }

    dinnerPlate [] menu;

    // Nuevo menú
    function newMenu( string memory _name, string memory _ingredients) internal {
        menu.push(dinnerPlate(_name, _ingredients));
    }   
}

contract Burguer is Food{

    address public owner;

    constructor(){
        owner = msg.sender;
    }

    //Cocinar hamburguesa desde el smart contract principal

    function doBurguer(string memory _ingredients, uint _units) external{
        require(_units <= 5, "Ups, no puedes pedir tantas hamburguesas");

        newMenu("Burguer", _ingredients);
    }

    // Modifier: permitir el acceso unicamente al owner
    modifier onlyOwner() {
        require(owner == msg.sender, "No tienes permisos para ejecutar esta funcion");
        _;
    }

    //Solo puede el owner
    function hashPrivateNumber(uint _number) public view onlyOwner returns (bytes32){
        return keccak256(abi.encodePacked(_number));
    }
}
