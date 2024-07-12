# Funciones Fallback y Receiver

- msg.data: es el calldata completo
    - es un area no modificable y no persistente en la que se almacenan los argumentos de la función
    - se comporta principalmente como la memoria

- Ether enviado al Smart Contract:
    - msg.data vacío ene ste envío de ethers?
        - Si: existe receive?
            - Si: receive()
            - No: fallback()
        - No: fallback()

- Fallback y receive son funciones que se ejecutan cuando quiero recibir ether
- Un contrato puede tenr cómo máximo una función de tipo fallback
-----
- en el receive dejo el msg.data vacío, porque cuando la data va vacía es dónde se observa si existe el receive o no
- Si hay info se llama directamente al fallback

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract Fallback_Receive{

    event log( string, address, uint, bytes);

    fallback() external payable {
        emit log("fallback", msg.sender, msg.value, msg.data);
    }

    receive() external payable {
        emit log("receive", msg.sender, msg.value, "");
    }
}
~~~

- Al hacer el deploy, si añado data en el CallData de REMIX y hago el deploy, veo en consola que se ha llamado al fallback 
- En los logs puedo verlo (envié un ether y 0x1212 es la data que introduje)

~~~js
	[
	{
		"from": "0x4815A8Ba613a3eB21A920739dE4cA7C439c7e1b1",
		"topic": "0xbb7455e1330c1ad664613f3d998bd858bae53893f04a4eb34718b211dd87c59e",
		"event": "log",
		"args": {
			"0": "fallback",
			"1": "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
			"2": "1000000000000000000",
			"3": "0x1212"
		}
	}
]
~~~

- Sin enviar data ( pero si un ether) me devuelve el receive. La data es 0x

- Si no envio ether ni data, existe el receive? no, por lo tanto llama al fallback

