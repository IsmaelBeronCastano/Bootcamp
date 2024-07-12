# FUNCIONES

- Las funciones son las unidades ejecutables del código dentro de un contrato
- Pueden ser públicas o privadas. Si son públicas son accesibles por todas las funciones y personas de forma externa
    - El private la hace accesible únicamente por el contrato dónde se declara ( de forma interna )

~~~js
function nombreFuncion (parametros) [public| private]{
    ...
}
~~~

## Modificadores view, pure y payable

- Además de public o private se pueden añadir alguno de estos modificadores

~~~js
function nombreFuncion (parametros) [public| private] [view| pure| payable][returns (return_types)]{
    ...
}
~~~

- View: no modifica ningún dato de la blockchain. Simplemente accede a un dato de la blockchain
- Pure: no accede ni siquiera a los datos. Ni accede ni almacena datos en la blockchain
- Payable: permite recibir, enviar ethers
- Con el return se puede devolver valores. Se escribe returns y entre paréntesis el tipo del valor/es que voy a devolver

## Eventos

- Es esa info que se quiere registrar ( cuando se hace una transacción, por ejemplo)
- Es la comunicación de un suceso a la blockchain
- Primero se declara el evento y luego se emite
- Los tipos son los tipos de variable que quiero emitir. Que dirección ha emitido este pago (address), que cantidad llevaba este pago(uint), etc

~~~js
event nombre_evento (types)

emit nombre_evento (values)
~~~

------
# PRÁCTICA

- De tipo **pure**: en ningún momento acceden a la blockchain
- Siempre se usa el memory en los parámetros de entrada, sea en las funciones o en los returns

~~~js
// SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract Functions{


    function getName() public pure returns(string memory){

        return "Migue";
    }

}
~~~

- De tipo **view**: de visualizar. Funciones para acceder a la blockchain
- Instancio una variable. Este valor irá a la blockchain

~~~js
    uint256 x= 100;

    function getNumber() public view returns(uint256){
        return x*2;
    } 
~~~

- De tipo **payable**
- Enviar y recibir ethers se puede hacer sin restricción si se tiene la address
- Esto debe contemplarse
- Hay unas llamadas propiamente para la recepción de los ethers que son fallback y receive ( siguiente lección )
- Cuando envío ether, se envía una cantidad de **gas** a otro smart Contract para que gestione la recepción de los ether que le acabod e enviar
- Esto es porque necesita llamar a otra función
- Creo un nuevo archivo con un nuevo contrato llamado ethSend y ethReceiver
- Uso un constructor de tipo payable
- receive() se encarga de recibir los ether
- declaro los eventos

~~~js
// SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract ethSend{

    constructor() payable {}
        receive() external payable {}
    
    event sendStatus(bool);
    event callStatus(bool, bytes);
}

contract ethReceive{

}
~~~

- Hay tres maneras de enviar ether
    - Transfer
    - Send
    - Call
- La diferencia entre ellas radica en el estipendio de gas

- **Transfer**
- Indico que la address _to puede recibir dinero con payable, y la función también es payable ( y pública )
- Indico la cantidad de 1 ether. Si en lugar de ether dejo el número sólo será la cantidad de gas.
- Un ether es 10**18 unidades de gas

~~~js
   function sendViaTransfer( address payable _to) public payable {
        _to.transfer(1 ether);
    }
~~~

- **Send**
- El send devuelve un valor booleano conforme se ha realizado el envío
- Si el boolean es false debo cortar la ejecución de la función. Para ello está el require
- La condición a respetar es true ( se requiere que sea true), en caso de que no lo sea que envíe el string de el envío ha fallado

~~~js
    
    function sendViaSend( address payable _to) public payable {
       bool sent=  _to.send(1 ether);
       emit sendStatus(sent)
        require(sent == true, "El envio ha fallado");
    }
~~~

- **Call**
- La llamada al _to se hace de forma distinta
- Las comillas son unos bytes. Funciona idéntico al transfer pero con un funcionamiento interno distinto
- Devuelve dos valores, success y la data. Los extraigo con desestructuración
- Emito el evento con el boolean y los bytes

~~~js
  function sendViaCall( address payable _to) public payable{
        (bool success, bytes memory data) = _to.call{value:1 ether}("");
        emit callStatus(success, data);
        require(success == true, "El envio ha fallado");

    }
~~~

- Ahora el ethReceiver
- Transfer y Send envían 2.300 unidades de gas
- Call envía todo el gas
- Declaro la función receive
- Emito el evento para saber cuánto dinero le queda y cuantas unidades de gas con gasleft()

~~~js
contract ethReceive{

    event log(uint amount, uint gas);

    receive() external payable {
        emit log(address(this).balance, gasleft());
    }
}
~~~

- Hago el compilado y deploy de los dos contracts
- Envío 1 ETHER (todo desde REMIX) a la dirección que recibe
- En consola aparece esto ( me lo he enviado a mi mismo jeje )
~~~
status	true Transaction mined and execution succeed
transaction hash	0x74cfd8b96ee6f1e9fbcea1f4240206b2765ba225f6736fac8a74c76fb835c36e
from	0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
to	ethSend.sendViaTransfer(address) 0x652c9ACcC53e765e1d96e2455E618dAaB79bA595
gas	37754 gas
transaction cost	32829 gas 
execution cost	32829 gas 
input	0x636...2600f
decoded input	{
	"address _to": "0x417Bf7C9dc415FEEb693B6FE313d1186C692600F"
}
decoded output	{}
logs	[
	{
		"from": "0x417Bf7C9dc415FEEb693B6FE313d1186C692600F",
		"topic": "0xf666715aa6b8e8ce32bd39173f51eea0643fdd246a826c4756c2f168022b6eb5",
		"event": "log",
		"args": {
			"0": "1000000000000000000",
			"1": "2257",
			"amount": "1000000000000000000",
			"gas": "2257"
		}
	}
]
val	1000000000000000000 wei
~~~ 