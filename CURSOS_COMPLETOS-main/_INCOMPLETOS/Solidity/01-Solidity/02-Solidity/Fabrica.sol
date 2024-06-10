//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract padre{

    //Almacenamiento de la info del Factory

    mapping(address => address) personal_contract;

    function Factory() public {
        address addr_personal_contract = address(new hijo(msg.sender, address(this)));

        personal_contract[msg.sender] = addr_personal_contract;
    }


}

contract hijo{

    Owner public propietario;

    struct Owner{
        address _owner;
        address _smartContractPadre;
    }

    constructor( address _account, address _accountSC){
        propietario._owner = _account;
        propietario._smartContractPadre = _accountSC;
    }
}