# SOLIDITY

- Para establecer la versión del compilador

> pragma solidity ^0.8.0;

- Se puede dar un rango de versiones

> pragma solidity >=0.6.0 < 0.8.0

- Hay que usar un compilador adecuado para este código
- Los comentarios se escriben con //
- Se recomienda no usar acentos en los comentarios
- Para comentarios de varias lineas usar /* comentario */
- Las importaciones se hacen igual que en ECMA6
- Se utilizan importaciones de un repositorio externo, como openzeppelin

> import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol"

- Para crear un Smart Contract se empieza la sentencia con contract

> contract nombre_contrato{}

- Al crear un Smart Contract se suele hacer uso de un constructor
- En este se describen las propiedades del contrato
- No siempre es necesario

> constructor (){}

- El standar de comentarios (documentación) en Solidity es con ///

~~~js
/// @title titulo_del_contrato
/// @author autor_del_contrato
/// @notice explicar loi que hace el contrato
/// @dev detalles adicionales
/// @param nombre_parametro, explicar para que sirve el parámetro
/// @return valor_retorno , describir para qué sirve valor de retorno
~~~

- Herencia: heredar funcionalidades de otro Smart Contract

> contract nombre_contrato is nombre_contrato_heredado{}

- La herencia nos servirá para ejecutar las mismas funciones del contrato heredado


