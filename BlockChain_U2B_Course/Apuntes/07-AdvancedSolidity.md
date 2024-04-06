# Advanced Solidity

## Constantes e inmutables

- Si vamos a usar variables que solo vamos a declarar una vez podemos usar herramientas para que el contrato sea más eficiente en términos de GAS
- Y **es significativo**!! Por lo que es importante usarlo
- Tenemos **constant** e **immutable**

~~~solidity
uint256 public constant minimumUSD = 50 *1e18;
~~~

- A las variables que solo vamos a declarar una vez pero no en la misma linea, se les puede poner **immutable**
- Por convencion se usa i_nombreVariable
- Pasa lo mismo con el GAS

~~~solidity
 address public immutable i_owner; //con immutable lo guardamos en el bytecode del contrato

    //CONSTRUCTOR!!!!    
    constructor(){
        i_owner = msg.sender;    
    }
~~~

- Podemos optimizar los requires para ser más eficientes en el consumo de GAS
- Desde Solidity 0.8 se puede customizar el error usando un if y un revert con una función
- **NOTA:** la función está declarada fuera del contrato
~~~solidity
    modifier onlyOwner {
    _;
    //require(msg.sender ==i_owner, "Sender is not the owner");
    if(msg.sender != i_owner){
        revert notOwner();
    }
 }
~~~

- **revert** es lo mismo que el **require** pero sin la condición primera
-----

## Receive and Fallback

- Que pasa si alguien envia este contrato sin llamar la función fund
- Tenemos **receive()** y **fallback()**
- receive es una función especial de solidity
- 
- FallbackExample.sol

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract FallbackExample {
    uint256 public result;

    receive() external payable{
        result = 1;
    }
}
~~~

- Si en REMIX pongo una cantidad de WEI y abajo de la interfaz voy a Low level Interaction y le doy al botón de Transact **con CALLDATA en blanco**
  - Veo en consola que se ha llamado a la función FalbackExample.receive()
  - Si miro result ahora vale 1
- Si añado data a CALLDATA (input en REMIX) no se llama a receive, solidity interpreta **que estás llamando a una función**
- El mensaje de error dice **"fallback is not defined"**

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract FallbackExample {
    uint256 public result;

    receive() external payable{
        result = 1;
    }

    fallback() external payable{
        result = 2;
    }
}
~~~ 

- Si ahora hago una transacción con alguna DATA, solidity no reconoce exactamente el que, por lo que llama a **fallback()**
- Ahora result vale 2
- Entonces
- Si msg.data está vacío llama a receive, si no hay receive llama a fallback
- Si msg.data no está vacío, llama a fallback
- Podemos usar fallback y receive en el contrato Fundme **en caso de que alguien envie dinero sin usar la función fund**
- Usaremos receive, así si alguien accidentalmente envía dinero podremos procesar la transacción

~~~solidity
receive() external payable{
        fund();
    }

fallback() external payable{
        fund();
    }
~~~ 

- Ahora si envio ETH a la dirección del contrato, lo redireccionará a la función fund
- Qué falta por aprender?
  - Enums
  - Events
  - Try / Catch
  - Function Selectors
  - abi.encode /decode
  - Hashing
  - Yul / Assembly
--------

