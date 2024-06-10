# OPERACIONES MATEMÁTICAS

- Suma resta, división, multiplicación, exponenciación, y módulo

~~~
a+b ---> suma
a-b ---> resta
a*b ---> multiplicación
a/b ---> división
a**b ---> exponenciación
a%b ---> módulo: el resto de una división
~~~

- Solidity tiene sus propias funciones matemáticas. 
- Algunas son:
    - uint suma = addmod(x,y,k)
        - x + y % k
    - uint suma = mulmod(x,y,k)
        - x * y % k
----
# PRÁCTICA

- Algunos ejemplos de operaciones matemáticas

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract maths {
    
    function suma (uint a, uint b) public pure returns(uint){
     return a+ b;
    }

    function resta( uint a, uint b) public pure returns(uint){
        return a - b;
    }
}
~~~