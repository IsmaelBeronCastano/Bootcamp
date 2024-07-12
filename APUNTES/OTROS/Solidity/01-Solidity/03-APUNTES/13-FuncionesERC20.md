# Funciones elementales del ERC-20

- Como voy a sobreescribir la función transfer uso el override. Al ser virtual por defecto en la interface  puede ser sobreescrita
- De parámetros voy a necesitar la dirección de adónde va la transferencia y la cantidad
- Debo declarar el owner con el msg.sender ( la persona que está clicando esta función )
- Voy a usar una función interna que todavía no he programado. Se suele usar usa una barra baja
- Si todo a ído bien, la función padre devolverá un true

~~~js
    function transfer(address to, uint256 amount) public virtual override returns (bool){
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }
~~~

- Sigo con la función allowance. En los parámetros pongo el owner, quien va a dejar esos tokens y a quién (spender)
- Devuelve una cantidad
- Tengo un mapping que relaciona una dirección con otra dirección y una cantidad

>  mapping(address => mapping(address=> uint256)) private _allowances;

- La función transfer es para que nos devuelve la cantidad que se le dejó a dicha persona
- Con este mapping accedemos a la clave que es el owner y todo seguido accedo al valor que es otro mapping
    - Para saber la cantidad necesito saber quien es el spender
    - Accedo al mapping allowances con el primer mapping como clave el owner y como valor el segundo mapping con el spencer
~~~js
    function allowance(address owner, address spender) public view virtual override returns(uint256){
        return _allowances[owner][spender];
    }
~~~

- Este allowance me permite devolver el value (cuántos tokens) asignado a un spender por un owner
- El approve nos permite aprobar esta asignación, por ello necesitaré de parámetros el spender y la cantidad
- Declaro una función interna que todavía no he programado

~~~js
  function approve(address spender, uint256 amount)public virtual override returns (bool){
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true
    }
~~~

- Por último sobreescribiré la función transferFrom que tiene por parámetros desde dónde realizo la transfe, a dónde y cuánto
- Usaré dos funciones internas, con el emisor, receptor y la cantidad cómo parámetros
- Devolveré un true si todo ha ido bien
- El spender lo voy a necesitar en el _spendAllowance. Será la persona que podrá gastar los tokens asignados en el spendAllowance

~~~js
    function transferFrom( address from, address to, uint256 amount) public virtual override returns (bool){
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
~~~
----
# Modificando las asignaciones de Tokens

- allowance y approve asignan tokens a gastar. Allowance da la cantidad como valor de retorno, approve asigna dicha cantidad
- Puedo querer en un momento dado asignar más tokens (o menos) sin perder los que ya he asignado
- Necesito recoger el valor del mapping allowance donde se estipula qué cantidad le asigna el owner al spender
- Puedo añadirle el valor que quiero sumar directamente
- Hago la resta de tokens.
- Necesito saber el valor actual de tokens con el mapping _allowances y lo guardo en una variable
- Hago una comprobación con el require de no restar más tokens de los que hay actualmente
- unchecked sirve para ahorrar gas en terminos de comprobaciones internas de solidity
- Le resto la cantidad introducida

~~~js
    function increaseAllowance( address spender, uint256 addedValue) public virtual returns (bool){
        address owner = msg.sender;
        _approve(owner, spender, _allowances[owner][spender]+ addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 substrValue) public virtual returns (bool){
        address owner = msg.sender;
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >=  substrValue, "ERC20: decreased allowance below zero");
        unchecked{
            _approve(owner, spender, currentAllowance - substrValue);
            
        }
        return true;
    }
~~~
----
# Funciones internas

- Hay toda una serie de funciones internas que hay que programar
- _transfer:
    - Me aseguro que ninguna de las direcciones vengan vacías
    - Creo una función interna que se ejecutara previa a la transferencia de tokens llamada beforeTokenTransfer
    - Recojo el balance del emisor (del primer mapping que relaciona la dirección con el balance en la función balanceOf)
    - Debo comprobar que la cantidad es mayor a la que quiero transferir
    - Recojo en el nuevo balance el balance actual menos la cantidad que gasto (hago un update del balance que pasa a ser menor)
    - Y añado con un += a la dirección receptora
    - Emito el evento Transfer ( que lo tengo declarado en la interfaz y recibe el emisor , receptor y el valor que se transfiere)
    - Crearé otra función interna llamada _afterTokenTransfer para hacer algo después de la transferencia
    - Son unos hooks que harán falta para hacer la transferencia y se hará antes y después de la transferencia
~~~js
     function _transfer(address from, address to, uint256 amount ) internal virtual{
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer from the zero address");

        _beforeTokenTransfer(from, to , amount);
        uint256 fromBalance = _balances[from];

        require(fromBalance >= amount, "ERC20: transfer amount exceeds  balance");

        unchecked{
            _balances[from] = fromBalance - amount;
        }

        _balances[to] += amount;

        emit Transfer(from, to, amount); 

        _afterTokenTransfer(from, to, amount);  
    }
~~~
- Creo la función _mint, que me permitirá crear tokens ERC20 y los voy a asignar
- Filtro que la dirección sea distinta a 0
- Uso en el beforeTokenTransfer desde el address 0, lo voy a enviar a un account en particular y la cantidad 
- Necesito el totalSupply para incrementar la cantidad de tokens que el Smart Contract acaba de crear
- Actualizo el balance de tokens
- Emito el evento  Transfer desde un address 0 a una cuenta en concreto
- El address 0 hace de emisor en esta función mint 

~~~js
    function _mint(address account, uint amount) internal virtual{
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);
        _totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }
