# Preparar entorno de desarrollo en VSCODE para Solidity

- Instalar truffle globalmente
- Instalar Ganache
- Escribir en la carpeta del proyecto por consola

> truffle unbox metacoin

- Configurar en migrations el archivo a compilar
- **1_deploy_contracts.js**

~~~js
const simpleStorage = artifacts.require("SimpleStorage") //El contract es SimpleStorage.sol

module.exports = function(deployer){
    deployer.deploy(simpleStorage)
}
~~~

- Configurar **truffle-config.js** con la red y id de Ganache y la versión de compilación ( que debe coincidir con la descrita en el smart contract)
- Usar **versión 0.8.19** para que no de problemas

~~~js
module.exports ={
    networks:{
        host:"127.0.0.1",
        port:"7545",
        network_id:"*"
    },
    compilers:{
        solc:{
            version: "0.8.19" //Usar esta versión para evitar problemas con el deploy y PUSH a partir de 0.8.20
        }
    }
}
~~~

- Usar en consola **truffle compile**
- Para ejecutarlo usar **truffle deploy**

- Contrato de prueba

~~~solidity


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


    function addPerson(string memory _name, uint256 _favoriteNum) public{
        people.push(People(_name, _favoriteNum)); //no necesita memory
        nameToFavoriteNum[_name] = _favoriteNum; //asigno números al nombre dado en un mapping
    }  
}
~~~

## NOTA: usar migrate

- Configurar así en truffle-config.js

~~~js
module.exports ={
    networks:{
        development:{
            host:"127.0.0.1",
            port:"7545",
            network_id:"*"
        }        
    },
    compilers:{
        solc:{
            version: "0.8.19"
        }
    }
}
~~~

- Iniciar Ganache con

> ganache 

- El puerto está escuchando
- Para compilar y vincular la red Usar este comando
  
> truffle compile
> truffle migrate --network development  

- Para acceder a la blockchain debemos crear una variable entrando en la consola de truffle usando **el nombre del contratro con .deployed()**

> truffle console
> storage = await SimpleStorage.deployed()
  
- Con esta variable puedo disparar las funciones publicas del contrato

> storage.nombreFuncion(params)
