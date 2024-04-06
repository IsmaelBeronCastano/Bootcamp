# SENDING ETH TROUGH A FUNCTION AND REVERTS

- Vamos a trabajar con recibir fondos, enviar fondos y setear un minimo de fondos
- En una transferencia tengo 
  - Nonce: 
  - Gas Price: precio por unidad de gas (in wei) 
  - Gas Limit:  21000
  - To: address that the tx is sent to
  - Value amount of wei to send
  - Data: empty
  - v.r.s: components of tx signature
- Añadiendo **payable** a la función puedo acceder a la propiedad **VALUE** con msg.value
  - Uso **require** para marcar la obligatoriedad. Chequea que la condición se cumpla, si no enviará el string del segundo parámetro
  - 1e18 = 1 *10**18 == 1000000000000000000

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract FundMe{
  uint256 public number;

   
    function fund() public payable{
      //Quiero setear un minimo de fondos en USD
      //Cómo envio ETH a este contrato?
      
      number= 5; //cambiar number a 5 gasta GAS
        require(msg.value > 1e18, "Didn't send enough"); // si los fondos no son suficientes no cambiará number a 5
    }
    //function withdraw (){}
}
~~~

- Aunque hemos gastado GAS en cambiar a 5 number, el resto de GAS se retornará porque no se cumple la condición del require
- Entonces, **si el require no se cumple, toda transacción anterior se deshará**
- Oráculos como **Chain LInk** permiten introducir data del exterior en los smart contracts
- Em **docs.chain.link** accedo en **DATA FEEDs**/**Contract Addresses**/**Ethereum Data Feeds** en el apartado Proxy de la tabla obtengo las direcciones de los contratos que me proporcionan el valor en tiempo real del token/cripto que sea
- Tengo Pair: ADA / USD (cardano en USD), Type: Crypto, Proxy: 0xAE4c91d....
- En Using Data Feeds tengo un ejemplo de uso

~~~solidity
contract DataConsumerV3 {
    AggregatorV3Interface internal dataFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        dataFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43    //address from proxy value to get proce in real time
        );
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer, //extraes con desestructuración la respuesta que deseas
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
}
~~~

- **Chain Link keepers** son watchers que escuchan un contrato y las acciones que en este se producen
- **End-to-End Reiability** hace posible usar HTTP Request (GET, POST, etc)
- Caundo requerimos info de un node de ChainLink requerimos GAS o algun token de ChainLink
- En faucets.chain.lionk/kovan puedes enviarte a tu dirección **10 test tokens de Chain Link**
- En docs, en Link Token Contracts, copio la addres de la red Kovan, en Metamask, Import Tokens, en Token contract Address pego la dirección, Add custom Tokens, y Import Tokens
- Ahora puedo enviar Tokens de CHain Link
---------

## Trabajando con Chain Link

- Para convertir el ETH en USD para poder calvular el mínimo a enviar creo una función
- Para calcularlo con getPrice vamos a necesitar el ABI y la address del contrato
- Usaré la red de test Ethereum Mainnet, la ddress está en **chain link/ feed addresses** 
- Busco ETH/USD, copio la dirección
- En Compilation Details de REMIX tengo el **ABI**
- **NOTA:** hay **otra manera** de interactuar con los contratos **que no es con el ABI** pero por ahora lo haremos así
- Si miro en el contrato de **AgregatorV3INterface** tengo varias funciones como .version
- Para usar la interface puedo importarla de github
- **NOTA**: para que no de error en vscode hay que instalar @chainlink/contracts

> npm i @chainlink/contracts

- Y hay que mapear la ruta en el settings.json de vscode
- **NOTA**: en el caso de que fallara siempre puedo copiar y pegar el código del contrato en un archivo e importarlo desde mi directorio

