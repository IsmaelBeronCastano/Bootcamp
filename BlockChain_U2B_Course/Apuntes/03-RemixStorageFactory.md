# 03 SOLIDITY 


- Partimos del contrato SimpleStorage

~~~js
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SimpleStorage{
    //Types: boolean, uint (siempre positivo), int (positivo o negativo), address, string, bytes

    uint256 favoriteNum;

    struct People {
    string name;
    uint256 favoriteNum;
    }

    mapping(string=>uint256) public nameToFavoriteNum;

    People[] public people;      //Puedo especificar el num de elementos con People[n]  


    function retrieve() public view returns(uint256){
        return favoriteNum;
  }
  
  function getPeople() external view returns(People[] memory){
    return people;
}

    function store(uint256 _favoriteNum)public {
        favoriteNum = _favoriteNum;
    }



    function addPerson(string memory _name, uint256 _favoriteNum) public{
        people.push(People(_name, _favoriteNum)); //no necesita memory
        nameToFavoriteNum[_name] = _favoriteNum; //asigno números al nombre dado en un mapping
    }  
}
~~~

- Podemos importar otros contratos dentro de los contratos
- Creo un nuevo contrato

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './SimpleStorage.sol';

contract StorageFactory{

    SimpleStorage public simpleStorage;

    function createSimpleStorageContract() public{
        simpleStorage = new SimpleStorage();
    }
}
~~~

- Uso la misma estrategia con .push para crear un array de contratos de SimpleStorage

~~~js
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
}
~~~

- Para interactuar con otros contratos vas a necesitar **la dirección del contrato y el ABI**
  - ABI es **Application Binary Interface**
  - Describe los **inputs y outputs** y todo lo que puedes hacer con el smart contract
  - Realizando una importación automáticamente obtienes un ABI, pero hay otras maneras de obtenerlo
  - En REMIX, en Compilation Details puedes encontrar el ABI muy sencillas

~~~solidity
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
~~~

- La función se puede simplificar así

~~~solidity
 function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public{
       simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
}

  function sfGet(uint256 _simpleStorageIndex)public view returns(uint256){
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
~~~
-----

## Inheritance and Overrides

- Para sobreescribir el método store en otro smart contract podemos usar la herencia
- ExtraStorage.sol

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{

}
~~~

- Para hacer una función sobreescribible hay que añadirle la palabra virtual en la función del padre

~~~solidity
 function store(uint256 _favoriteNum) public virtual{
        favoriteNum = _favoriteNum;
    }
~~~

- En la función que sobreescribe debo añadir override

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{

    function store(uint256 _favoriteNum) public override{
        favoriteNum = _favoriteNum + 5;
    }
}
~~~
----


