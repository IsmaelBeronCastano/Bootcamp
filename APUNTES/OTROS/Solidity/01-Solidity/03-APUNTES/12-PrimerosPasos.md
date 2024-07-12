# Token ERC20 en OpenZeppelin

- Es un standard.
- Se hace una importación
- Estos tokens ERC20 también reciben importaciones
- En REMIX hacer la importacion desde github de OpenZepelin

> // ERC-20:  https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol

- En vscode importarlo de @openzeppelin previamente instalado con npm
- Añadir esta importación también a REMIX

> import  "@openzeppelin/contracts/token/ERC20/ERC20.sol";  

- Puedo crear un contrato haciendo uso de este ERC20

~~~js
contract GLDToken is ERC20{
    constructor(uint256 initialSupply) ERC20("Gold", "GLD"){
        _mint(msg.sender, initialSupply)
    }
}
~~~

- Esto me pregunta cuantos tokens quiero crear, le pongo 1000
- Hago el deploy, veo que tengo varios contratos de ERC20 de openzeppelin
- Aparecen varias funciones que puedo llamar
- Pero mejor... voy a crear un ERC20 desde cero !!
----
 # PRIMEROS PASOS EN LA CREACION DEL TOKEN ERC20 (INTERFAZ)

- Que es una interfaz?
- Es lo primero que voy a necesitar. 
- Su objetivo es ser interoperable en muchas aplicaciones: wallets, exchange, etc
- Cualquier código que necesite el token puede usar la misma definición en la interfaz
    - Esto lo hace compatible y permite conectar con cualquier aplicación
- Se declara con la palabra reservada interface
- Declaro una función para la cantidad total de tokens llamada totalSupply
- Declaro otra función para el balance que determine cuantos tokens tiene en la cuenta. Será un valor guardado en la blockchain 
- Necesito una función que me permita transferi tokens hacia una dirección con una cantidad
    - esta devuelve un booleano, si la operación tuvo éxito o no
~~~js
interface IERC20{
    
    function totalSupply() external view returns(uint256);

    function balanceOf( address account) external view returns (uint256);

    function transfer(address _to, uint256 _amount) external returns(bool);
}
~~~

- Las funciones de allowance permiten a otro usuario gastar parte de mis tokens
- La función approve determina qué cantidad
- TransferFrom me permite decir desde qué dirección se envían los tokens
    - Cómo parámetros tengo desde dónde, a dónde y qué cantidad
    - Lo único que cambia es que ahora tengo un from desde el que puedo indicar desde dónde envío los tokens

~~~js
 function allowance( address owner, address spender) external view returns(uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns(bool);
~~~

- Los eventos me permiten emitir info a la blockchain
    - El evento Transfer: va a contener esa info cuando se transfieran tokens ERC20
    - El evento Approval: se va a emitir cuando se realice una asignación de un spender
- Voy a poder filtrar los argumentos a través de indexación con la palabra indexed

~~~js
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
~~~

- Hasta ahora las funciones solo han sido declaradas. Hay que programarlas.
- Salgo de la interfaz y creo un contrato que llamaré ERC20 que heredará la interfaz IERC20

~~~js
contract ERC20 is IERC20{}
~~~

- Una vez instanciado, voy a crear las estructuras de datos
    - Primero un mapping, para relacionar una dirección con su balance;
    - Otro mapping para las designaciones de los permisos de un owner a un spender
        - Puedo hacer un mapping de otro mapping donde la dirección se asocia a la cantidad que puede gastar
~~~js
contract ERC20 is IERC20 {

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address=> uint256)) private _allowances;

}
~~~

- Ahora voy a necesitar las siguientes variable dentro del contract
    - _totalSupply: private. La cantidad de Tokens que tiene el smart contract emitido
    - _name: private. Un nombre para el token ERC20
    - _symbol: private. Un símbolo para identificar a mi token ERC20

~~~js
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
~~~
- Hay unas propiedades que definen a este SC(ERC20)
- Voy a necesitar establecer dichas propiedades en el despliegue. Para ello usaré el constructor
    - Que me permita que estas propiedades se asignen correctamente en el despliegue del SC
- Estos parámetros que el usuario va a incorporar al ERC20 debo guardarlos en las variables declaradas anteriormente de uso interno

~~~js
  constructor(string memory name_, string memory symbol_){
        _name = name_;
        _symbol = symbol_;
    }
~~~

- Ahora ya tiene el nombre y el símbolo del ERC20
- Es el turno de las funciones para obtener dicho nombre y simbolo
    - Aunque el nombre sea privado puedo establecer una función pública para que me devuelva dicho nombre

~~~js
  function name() public view returns (string memory){
        return _name;
    }
~~~

- Entra un nuevo concepto llamado virtual
- Dentro de la interfaz todas las funciones se consideran de tipo virtual
- La palabra reservada virtual se usa cuando creo funciones fuera de la interfaz sin implementación
- Por lo tanto debo usarla en la funcion name anterior y en la symbol, ya que estan fuera de la interfaz, en el contrato

~~~js
  function name() public view virtual returns (string memory){
        return _name;
    }

    function symbol() public view virtual returns (string memory){
        return _symbol;
    }
~~~

- Nuevo concepto: decimales
- Este nuevo concepto me va a permitir devolver el número de decimales utilizados para obtener una representación de los tokens ERC20
- Devuelvo 18 como es el standard

~~~js
function decimals() public view virtual returns(uint8){
        return 18;
    }
~~~

- Esto es lo mismo que decir

> cantidad  / 10 ** 18

- Así se implementan los decimales en una unidad divisible como son los ERC20. Los NFTS no son divisibles, por ejemplo
- Creo la función pública para devolver la cantidad total de tokens
- Se usa la palabra reservada override. 
- Una función que permite que un contrato de herencia anule su comportamiento de maracará en virtual. La función que anula esa función base debe marcarse como override.
- Hago una función pública para saber el balance de una cuenta

~~~js
    function totalSupply()public view virtual override returns(uint256){
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override(uint256){
        return _balances[account];
    }
~~~
- El virtual se escribe en funciones que voy a poder reescribir más tarde
- Cuando se reescribe esa función deberá mencionarse que se está sobreescribiendo esa función, por eso override
- Override está en estas dos funciones porque se han establecido previamente en la interfaz
- En la interfaz, todas las funciones son virtual por defecto, no hace falta declararlas virtual
