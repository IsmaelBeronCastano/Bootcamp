# DeFi

- Voy a necesitar varios SC que se comuniquen entre si para crear la DeFi
    - Un controlador/operador para la gestión del proyecto. Es el contrato principal
    - Token para realizar *staking* (poner los tokens a disposición de la blockchain para generar más bloques)
        - Cuando recupere estos tokens habrá unas ganancias
    - Token para recibir recompensas ( emitir tokens como recompensas del staking)
- Creo un contrato para cada uno
    - JamToken.sol (staking)
    - StellarToken.sol (recompensas)
    - TokenFarm.sol (principal, gestión)

- Primero crearé Jam y Stellar para luego crear el SC de gestión de estos
-----

# Token para realizar staking

- Hay que establecer un nombre, un símbolo, un totalSupply, etc
- Estoy creando un token sin usar un standard
- Declaro 1 * 10**24 que será un millón de tokens, ya que establezco 18 decimales

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.0;

contract JamToken {
    
    //Declaraciones

    string public name = "JAM Token";
    string public symbol = "JAM";
    uint256 public totalSupply= 1000000000000000000000000;
    uint8 public decimals = 18;
}
~~~

- Declaro el evento Transfer con la dirección indexada porque así podré filtrar y buscar por esta dirección la info
- También una dirección indexada del destinatario y un valor
- Declaro otro evento para la aprobación de un operador

~~~js
 //evento para la transferencia de tokens de un usuario

    event Transfer (address indexed _from, address indexed _to , uint256 _value);

    //evento para la aprobación de un operador

    event Approval ( address indexed _owner, address indexed _spender, uint256 _value);
~~~

- Para finalizar faltan las estructuras de datos y el constructor
- Creo un mapping para obtener el balance de una persona
- Creo otro mapping con otromapping para asociar una dirección (owner) con otra dirección (spender) y la cantidad de tokens que puede gastar

~~~js
 mapping(address => uint256) public balanceOf;
 mapping(address=>mapping(address=>uint256)) public allowance;
~~~

- Ahora en el constructor asigno el totalSupply a quien ejecuta el contrato (msg.sender)
~~~js
    constructor(){
        balanceOf[msg.sender] = totalSupply;
    }
~~~

----

# Funciones de control y transferencia de tokens

- Declaro la función transfer. Devolverá un boolean según se haya efectuado la transferencia correctamente o no
- Uso un require para asegurarme que el msg.sender tiene fondos
- Luego decremento su balance total
- Aumento el balance del _to con el valor
- Emito el evento Transfer con los parámetros
- Devuelvo un true

~~~js
    function transfer( address _to, uint256 _value) public returns(bool) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
~~~

- Sigo con una función de transferencia de tokens especificando el emisor
- Esta función me va a permitir si tengo los poderes asignados, enviar los tokens de otra persona
- Por ello debo aseguirarme también que la cantidad permitida es inferior al value
- Debo incrementar y decrementar el balance
- También debo decrementar el allowance
- Emito un evento Transfer y devuelvo un true

