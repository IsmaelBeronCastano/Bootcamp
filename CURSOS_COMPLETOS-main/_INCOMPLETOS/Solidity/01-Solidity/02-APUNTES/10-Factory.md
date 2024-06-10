# Factory

## Fábrica de Smart Contracts

- Cuando hay un Smart Contract muy complejo se puede dividir en varios
- Yo puedo crear una función que clicándola genere automáticamente un nuevo SC (sub contrato distinto al principal para gestionar de forma separada)
- No hace falta que se llame Factory
- Dentro de address, entre paréntesis, coloco la palabra new y el segundo contrato
- Los parámetros son los que tengo en el constructor

~~~js
contract nombre_contrato{
    function Factory() public {
        address  direccion_nuevo_contrato = address
        (new nombre_contrato2(parámetros));
    }
}

contract nombre_contrato2{
    constructor(parámetros) public {...}
}
~~~

# PRÁCTICA

- Relaciono con un mapping una dirección (padre) con otra dirección (hijo)
- Los datos de recepción van a llegar al constructor del hijo(cuando se despliegue dicho contrato)
- Serán la dirección, y otra dirección del SC
- Lo guardaré en una estructura de datos de manera pública
- en el hijo le paso los parámetros de la dirección owner con msg.sender y la del contrato que es address(this)
- Relaciono el mapping de la dirección padre con la dirección que acabo de crear 

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract padre{

    //Almacenamiento de la info del Factory

    mapping(address => address) public personal_contract;

    function Factory() public {
        address addr_personal_contract = address(new hijo(msg.sender, address(this)));

        personal_contract[msg.sender] = address_personal_contract
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
~~~

- Hago la compilación y el deploy **DEL PADRE**
- Puedo ver que aparece la función Factory
- Se crea el nuevo contrato que se guarda en el mapping pero si no lo pongo public no puedo visualizarlo
- Le doy al Factory y me pide mi dirección en personal_contract, la introduzco y me devuelve una dirección distinta: la del SC hijo
- Cómo accedo a ese Smart Contract? En atAddress (REMIX) coloco dicha dirección y cambio al contrato hijo para hacer el deploy
    - Abajo aparece el contrato HIJO
    - En los logs puedo leer:
~~~js
{
	"0": "address: _owner 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
	"1": "address: _smartContractPadre 0xA831F4e5dC3dbF0e9ABA20d34C3468679205B10A"
}
~~~