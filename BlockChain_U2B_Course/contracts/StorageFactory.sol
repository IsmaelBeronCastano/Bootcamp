//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './SimpleStorage.sol';

contract StorageFactory{

    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public{
       SimpleStorage simpleStorage = new SimpleStorage();
       simpleStorageArray.push(simpleStorage);
    }

    function getSimpleStorage() external view returns(SimpleStorage[] memory){
        return simpleStorageArray;
    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public{
        //Address 
        //ABI
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex]; //obtengo la dirección, en el ABI estaba en la posición 0
        simpleStorage.store(_simpleStorageNumber); //Con la dirección puedo usar las funciones públicas del contrato
    }
                                                        //view porque solo lee
    function sfGet(uint256 _simpleStorageIndex)public view returns(uint256){
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex]; //obtengo la dirección, en el ABI estaba en la posición 0
        return simpleStorage.retrieve();
    }
}

