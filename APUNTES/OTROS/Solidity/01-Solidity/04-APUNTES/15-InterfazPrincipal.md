# Interfaz principal

- El token ERC721 es el llamado NFT, Non Fungible Token
- Es indivisible, único, programable y rastreable
- Voy a explicar función a función
- Hay varios SC establecidos en el ERC721
- Hay varias implementaciones y extensiones
- Hay varias interfaces que lo hacen compatible:
    
    - IERC721 ( la principal )
    - IERC721Metadata
    - IERC721Enumerable
    - IERC721Receiver

- Las funciones de la principal (IERC721) son las siguientes:

    - balanceOf(owner): devuelve un unit256 del balance total de tokens de un owner en una blockchain en concreto
    - ownerOf(tokenId): devuelve el address del propietario del token
    - safeTransferFrom(from, to, tokenId, data): permite enviar desde un emisor un token NFT a un receptor
    - safeTransferFrom(from, to, tokenId): igual que el anterior sin el parámetro bytes data con info del token
    - transferFrom(from, to, tokenId): es preferible usar safeTransferFrom, es más seguro
    - approve(to, tokenId): da permisos a un usuario para transferir un token NFT mio
    - setApprovalForAll(operator, _approved): se da permisos a un usuario (operator) para transferir sobre todos los tokens que poseo. _approved es un boolean: true da los permisos, false los quita
    - getApproved(tokenId): da info de quién es el operador, quien mueve el token NFT
    - isApprovedForAll(owner, operator): devuelve un booleano para confirmar si este owner ha desigando a este operador
----
# Más interfaces

- IERC721Metadata: tiene las siguientes funciones más las funciones heredadas del IERC721
    - name(): devuelve el nombre de la colección de los NFT
    - symbol(): devuelve el simbolo de la colección de los NFT
    - tokenURI(tokenId): devuelve un string, el Uniform Resource Identifier del token
- Además hereda del IERC165 que da un soporte a la interfaz. Este tambien consta en la interfaz IERC721

- IERC721Enumerable: es opcional. Permite enumerar los tokens NFT en la cadena. A menudo no se incluye porque tiene un sobrecoste en gas
    
    - totalSupply(): cuantos tokens NFT se han emitido
    - tokenOfOwnerByIndex(owner, index): obtener más info. Devuelve un id de un token NFT de un owner. Permite hacer relaciones entre un owner y un NFT mediante el uso del balanceOf para hacer enumeraciones de los token NFT que se han emitido para un owner
    - tokenByIndex(index): enumera todos los tokens que existen en el totalSupply

- IERC721Receiver: debe ser implementada en contratos que quieran aceptar el uso de safeTransferFrom
    - onERC721Received(operator, from tokenId, data)
----
# Funciones relevantes del ERC721

- El constructor recibe un name_ y un symbol_, el nombre del Token (del Smart Contract) y el símbolo
- supportsInterface(interfaceId): se hereda del ERC165, da soporte a la interfaz. Devuelve un boolean
- balanceOf(owner)
- ownerOf(tokenId)
- name()
- symbol()
- tokenURI(tokenId)
- _baseURI() función interna (empieza con barra baja). No pueden usarse de forma pública
- approve(to, tokenId)
- getApproved(tokenId) devuelve si una persona tiene acceso sobre un token NFT ( si es un operador )
- setApprovalForAll(operator, approved) da permisos para todos lso NFT
- isApprovedForAll( owner, operator) comprobación de si lapersona tiene permiso sobre todos los NFT de un owner
- transferFrom(from, to, tokenId)
- safeTransferFrom(from, to, tokenId, data)
- safeTransferFrom(from, to, tokenId)
- _safeTransfer(from, to, tokenId, data). Todas las que llevan barra baja son funciones internas. Se encargan de la lógica para que las funciones públicas sean más seguras. Este caso sirve en el safeTransferFrom
- _exists(tokenId) si existe o no el Token
- _isApprovedOwner(spender, tokenId) devuelve si un spender esta aprovado por un owner
- _safeMint(to, tokenId) El minteo es algo muy presente en los tokens. Consiste en la creación de NFT
- _safeMint(to, tokenId, data)
- _mint(to, tokenId)
- _burn(tokenId) para quemar un token NFT
- _transfer(from, to, tokenId)
- _approve(to, tokenId)
- _setApprovalForAll(owner, operator, approved)
- _beforeTokenTransfer(from, to , tokenId) hook para hacer algo antes de que un token se transfiera
- _afterTokenTransfer(from, to , tokenId) hook para hacer algo después de que un token se transfiera
- También tengo eventos
    - Transfer( from, to, tokenId)
    - Approval(owner, approved, tokenId)
    - ApprovalForAll(owner, operator, approved)


