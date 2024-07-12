# Funciones Avanzadas

- Modificador internal y external:

~~~js
function nombre_funcion (parámetros) [public| private | internal | external] [view| pure| payable] [returns (return_type)]{}
~~~

- **Internal**: es similar al private.  Únicamente es posible ser llamado desde el contrato actual o contratos que deriven de él
    - Esta función (con internal) solo se puede usar en el propio smart contract y en los heredados de este
    - A diferencia del método private que no permite la herencia
- **External**: sólo puede ser llamada desde fuera del contrato. No puede ser llamada internamente

- Require: lanza un error y para la ejecución de una función si la condición no es verdadera.
    - Si es verdadera sigue con el código, si no lanza el error y detiene la ejecución

~~~js
require(condición, "Mensaje condición falsa")
~~~

- Modifier: permite cambiar el funcionamiento de una función de manera ágil
    - El require hace que si se cumple la condición siga con el código y si no lance un error
    - Finaliza con barra baja y punto y coma
    - Muy usado para permisos y filtrar el tráfico

~~~js

modifier nombre_modificador ( parámetros ){
    require(condición);
    _;
}

function nombre_funcion (parámetros) 
    [public| private | internal | external] 
    [view| pure| payable] [returns (return_type)] [nombre_modificador (parámetros)]{}
~~~

----
# PRÁCTICA

- Agrego una estructura de datos como plato
- Cada menu tendrá un arreglo de platos
- Hago una función para crear un nuevo menú. Será internal, nadie externo a la organización podrá llamarla

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract Food{

    // Estructura de datos

    struct dinnerPlate{
        string name;
        string ingredients;
    }

    dinnerPlate [] menu;

    // Nuevo menú
    function newMenu( string memory _name, string memory _ingredients) internal {
        menu.push(dinnerPlate(_name, _ingredients));
    }
}
~~~

- Voy a crear una herencia
- Le añado un require para que no pueda pedir más de 5 burguers
- La función, al ser external, sólo puede usarse de forma pública, no puede usarse dentro del propio contrato
- Creo un modificador para que solo pueda acceder el owner
- Lo finalizo con barra baja y punto y coma

~~~js
contract Burguer is Food{

    address public owner;

    constructor(){
        owner = msg.sender;
    }

    //Cocinar hamburguesa desde el smart contract principal

    function doBurguer(string memory _ingredients, uint _units) external{
        require(_units <= 5, "Ups, no puedes pedir tantas hamburguesas");

        newMenu("Burguer", _ingredients);
    }

    // Modifier: permitir el acceso unicamente al owner
    modifier onlyOwner() {
        require(owner == msg.sender, "No tienes permisos para ejecutar esta funcion");
        _;
    }
}
~~~

- Creo una nueva función para usar el modifier, que se encargue de hacer el hash de un número
- Solo puede usar esta función el owner

~~~js
   function hashPrivateNumber(uint _number) public view onlyOwner returns (bytes32){
        return keccak256(abi.encodePacked(_number));
    }
~~~