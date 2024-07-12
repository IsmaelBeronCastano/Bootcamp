# Estructuras de datos

- structs: tipicas estructuras de datos. Permite definir tipos de datos más complejos

~~~js
struct nombre_estructura{
    data_type1 nombre_variable1
    data_type2 nombre_variable2
    data_type3 nombre_variable3
}
~~~

- mappings: Asociación clave-valor para guardar y ver datos. Crea relaciones

~~~js
mapping (keyType=> _valueType) [public]*
nombre_mapping
~~~

- arrays: Tipo de dato estructurado que almacena un conjunto homogéneo de datos

~~~js
data_type [] [public]* nombre_array
~~~

--------
# PRÁCTICA

- Pongo la licencia y la versión
- Creo el contrato
- Creo una estructura de datos con los datos del cliente (customer)
- Creo un cliente_1 de tipo cliente

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract data_structures {
    
    // Estructura de datos
    struct Customer{
        uint256 id;
        string name;
        string email;
    }

    // Variable de tipo cliente

    Customer customer_1 = Customer(1, "Migue", "migue@gmail.com");
}
~~~

- La mayoría de datos en la blockchain serán públicos. No guardar datos sensibles
- Creo un array de longitud fija. Si yo se cuantas posiciones tiene mi lista puedo crear un array de longitud fija

~~~js
uint256 [5] public fixed_list_uints = [1,2,3,4,5];
~~~

- Para generar un array dinámico lo haré de la siguiente manera

~~~js
uint256 [] dynamic_list_uint;
~~~

- Creo un array dinámico de tipo cliente

~~~js
  Customer [] public dynamic_list_customer;
~~~

- Cómo genero nuevos datos en un array? Para introducirlos usaré .push

~~~js
    function array_modification(uint256 _id, string memory _name, string memory _email) public {
        
        dynamic_list_customer.push(Customer(_id, _name, _email));
    }
~~~

- En la próxima lección se tratarán las funciones con más detalle
- Puedo guardar el customer en una variable.
- Para que no se guarde en la blockchain usaré memory.
- memory es un modificador que guarda de forma temporal un valor
- storage lo guardaría en la blockchain

~~~js
   function array_modification(uint256 _id, string memory _name, string memory _email) public {
        
        Customer memory random_customer = Customer(_id, _name, _email);

        dynamic_list_customer.push(random_customer);
    }
~~~

- Un mapping puede relacionar una dirección con un valor ( con su saldo, por ejemplo )
- Para relacionar una clave con un valor array simplemente declaro el tipo de array 
- Relaciono con mapping una dirección con los datos de un cliente

~~~js
mapping(address => uint256) public address_uint;

mapping(string=> uint256 []) public string_listUints;

mapping(address => Customer) public address_customer;

~~~

- Asignar un numero a una dirección
- Uso address_uint;
- Hay que referenciar tanto la clave cómo el valor
- La **clave** es el primer parámetro (address), el **valor** (uint256) el segundo asociado a esta clave
- El address será el msg.sender ( quien esté clicando el botón ). Lo pongo entre corchetes porque tiene un punto
- El uint256 será el number que introduzco cómo parámetro en la función

~~~js
  function assignNumber (uint256 _number) public{
        address_uint[msg.sender] = _number;
    }
~~~

- Asignar una lista ( varios números a una dirección )
- Uso el string_listUints. La calve es un string, el valor un array de uints
- Le paso el string y el uint cómo parámetro
- Con .push se irán acumulando estos números en el array

~~~js
function assignList ( string memory _name, uint256 _number) public{
        string_listUints[_name].push(_number);
    }
~~~

- Asignación de una estructura de datos a una dirección
- Le paso los parámetros que sé que debe tener un Customer

~~~js
function assignDataStructure(uint _id, string memory _name, string memory _email) public{
        address_customer[msg.sender] = Customer(_id, _name, _email);
    }
~~~






