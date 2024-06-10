# Tipos de variables y modificadores

## Variables

- En una variable se guardan y se recuperan los datos que se usan en el contrato

> tipo_de_dato nombre_variable

- También se puede inicializar una variable

> tipo_de_dato nombre_variable = valor

- Hay varios tipos de variables
    - Entera: variables numéricas sin decimales. 
    ~~~
    uint nombre_variable 
    int nombre_variable (con signo, negativo o positivo)
    ~~~
    - String: cadena de caracteres. 
    ~~~
    string nombre_cadena
    ~~~
    - Booleans: true or false. 
    ~~~
    bool nombre_booleano
    ~~~
    - Bytes: muy utiles en criptografia. Dónde x es la longitud del byte: 
    ~~~
     bytes<x> nombre_variable
    ~~~

    - Address: direcciones, como la de la wallet. Se extrae mediante criptografía de clave pública. 

    ~~~
    address nombre_variable
    ~~~

    - Enum: es como un interruptor on/off. Sirve de switch. Sería como darle un estado distinto a una variable

    ~~~
    enum   nombre_enumeración  valor_enumeración
    ~~~
    -----
## Tipos de modificadores
 
 - **Public**. Crea una función getter. Todo el mundo puede acceder a la variable

 - **Private**. Solo son visibles dentro del SC

 - **Internal**. Solo son accesibles internamente. También con herencia

    - Estas 3 se declaran siempre siguiendo la misma syntaxis

 ~~~
 tipo_dato [public|private|internal]* nombre_variable
 ~~~

 - **Memory**. Guardado de manera temporal

 - **Storage**. Guardado permanentemente en la blockchain (coste asociado)
 
~~~
tipo_dato [memory|storage]* nombre_variable
~~~

 - **Payable**
    - Permite enviar y recibir ether a una dirección
~~~
address [payable]* nombre_variable
~~~
--------

# PRÁCTICA

- Cómo siempre se empieza con la licencia y la versión de pragma solidity

~~~~
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;
~~~~

- Inicio un contrato y declaro un uint.
    - Los uint se pueden clasificar en multiplos de 8.
    - uint8, uint16...hasta uint256
    - Siempre son positivos
    - uint sin especificar significa uint256
- Después tengo los int que pueden albergar números negativos
    - int sin especificar es int256
- Si quiero hacer accesible la variable le pongo public

~~~js
// SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract variables_modifiers {
    
    uint a;
    uint8 b = 3;

    int256 c;
    int8 public d = -32;

}
~~~
- Si compilo y hago el deploy tengo accesible la variable d
- Las strings se declaran con la palabra string
- Los booleanos con la palabra bool

~~~js
contract variables_modifiers {
    
    uint a;
    uint8 b = 3;

    int256 c;
    int8 public d = -32;

    string str;
    string public str_public = "Esto es publico";

    bool public boolean_true = true;

}
~~~

- Las variables de tipo byte tambien tienen una longitud del 1 al 32
- Estos bytes sirven muy bien para las funciones criptográficas
- La función sha256 era para bitcoin, para ethereum hay una muy parecida
- Para iniciar la función del algoritmo de hashing usaré
    - keccak256
    - Usaré abi.encodePacked para pasarle los parámetros a hashear
    - Importante: bytes32

~~~js
contract variables_modifiers {
    
    uint a;
    uint8 b = 3;

    int256 c;
    int8 public d = -32;

    string str;
    string public str_public = "Esto es publico";

    bool public boolean_true = true;

    bytes1 first_byte;
    bytes21 second_bytes;

    bytes32 public hashing = keccak256(abi.encodePacked("Hola", "soy Miguel"));

}
~~~

- Las variables de tipo address son de un valor concreto ( wallet)

- Uso el msg.sender en una address con public para visualizar desde el exterior la dirección de quien está ejecutando la función

~~~js
 address public address1 = msg.sender;
~~~

- Enum va sin punto y coma
- La declaro como state(variable)
- Para declarar un valor por defecto usaré una constante con defaultChoice
- Creo unas funciones para encender y apagar

~~~js
    enum options {ON,OFF}

    options state;

    options constant defaultChoice = options.OFF;

    function turnOn() public {
        state = options.ON;
    }

    function turnOff() public {
        state= options.OFF;
     }

     function displayState() public view returns (options){
        return state;
     }
~~~
----
## Función de Hashing

- Solidity permite usar otros algoritmos aparte de keccak256
- Por ejemplo, el sha256
     - Este recibe un parametro de entrada de tipo bytes memory y devuelve un valor de bytes32
~~~
 bytes32 public hashing_sha256 = sha256(abi.encodePacked("Hola"));
~~~

- Hay otros algoritmos de hash, cómo el ripemd-160
- Devuelve un bytes20

~~~
bytes20 public hashing_ripemd160 = ripemd160(abi.encodePacked("Hola"));
~~~

- Si quiero introducir un entero cómo parámetro en cualquiera de estos algoritmos de encriptación  debo declararlo primero

~~~
bytes20 public hashing_ripemd160 = ripemd160(abi.encodePacked("Hola", uint(10)));
~~~

- En el caso de las address no hay que hacer ninguna conversión para hashearlas

~~~
bytes32 public hashing_sha256 = sha256(abi.encodePacked("Hola", 0xaf1e00eea07b11fef0fcfbe56aa4e626f1ddb9e9));
~~~

