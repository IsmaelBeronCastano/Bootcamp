# Generar Tokens ERC721

- Empiezo como siempre con la licencia y la versión de solidity pertinente al compilador
- Importo de @openzeppelin el ERC721. Establezco la versión 4.5.0 en REMIX(web). En vscode no hace falta ( lo importo de node_modules)
- También debo importar el Counters, porque voy a necesitar un contador
    - Es un SC que hará que me despreocupe de si las operaciones aritméticas son correctas o no
    - Necesito un contador porque cada vez que se cree un token NFT le voy a asignar un número ( un id )
- Necesito un constructor. Este pide un nombre y un simbolo.
- Coloco detrás del paréntesis ERC721 para introducirlos
~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.5.0/utils/Counters.sol";

contract erc721 is ERC721 {

    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}
   
}
~~~

- Para establecer el contador lo declaro antes del constructor usando el Counters.sol
- Uso la palabra reservada using, extraigo el contador y lo nombro _tokenIds;
~~~js

contract erc721 is ERC721 {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}


}
~~~

- Creo una función para enviar NFTS
- Le añado un incremento al contador para que empiece en 1 y siga incrementando
- Ahora tengo un nuevo tokenId, para acceder al contador actual añado .current()
- Lo envío con _safeMint introduciendo la cuenta y el id del token
- 

~~~js
contract erc721 is ERC721 {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokensIds;

    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}

    //envío de NFTS

    function sendNFT( address _account) public{
        _tokensIds.increment();

        uint256 newItemId = _tokensIds.current();
        _safeMint(_account, newItemId);
    }

}
~~~

- Lo compilo con 0.8.4. 
- Hago el deploy, para ello introduzco el name y el symbol: Migue, MG
- Ahora aparecen todas las funciones detalladas anteriormente
- Pongo mi dirección en la función que cree sendNFT
- Si ahora miro balanceOf tengo 1 NFT
- En ownerOf, si pongo 1 aparece mi dirección
- En getApproved, que me diría si hay algun operador encargado de gestionarlo, en este caso devuelve 0x000000...no hay nadie
- Creo otro NFT, con el id 2 para darle poderes a otra persona
- Una dirección será el owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
- Otra dirección será el operador: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
- Desde el owner (en REMIX), introduzco la dirección del operator, y el id 1 del token en la función approve
- Ahora si voy al getApproved e introduzco 1 me devuelve la dirección del operador
- Ahora para usar el safeTransferFrom, desde el operador, el from que introduzco es el del owner, la dirección del operador ( o cualquiera) y el id 1
- El emisor era el controlador pero como tenía permisos para gestionar el NFT con id 1, lo puedo transferir
- Si lo intento con el NFT de id 2 no me deja
- Ahora si hago el balanceOf de la dirección del owner es 1
----
# Proyecto usando el ERC721

- Vamos a desarrollar una galería de arte con tokens NFT
    - Creación de obras de arte digitales
    - Uso de tokens NFT en las obras de arte
    - Extracción de beneficios económicos por cada NFT generado
    - Token NFT con propiedades
    - Incremento de las propiedades del token NFT
    - Envío de los fondos del Smart COntract al propietario del proyecto
- Otros requisitos:
    - Compilador 0.8.0
    - Uso de los Tokens NFT  con el proyecto openzeppelin versión 4.4.2
    - Código en inglés
- Creo el archivo Art.sol con su licencia y versión del compilador
- Importo el ERC721 y también Ownable. sol lo que me permitirá tener otras funciones de acceso
    - Con Ownable podré entrar a funciones que sean propiedad del owner ( mi propiedad )
- Creo un contrato con la herencia
~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract  ArtToken is ERC721, Ownable{
    
}
~~~

-----

# Definiciones iniciales

- Declaro el constructor del ERC721 para establecer unos parámetros de entrada
- **Siempre que le paso un string le pongo memory**    
- Le paso al ERC721 los parámetros que le llegan al constructor cuando creo el SC

~~~js
contract  ArtToken is ERC721, Ownable{

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){}

}
~~~

- En este momento si compilo y hago el deploy añadiéndole el name y el symbol ya tengo todas las funciones del ERC721
- Necesito un contador, lo nombro en mayúsculas
- Establezco un precio ( 5 ether )

~~~js
contract  ArtToken is ERC721, Ownable{

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){}

    uint256 COUNTER;

    uint256 fee = 5 ether;
}
~~~

