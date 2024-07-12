# DEPLOY

- Necesito desplegarlos todos. Despliego primero Jam y Stellar
- Para desplegar el FarmToken me pide la dirección de lso contratos Jam y Stellar
- Accedo a la derecha del contrato desplegado al icono de copiar y lo introduzco (REMIX)
- Ya están los 3 Smart Contracts desplegados

- Si copio la dirección del owner y voy a balanceOf, veo que tiene todos los tokens
- Ahora hay un usuario que quiere hacer staking. Voy a hacer que el owner le envíe una cantidad de tokens
    - Uso el transfer
- Voy al StellarToken contract
- El owner tiene todos si miro en balanceOf
- Necesito enviar unos tokens al FarmToken para que pueda gestionarlos
    - Copio la dirección del TokenFarm y lo pongo en el _to del transfer, pongo de value 10000
- Ahora el usuario quiere hacer staking
- Voy al TokenFarm y en stakeTokens ( desde la dirección del usuario ) añado las 1000 unidades
- Esto da error porque hay que hacer primero un approve del JamToken
    - Hay que hacerlo de forma manual, con una DaPP ya estaría hecho automaticamente
    - Como spender coloco al TokenFarm y value 1000
- Ahora si voy a las funciones isStaking y hasStaked me devuelve true
- En stakers, introduzco (la posición) 0 y me devuelve la address del usuario
- Ahora, para emitir recompensas, el owner ya dispone de esos 10000 tokens Stellar
- Directamente con el issueTokens, clico y funciona!
