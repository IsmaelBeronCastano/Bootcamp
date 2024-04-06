# BASICS SOLIDITY

- Creo una función a la que le paso un valor como parámetro que cambie una variable
- Si no le pongo public a la variable favoriteNum **no la tendré accesible desde Remix**
- Para testear usaremos la red de JavaScript London
- Compilo el contrato y hago el deploy
- Abajo puedo observar que tengo un botón naranja que dice store, es **la función pública que he creado**
- Otro botón lila/azul con el nombre de la variable pública **favoriteNum**
- Cada smart contract tiene una dirección igual que la tiene la wallet

~~~js
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19; //versión de compilación, ^0.8.20 significa la versión de aqui en adelante
                        // puedo usar >=0.8.7 < 0.9.0 para especificar un rango

contract SimpleStorage{
    //Types: boolean, uint (siempre positivo), int (positivo o negativo), address, string, bytes

    bool hasFavoriteNumber = true;
    uint favoriteNumber = 123; //uint puede tenr varios bits (uint256 es el máximo, si no se especifica es 256)
    int256 otherNumber = -123;
    //string text= "text"  
    address myAddress = 0xD17aAEb79f47BcaE3af596c23C3C9f14Ef29fcd9;
    bytes32 favoriteBytes= "more bytes!";
    uint256 public favoriteNum;

    function store(uint256 _favoriteNum) public{
      favoriteNum = _favoriteNum;

  }
}

//0xd9145CCE52D386f254917e481eB44e9943F39138   adress de este smart contract
~~~

- Tenemos **public private external** e **internal**
- public: visible interna y externamente. Crea un getter
- private: solo visible en el proyecto
- external: solo visible externamente (alguien fuera del contrato puede llamar la función)
- internal: solo el contrato y sus hijos pueden llamar la variable o la función
- Colocar un guión bajo a una variable se usa para diferenciarla de una variable global (convenciones)
- Cuantas más acciones haga la función a la que llamo, más cara será ejecutarla
- El getter que crea al declarar pública una variable global sería esto

~~~solidity
  function retrieve() public view returns(uint256){
    return favoriteNum;
  }
~~~

- Una función con **view** significa que solo vamos a leer algo de este contrato. Permite modificaciones en el contrato
- Una función con **pure** **no permite** ninguna modificación ni tampoco leer nada del contrato
- **view y pure** no gastan GAS
- Solo gastan GAS aquellas transacciones que **modifican** algo del contrato
- **returns** sirve para determinar el tipo del valor de retorno de  la función
-------

## Structs y Arrays

- Con struct podemos crear un tipo de dato que como objeto almacene un nombre con un número

~~~solidity
contract SimpleStorage{
    //Types: boolean, uint (siempre positivo), int (positivo o negativo), address, string, bytes

    struct People {
    uint256 favoriteNum;
    string name;
  }

  People public people = People({favoriteNum:2, name: "Jonas"}); //añado public para poder acceder desde fuera
}
~~~

- Compilo y hago el deploy. Ahora tengo accesible people y puedo leer su contenido
- Se puede acceder mediante un index a estas propiedades (0:favoriteNum, 1:name)
- Podemos crear un array para almacenar un montón de gente
- Puedo crear el array dinamicamente sin especificar el número de elementos que va a contener
- Si quiero un número determinado de elementos puedo especificarlo entre los corchetes
- Al ponerle public puedo acceder a sus elementos desde fuera una vez compilado mediante el index

~~~solidity
contract SimpleStorage{
    //Types: boolean, uint (siempre positivo), int (positivo o negativo), address, string, bytes

    struct People {
    uint256 favoriteNum;
    string name;
  }

  People[] public people;      //Puedo especificar el num de elementos con People[n] 

  function addPerson(string memory _name, uint256 _favoriteNum) public{
    People memory newPerson = People({favoriteNum: _favoriteNum, name: _name });
    people.push(newPerson);

  } 
}
~~~ 

- Compilo + Deploy
- Ahora puedo crear personas desde fuera  (botón naranja addPerson) y acceder mediante el index con people (botón lila)
- Si añado los parámetros en el mismo orden del struct puedo hacerlo así

~~~solidity
function addPerson(string memory _name, uint256 _favoriteNum) public{
  People memory newPerson = People(_favoriteNum, _name);
  people.push(newPerson);
} 
~~~

- O hacerlo directamente en el push

~~~solidity
function addPerson(string memory _name, uint256 _favoriteNum) public{
  people.push(People(_favoriteNum, _name)); //no necesita memory
} 
~~~
----

## Memory, Storage and Calldata

- EVM puede acceder a la data en diferentes lugares
  - Stack
  - Memory: la variable solo existe momentáneamente en la ejecución de la función
    - Variables **temporales que pueden ser modificadas**
  - Storage: la variable existe en todo momento aunque no se declare
    - Son variables **permanentes que pueden ser modificadas**
  - Calldata: uso calldata en el parámetro de la variable de una función que no va a ser modificada en la ejecución de esta
    - Son variables **temporales que no pueden ser modificadas**
  - Code
  - Logs
- **array, struct y mapping** types son tipos **especiales** en Solidity por lo que hay que usar **memory**
  -  Un string es un array de caracteres, por lo que hay que poner la palabra memory al usarla en una función
- Esto de almacenar personas en un array es fácil y eficiente de esta manera porque tenemos pocas, pero si tuvieramos miles sería poco práctico
- Tenemos otra manera con **mapping**. Es como un **diccionario**

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
                                                        //importante el memory!!
    function getPeople() external view returns(People[] memory){
    return people;
  }

    function addPerson(string memory _name, uint256 _favoriteNum) public{
        people.push(People(_name, _favoriteNum)); //no necesita memory
        nameToFavoriteNum[_name] = _favoriteNum; //asigno números al nombre dado en un mapping
    }  
}
~~~
----