- Voy a necesitar estructuras de datos que me permitan almacenar las propiedades de los NFT
    - Guardo el nombre, el id, el adn, la rareza, el nivel.
    - Lo guardo en el Storage declarándolo como un array. Será publico
- Emitiré un evento cada vez que emita una obra de arte. La address será indexada

~~~js
contract  ArtToken is ERC721, Ownable{

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){}

    uint256 COUNTER;

    uint256 fee = 5 ether;

    struct Art {

        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;

    }

    Art [] public art_works;

    event NewArtWork (address indexed owner, uint256 id, uint256 dna);

}
~~~

----

# Help Functions

- Cuando creo un adn lo debo crear de forma aleatoria. No me debo preocupar que lo haga el propio usuario
- Lo mismo con el nivel de rareza. Este nivel será de forma aleatoria
- Crearé un nombre random con una función interna
- Defino un hash. Según el tiempo irá cambiando este hash. Cómo accedo al tiempo en Solidity? con timestamp. Añadiré el msg.sender
- Hago la conversión y lo paso a entero
- Devuelvo el módulo del numero random por el parámetro de la función
- Así puedo elegir la cantidad de numeros aleatorios que quiero generar para las diferentes propiedades

~~~js
  function _createRandomNum(uint256 _mod) internal view returns(uint256){
        bytes32 hash_randomNum= keccak256(abi.encodePacked(block.timestamp, msg.sender));

        uint256 randomNum = uint256(hash_randomNum);

        return randomNum % _mod;
    }
~~~

-----

# Generación del Token NFT

- La función de crear NFT será una función interna (se explica más adelante porqué) y se dividirá en dos partes
- En una parte toda la lógica y otra que se encargue del pago
- Se necesita completar todas las propiedades de la estructura Art
    - Rareza y adn son propiedades aleatorias que yo debo asignar
- El nivel de rareza lo llamaré randRarity
    - Cómo parámetro se usan terminos como 10,100,1000, etc
    - Le hago la conversión a uint8 porque se declaró como parámetro cómo un uint256 pero es un uint8 en la structure
- Creo el randDna. No hace falta convertirlo porque es un uint256. Uso la misma función. 
- Quiero que el adn sea un numero más largo, por tanto le pongo una potencia de 10

~~~js
    function createArtWork(string memory _name) internal{
        uint8 randRarity = uint8(_createRandomNum(1000));
        uint256 randDna = _createRandomNum(10**16);
    }
~~~

- Ahora ya puedo crear la obra de arte
- Le paso los parámetros, le pongo de nivel 1 por defecto. 
    - Se hará una interacción con el usuario de que cuanto más pague mayor nivel tendrá
- Lo almaceno usando el push

~~~js
    function createArtWork(string memory _name) internal{
        uint8 randRarity = uint8(_createRandomNum(1000));
        uint256 randDna = _createRandomNum(10**16);
        Art memory newArtWork = Art(_name, COUNTER, randDna, 1, randRarity);
         
         art_works.push(newArtWork);
    }
~~~

- Necesito usar el minteo de los tokens NFT. Cuando hago un minteo hago una creación de un NFT
- Uso la función interna del ERC721 llamada _safeMint()
- La asigno a un owner ( el que está creando el token ), y un id (COUNTER)
- Una vez hecho todo el procedimiento emito un evento
    - Espera recibir un owner ( msg.sender), un id ( COUNTER ), y un dna ( randDna )
    - Debo instar que el COUNTER vaya incrementándose

~~~js
    function createArtWork(string memory _name) internal{
        uint8 randRarity = uint8(_createRandomNum(1000));
        uint256 randDna = _createRandomNum(10**16);
        Art memory newArtWork = Art(_name, COUNTER, randDna, 1, randRarity);

        art_works.push(newArtWork);

        _safeMint(msg.sender, COUNTER);

        emit NewArtWork(msg.sender, COUNTER, randDna);
        COUNTER++;
    }
~~~

-----

# Actualización y gestión económica de los tokens NFT

- Se estableció un precio para las obras de arte de 5 ether, pero que pasa si en un futuro lo quiero cambiar?
- Crearé una función para ello. Un update
- Será totalmente externa pero no puede usarla todo el mundo. necesito un modificador para que sólo sea el owner del contrato
    - El onlyOwner viene de la importación de. Ownable.sol
    - Declaro que el fee será el nuevo fee que paso por parámetro

