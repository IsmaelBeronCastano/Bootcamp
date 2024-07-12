# Bucles y condicionales

- Tengo if, if else, for y while
- La syntaxis es prácticamente idéntica que en JS
- Veámoslo en la práctica
-----
# PRÁCTICA

- Como siempre inicio el contrato con la licencia y la versión

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract loops_conditionals {

    // Suma de los 10 primeros numeros a partir de un numero introducido

    function sum(uint _number) public pure returns(uint){
        uint aux_sum = 0;

        for(uint i = _number; i < (_number + 10); i++){
            aux_sum = aux_sum + i;

        }
        return aux_sum;
    }
}
~~~

- while e if. Suma de los 10 primeros numeros impares

~~~js
    function odd() public pure returns (uint){
        uint aux_sum = 0;
        uint counter = 0;
        uint counter_odd= 0;

        while(counter_odd < 10){
            
            if (counter % 2 != 0){
                aux_sum = aux_sum + counter;
                counter_odd ++;
            }
            counter ++;
        }

        return aux_sum;
    }
~~~

- Suma o resta en función de lo que el usuario elija
- Si quiero comparar un string (operation == "suma") debo hashearlo, no lo puedo hacer directamente
- Declaro una variable bytes32 y uso keccak256 para pasarle la string
- En caso de que no sea suma siempre hará la resta

~~~js
    function sum_rest(string memory operation, uint a, uint b) public pure returns (uint){
        
        
        bytes32 hash_operation= keccak256(abi.encodePacked(operation));

        if (hash_operation == keccak256(abi.encodePacked("suma"))){
            return a + b;
        }else{
            return a - b;
        }
    }
~~~

- Si quiero añadir otras operaciones puedo usar un else if

~~~js
 function sum_rest(string memory operation, uint a, uint b) public pure returns (uint){
        
        
        bytes32 hash_operation= keccak256(abi.encodePacked(operation));

        if (hash_operation == keccak256(abi.encodePacked("suma"))){
            return a + b;
        
        }else if(hash_operation == keccak256(abi.encodePacked("resta"))){

            return a - b;

        }else if(hash_operation == keccak256(abi.encodePacked("division"))){
            return a / b;
        
        }else if(hash_operation == keccak256(abi.encodePacked("multiplicacion"))){

            return a * b;
        }else{
            return 0;
        }
    }
~~~

- Puedo usar REMIX para la funcion sum_rest y ponerle de parámetros: suma, 10, 2
- Cualquier palabra que no reconozca me devolverá 0
- Recuerda: UN STRING NO SE PUEDE COMPARAR DE FORMA LITERAL



