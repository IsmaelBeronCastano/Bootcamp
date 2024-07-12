# Primeros pasos en Solidity

- Para programar estos Smart Contracts se necesita una licencia
- Se añade el comentario en la cabecera del archivo

> //SPDX-License_Identifier: MIT

- Se añade la versión del compilador

> pragma solidity ^0.8.4;

- Importo un smart contract de @openzeppelin para usar el token RC721.
- Se busca en Github. Para importarlo se usa la ruta de GitHub
- Le añado la versión en contracts@

> import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";

- Empiezo con la herencia en la declaración del Smart Contract, con el ERC721
- Establezco la dirección de la persona propietaria que despliega el contrato con la palabra reservada address 
- Le añado la palabra public para tener ese registro
- Para guardar la dirección voy a usar el constructor 
- En el momento que se despliega el SC se ejecuta lo que hay dentro del contructor
- Entonces, ¿Voy a necesitar usar parámetros? Si
- Si analizo el Smart Contract ERC721, veo que en el constructor me pide un nombre y un simbolo 
- Son parametros que voy a necesitar antes de interactuar con el contrato 
- Para captar el owner uso el msg.sender. Es una función interna que me da la dirección que está ejecutando la función
-  Quien hace el despliegue? El owner

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";


contract FirstContract is ERC721{

    // Direccion de la persona que despliega el contrato
    address public owner;


    //almacenamos en la variable owner la dirección de la persona que despliega el contrato

    constructor(string memory _name, string memory _symbol )ERC721(_name, _symbol){
            owner = msg.sender;
    }
}

~~~

- Ahora puedo ir a REMIX, compilar con el compilador adecuado (0.8.4)
- Me aseguro que en contract (REMIX) está mi contrato
- En deploy me pide el nombre y el simbolo. Escribo Miguel, MI
- Le doy a deploy y veo que ha sucedido satisfactoriamente el despliegue

~~~
status	true Transaction mined and execution succeed
transaction hash	0x5e3060ee43e1ecce55211f6ab4f1d82fa04bfaaa0b65c600a9b073bc9adb8701
from	0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to	FirstContract.(constructor)
gas	2441703 gas
transaction cost	2123220 gas 
execution cost	2123220 gas 
input	0x608...00000
decoded input	{
	"string _name": "Joan",
	"string _symbol": " JA"
}
decoded output	 - 
logs	[]
val	0 wei
~~~

- Este owner ya no tiene el 100% de los ETHER porque ha hecho una migración de un SC a una blockchain
- Los botones en azul (REMIX) no tienen ningún coste. Se puede clicar en ellas para ver la info


> NOTA: desarrollando con VSCODE, es necesario instalar npm i @openzeppelin/contracts@4.4.0 y especificar la ruta

> import  "@openzeppelin/contracts/token/ERC721/ERC721.sol"