~~~

- Creo la función _burn. Esta ayudará a entender lo del address 0
- Esta función me permitirá destruir tokens
- Recibe una cuenta y una cantidad ( de tokens a destruir )
- Uso el beforeTokenTransfer porque el _burn está haciendo una transferencia pero a un fondo que no será utilizable, el address(0) con una cantidad específica
- Guardo en accountBalance el balance de la cuenta que esta actuando como emisor. La cuenta que va a quemar tokens
- Compruebo con un require que es un balance aceptado para la cantidad de tokens que quiero quemar
- Uso el unchecked para asignar un balance nuevo a la cuenta introducida. restándole la cantidad de tokens
- Decremeto el totalSupply
- Emito un evento Transfer con una dirección a otra dirección y una cantidad
- Cómo estoy realizando una transferencia uso el afterTokenTransfer 

~~~js

    function _burn(address account, uint256 amount) internal virtual{
        require(account != address(0), "ERC20: burn from the zero address");
        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20:  burn amount exceeds balance");

        unchecked{
            _balances[account] = accountBalance - amount;
        }

        _totalSupply -= amount; 

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }
~~~

- Qué es esto del address(0)? Es uan dirección todo 0's.
    - Se usa como un sitio en muchas funciones internas
    - Se usa para enviar una quema de tokens
    - este address 0 nunca será asignado a nadie

- _mint desde dónde genera estos tokens? Desde el address 0
-----
# Funciones internas _approve y _spendAllowance

- _approve: me va a permitir asignar una cantidad de tokens desde un owner a un spender
- Compruebo que el owner tiene una dirección diferente al address(0)
- Lo mismo para el spender
- Asigno al mapping _allowances que acoje el emisor y el receptor, una cantidad
- Emito el evento Approval

~~~js
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve from the zero address");

        _allowances[owner][spender] = amount;

        emit Approval(owner, spender, amount);
    }
~~~

- Ahora le toca a la función _spendAllowance
    - Esta función se usa en el transferFrom para gastar del _allowances al hacer una transferencia
    - allowance me devuelve el valor asignado  de un owner a un spender
    - Recojo en el currentAllowance el actual allowance de esta persona por un owner
    - Uso el if para determinar si este currentAllowance es distinto al máximo que se puede asignar
    - El currentAllowance deberá ser mayor a la cantidad que debo gastar
    - Uso el unchecked y mando el _approve en caso de que si se pueda

~~~js
    function _spendAllowance( address owner, address spender, uint256 amount) internal virtual{
        uint256 currentAllowance = allowance(owner, spender);

        if(currentAllowance != type(uint256).max){
            require(currentAllowance >= amount, "ERC20: insufficient allowance");

            unchecked{
                _approve(owner, spender, amount);
            }
        }
    }
~~~
- Es muy necesario que el emisor de _spendAllowance le envie al spender (msg.sender) dicha cantidad, se le permita gastarla
- Para hacer un envío con el transfer a otra persona, porque si no tiene ese saldo disponible no podrá enviar dinero a nadie
-----

# HOOKS DEL ERC20

- Declaro el _beforeTokenTransfer
- En esta función no voy a programar nada
- Este hook va a servir porque es virtual para ser reemplazado en caso de que herede este SC ERC20
- Cuando yo herede este ERC20, antes de realizar la transferencia se pueden realizar acciones
- Para hacerlo, en lugar de modificar el SC, se usa este hook para que se puedan poner las condiciones que se estimen oportunas antes de que se realicen las transferencias
- Lo mismo con el _afterTokenTransfer