~~~json
{
    "solidity.defaultCompiler": "remote", 
    "solidity.remappingsUnix": [
        "@uniswap/=node_modules/@uniswap/",
        "@openzeppelin/=node_modules/@openzeppelin/",
        "@chainlink/=node_modules/@chainlink"
    ]
      
}
~~~

- Ya no da error el import!
- Uso la interfaz para extraer los valores con desestructuración
- Casteo el precio a uint256 para evitar signos negativos
- Ahora puedo hacer la conversión de msg.value con otra función
- Divido entre 1e18 **para evitar que me devuelva 36 ceros**
- En Solidity siempre **multiplica primero y luego divide**

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe{

    uint256 public minimumUSD = 50 *1e18; //1 *10 **18 lo uso para poder compararlo con msg.value que tiene 18 decimales

    function fund() public payable{

        //DA ERROR si en REMIX en VALUE pongo 0!!!  VALUE aparece cuando pongo payable
       require(getConversionRate(msg.value)>= minimumUSD, "Didn't send enough!");
        //Esto me devolverá un valor con 18 decimales
        
    }

    //Obtener precio actual ETH en USD
    function getPrice() public view returns(uint256){
        //address 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419 de la red Ethereum de TEST para saber ETH/USD

        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        //mirar documentación para ver los datos disponibles en chain link / using data feedds
        
        //(uint80 roundId, int256 price, uint startedAt, uint timeStamp, uint80 answeredInRound )=priceFeed.latestRoundData();
        
        //si solo necesito el price puedo hacerlo asi
        (,int256 price,,,) = priceFeed.latestRoundData();
        //Esto devolvera ETH en USD (porque esa es la dirección del contrato)

        return uint256(price * 1e10);//casteo el precio para que no de un valor negativo

    }

    function getVersion () public view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        return priceFeed.version();
    }
    
    
    function getConversionRate(uint256 ethAmount) public view returns (uint256){
            uint256 ethPrice= getPrice();
            uint256 ethAmountInUSD = (ethPrice * ethAmount) /1e18; //divido entre 1e18 para que no me devuelva 36 ceros (+18 de msg.value)
            return ethAmountInUSD;                                 
    }
    
    //function withdraw (){}
}
~~~

- El problema es que el require da error si el VALU en REMIX lo dejo en 0 o pongo una cantidad menor a 50
- Usar el convertidor de WEI ETH, etc que hay en eth-converter.com
- Para calcular el minimo voy al precio actual de ETH en la web, ponle 3.000 USD
- Mi minimo son 50, hago 50/ 3000 = 0.016
- Con el convertidor miro que 0.016 ETH son 500000000 WEI (por decir algo)
- Si en VALUE en REMIX pongo este valor o superior si puedo hacer la transacción 
- Creo un **arreglo de direcciones**
- **msg.value** esta disponible en ETH o blockchains nativas
- **msg.sender** esta globalmente disponible. Es la dirección que está llamando esta función (de MetaMask, por ejemplo)
- Hago el mapping de la dirección con uint256 con la cantidad de dinero enviada

~~~solidity
uint256 public minimumUSD = 50 *1e18;

address[] public funders; 

mapping(address => uint256) public addressToAmountFounded;

  function fund() public payable{
    require(getConversionRate(msg.value)>= minimumUSD, "Didn't send enough!");
    funders.push(msg.sender);
    addressToAmountFounded[msg.sender] = msg.value;
    
}
~~~

- **RESUMEN:**
- Cuando trabajamos con un contrato necesitamos la dirección y el ABI, que me indica en qué posicion (como de un arreglo) estan las funciones, valores, etc
- La interfaz nos da un ABI minimalista con el que interactuar fuera de él
- Combinada con la dirección de un contrato, puedo llamar a funciones para obtener valores o lo que sea
- Hay que tener en cuenta estar trabajando en las unidades correctas según el valor devuelto (1e18, 1e10)
- Tenemos msg.value y msg.sender
- Se pueden consultar las variables disponibles en **docs.soliditylang.org/.../units-and-global-variables.html**
  