~~~js
    function transferForm(address _from, address _to, uint256 _value) public returns (bool){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
~~~

- Pero en qué momento he otorgado permisos para operar con tokens de otro? Ahora voya  crear la función
- Esta función asigna la cantidad aprobada para ser gastada por un operador

~~~js
    function approve(address _spender, uint256 _value) public returns(bool){
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }
~~~

-----

# JamToken.sol

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.0;

contract JamToken {
    
    //Declaraciones

    string public name = "JAM Token";
    string public symbol = "JAM";
    uint256 public totalSupply= 1000000000000000000000000;
    uint8 public decimals = 18;

    //evento para la transferencia de tokens de un usuario

    event Transfer (address indexed _from, address indexed _to , uint256 _value);

    //evento para la aprobación de un operador

    event Approval ( address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    constructor(){
        balanceOf[msg.sender] = totalSupply;
    }

    //Transferencia de tokens de un usuario

    function transfer( address _to, uint256 _value) public returns(bool) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //Aprobación  de una cantidad para ser gastada por un spender

    function approve(address _spender, uint256 _value) public returns(bool){
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }


    //transferencia de tokens especificando el emisor

    function transferForm(address _from, address _to, uint256 _value) public returns (bool){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
~~~

-----

# Token de emisión de recompensas del Staking

- Copio todas las lineas de código del JamToken y las copio en StellarToken
- Le cambio elnombre al contrato por StellarToken, el name y el symbol

----

# Smart Contract de gestión de la DeFi

- El TokenFarm me ayudará a gestionar/juntar los otros 2 SC para crear mi DeFi. En esta DeFi se hará staking y los usuarios recibirán recompensas por ello
- Importo el JamToken y el StellarToken
- Declaro el contrato y el nombre del contrato
- También el owner

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.0;

import "./JamToken.sol";
import "./StellarToken.sol";


contract TokenFarm{
    //declaraciones iniciales

    string public name = "Stellar Token Farm";
    address public owner;
}
~~~

- En este caso no puedo usar la herencia porque son contratos idénticos el JamToken y el StellarToken y habría conflicto con las funciones del mismo nombre
- Para evitar estos errores se importan de la siguiente forma

~~~js
   JamToken public jamToken;
    StellarToken public stellarToken;
~~~

- Necesitaré estructuras de datos. Por ejemplo todas esas personas que hagan staking las voy a guardar

> address [] stakers;

- Necesitaré mappings, por ejemplo el balance que tiene una persona haciendo staking
    - Otro que relacione una dirección con un booleano para saber si la persona ha hecho staking en algún momento
    - Otro mapping para saber si está haciendo staking en este momento

~~~js
    mapping(address=> uint256) public stakingBalance;
    mapping(address=> bool) public  hasStaked;
    mapping(address=> bool) public isStaking;
~~~

- Declaro el constructor que recibirá los dos SC
- Los establezco como las variables que tengo ya creadas. Necesito darles el despliegue de estos Sc.
- Este se hará previamente y así los recibiré
- necesito establecer el owner, que será el que está clicando

~~~js

    constructor(StellarToken _stellarToken, JamToken _jamToken){
        stellarToken = _stellarToken;
        jamToken = _jamToken;

        owner = msg.sender;
    }
~~~

----

# Staking en el Smart Contract principal

- Cuando se haga staking, estos tokens se van a a enviar a otro SC. A cual? Al TokenFarm que es quien gestiona  
- Creo la función de staking. Debo requerir que el _amount sea mayor de 0 porque si no no se puede operar
- Cómo hago la transferencia? Debo llamar al JamToken que tengo declarado como jamToken
- Debo actualizar el saldo del staking con stakingBalance incrementando su valor
- Hace falta guardar el usuario ( quien está haciendo staking ). Hay que comprobar si ha sido staker antes. Si lo ha sido no se guardará (porque ya está guardado)
- Con el simbolo de admiración hago la negación como en JS. Si es false, entra en la condición y lo agrego al array
- Actualizo el staking

~~~js
   function stakeTokens( uint _amount) public {
        //Se requiere una cantidad superior a 0
        require(_amount > 0, "La cantidad no puede ser menor a 0");

        //Transferir tokens al SC principal
        jamToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        //Guardar el staker

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //actualizo los valores del staking

        isStaking[msg.sender]= true;
        hasStaked[msg.sender] = true;
    }
~~~

----

# Devolución de los Tokens del Staking

- Debo verificar el saldo para poder extraerlo
- Se requiere una cantidad mayor a 0
- Realizo la transferencia usando jamToken.transfer para hacerlo desde este contrato, ya que cuando se quitan del stake vuelven al JamToken
- Se le va a devolver a quien clica todo el balance de golpe
- Cuando esto ocurre se realiza un RESET

~~~js
    function unstakeTokens() public{
        //verificar saldo para poder ser extraido

        uint balance = stakingBalance[msg.sender];

        //Se requiere una cantidad mayor a 0
        require( balance > 0, "El balance del staking es 0");

        //Transferencia de los tokens
        jamToken.transfer(msg.sender, balance);

        //RESET el balance de staking del usuario
        stakingBalance[msg.sender] = 0;

        //Actualizar estado staking

        isStaking[msg.sender] = false;
        hasStaked[msg.sender] = true;

    }
~~~

-----

# Emisión de las recompensas a los Stakers

- Ahora hace falta que el owner de este proyecto sea capaz de emitir las recompensas cuando el lo desee
- Crearé una función que permita la emisión de tokens de recompensa
- La función será publica pero será solo ejecutable por el owner. Por ello uso require ( se podría hacer con un modificador también )
- Emitir tokens a todos los stakers actuales con un bucle for
- Los tokens de recompensa son los StellarTokens
- Creo una dirección que será la posición i que esté en el  bucle del array
- Necesito el balance del receptor, lo declaro uint balance
- Tengo que comprobar que el balance sea mayor a 0 para que en el momento de recibir la recompensa estén haciendo staking
- Uso el stellarToken.transfer para hacer la transferencia del balance. ASí cuanto más se deposite en staking, mayor será la recompensa

~~~js
    function issueTokens() public {
        //Unicamente ejecutablepor el owner
        require(msg.sender == owner, "No eres el owner");

        for( uint i = 0; i < stakers.length; i++ ){

            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                stellarToken.transfer(recipient, balance );
            }
        }
    }
~~~

---

# TokenFarm.sol

~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.0;

import "./JamToken.sol";
import "./StellarToken.sol";


contract TokenFarm{
    //declaraciones iniciales

    string public name = "Stellar Token Farm";
    address public owner;

    JamToken public jamToken;
    StellarToken public stellarToken;

    address [] public stakers;

    mapping(address=> uint256) public stakingBalance;
    mapping(address=> bool) public  hasStaked;
    mapping(address=> bool) public isStaking;

    constructor(StellarToken _stellarToken, JamToken _jamToken){
        stellarToken = _stellarToken;
        jamToken = _jamToken;

        owner= msg.sender;
    }

    //Stake de tokens

    function stakeTokens( uint _amount) public {
        //Se requiere una cantidad superior a 0
        require(_amount > 0, "La cantidad no puede ser menor a 0");

        //Transferir tokens al SC principal
        jamToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        //Guardar el staker

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //actualizo los valores del staking

        isStaking[msg.sender]= true;
        hasStaked[msg.sender] = true;
    }

    //Quitar el staking de los tokens

    function unstakeTokens() public{
        //verificar saldo para poder ser extraido

        uint balance = stakingBalance[msg.sender];

        //Se requiere una cantidad mayor a 0
        require( balance > 0, "El balance del staking es 0");

        //Transferencia de los tokens
        jamToken.transfer(msg.sender, balance);

        //RESET el balance de staking del usuario
        stakingBalance[msg.sender] = 0;

        //Actualizar estado staking

        isStaking[msg.sender] = false;
        hasStaked[msg.sender] = true;

    }

    function issueTokens() public {
        //Unicamente ejecutablepor el owner
        require(msg.sender == owner, "No eres el owner");

        for( uint i = 0; i < stakers.length; i++ ){

            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                stellarToken.transfer(recipient, balance );
            }
        }
    }
}

~~~




























