~~~js
  function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
~~~ 

- Visualizaré mediante una función el balance del Smart Contract. Será totalmente necesario para extraer beneficio económico
- Va a devolver la dirección del SC, además del balance
- Cojo la dirección del smart contract referenciándolo con el this
- Quiero saber el dinero que hay en el SC. Cuando estas obras de arte se compren, el dinero va a ir al SC.
- Para poder extraer este dinero, necesito saber cuánto dinero hay
    - La función balance me devolverá el total en weis, pero yo no lo quiero en weis, lo quiero en ethers
    - La conversión se realiza de la siguiente forma ( 1 ether == 10 ** 18 weis)

~~~js
   function infoSmartContract() public view returns(address, uint256){
        address SC_address = address(this);
        uint256 SC_money = address(this).balance / 10**18;

        return (SC_address, SC_money);
}
~~~

------

# Obtención de los propietarios de los NFT

- Es necesario una función para saber qué tokens pertenecen a qué usuario
- Primero voy a ver qué tokens se han creado en todo el proyecto
- Será una función publica que devuelva una estructura de datos
- Hay que poner el memory siempre y cuando se usen estructuras o strings

~~~js
 function getArtWorks() public view returns (Art[] memory){
        return art_works;
    }
~~~

- Creo otra función para saber el propietario. Le mando una address como parámetro y me devuelve un arreglo de Art
- Establezco en una variable de tipo Art el resultado en memoria y la llamo result
- Esto será igual a una nueva instancia, un nuevo array que me diga el balanceOf del owner
- Este balance me dirá cuántas obras tiene este owner, por lo que establezco un contador para iterar y contar cuantas obras tiene
- Establezco con un condicional, si el owner que he introducido es igual al del Token incremento el contador en uno
- Si hay una coincidencia, almaceno esta obra de arte
    - Tengo la variable result y almaceno en la posición counter_owner el NFT
    - Incremento el counter_owner
- Salgo del bucle y devuelvo el resultado

~~~js
    function getOwnerArtwork(address _owner)public view returns(Art [] memory){
        Art [] memory result = new Art[](balanceOf(_owner));

        uint256 counter_owner = 0;

        for (uint256 i = 0; i < art_works.length; i++){
            if (ownerOf(i)==_owner){
                result[counter_owner]= art_works[i];
                counter_owner ++;
            }
        }
        return result;
    }
~~~
----

# Generación de los pagos y extracción de beneficios

- Necesitaré una función externa para realizar el pago por el NFT
- Será payable, necesario para recibir pagos
- Requeriré que lo que yo pague (msg.value) sea igual o mayor a la tasa asignada por token (fee)
- LLamo a la función interna  _createArtWork y lepaso el _name como parámetro

~~~js
   function createRandomArtWork(string memory _name) public payable{
        require(msg.value >= fee);
        _createArtWork(_name);
    }
~~~

- Compilo. Para efectuar la función que aparece en rojo debo poner 5 ethers (REMIX)
- En infoSmartContract aparece la cantidad de 5 ether
- Ahora debo escribir la función para extraer esos ethers del SC hacia mi cuenta de owner
- Será external, payable, pero sólo la podrá ejecutar el owner
- Cómo extraigo la dirección del owner? con la función interna de Ownable.sol
- Ahora debo hacer la transferencia. Hay una función interna en Solidity que es transfer()
- Debo poner la cantidad. Hago referencia al balance del SC con this

~~~js
   function  withdraw() external payable onlyOwner{
        address payable _owner = payable(owner());

        _owner.transfer(address(this).balance);
    }
~~~

----

# Subir de nivel el Token NFT

- Voy a crear una función que me permita interactuar con el usuario
- El level está siempre en 1. Pero puedo hacer que se pueda incrementar
- Si esto fuera un juego NFT, yo puedo hacer que el usuario pague por subir de nivel
- Usaré un require porque solo puede subir de nivel el owner del token
- Para ello uso ownerOf con el _artId y lo igualo al que está clicando la función
- Guardo en la blockchain una variable que llamo art, en ella guardo mi alista de obras de arte, la filtro por el id
- Cojo el campo level de la pieza que he identificado  y lo incremento.

~~~js
    function levelUp(uint256 _artId) public{
        require(ownerOf(_artId)== msg.sender);

        Art storage art = art_works[_artId];

        art.level ++;
    }
~~~