# LIBRERÍAS

- Las librerías son similares a los contratos, pero **no puedes declarar variable de estado y no puedes enviar ether**
- Con las librerías podemos hacer cosas como **msg.value.getConversionRate()**, añadiéndole funcionalidad a las variables
- Creo un nuevo contrato PriceConverter.sol
- Cojo getPrice, getVersion y getConversionRate y las copio
- Las fucniones tienen que ser internal

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


library PriceConverter{

    function getPrice() internal view returns(uint256){
        //address 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419 de la red Ethereum de TEST para saber ETH/USD 

        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        
        (,int256 price,,,) = priceFeed.latestRoundData();

        return uint256(price * 1e10);
    }

    function getVersion () internal view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        return priceFeed.version();
    }
    
    
    function getConversionRate(uint256 ethAmount) internal view returns (uint256){
            uint256 ethPrice= getPrice();
            uint256 ethAmountInUSD = (ethPrice * ethAmount) /1e18; 
            return ethAmountInUSD;                                 
    }
}
~~~

- Utilizando la palabra reservada **using** y el nombre del contrato asignándolo al tipo de dato, puedo usarla
- getConversionRate necesita un parámetro ethAmount
- msg.value.getConversionRate es lo mismo que getConversionRate(msg.value)
- Las otras dos funciones no necesitan parámetros

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './PriceConverter.sol';

contract FundMe{

    using PriceConverter for uint256; //especifico el tipo al que le quiero aplicar los métodos de la librería

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders; 

    mapping(address => uint256) public addressToAmountFounded;

    function fund() public payable{
        require(msg.value.getConversionRate() >= minimumUSD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFounded[msg.sender] += msg.value;
        
    }

    //function withdraw (){}
}
~~~

- No da error porque **considera msg.value como primer parámetro** de la función getConversionRate
----

## SafeMath, Overflow Checking, and the uncheked keyword

- SafeMath es una librería comunmente utilizada
- Si creo un número y solidity está por debajo de solidity 0.6, incorporaron el unchecked
- En este caso, si accedo a la función add desde el exterior, al estar el numero unchecked lo reseta a 0

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract  SafeMathTester {

uint8 public bigNumber = 255; //unchecked
    
    function add () public {
        bigNumber = bigNumber +1;
    }
}
~~~

- Para eso está SafeMath, para envolver este número y decirle a solidity de que este número tiene este valor
- A partir de la versión 0.8 ya se chequea solo, pero se puede usar unchecked si interesa

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract  SafeMathTester {

uint8 public bigNumber = 255; //unchecked
    
    function add () public {
        unchecked(bigNumber = bigNumber +1);
    }
}
~~~

- unchecked hará tu código más eficiente en cuanto consumo de GAS
- Puedo usar un bucle for para recorrer un array de direcciones

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './PriceConverter.sol';

contract FundMe{

    using PriceConverter for uint256;

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders; 

    mapping(address => uint256) public addressToAmountFounded;

    function fund() public payable{
        require(msg.value.getConversionRate() >= minimumUSD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFounded[msg.sender] += msg.value;
        
    }

       function withdraw() public{
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFounded[funder] = 0;
        }
    }
}
~~~

- Para resetear un array podemos hacerlo de la siguiente forma

~~~solidity
    function withdraw() public{
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFounded[funder] = 0;
        }
        //reset array. En el paréntesis se indica el número de elementos
        funders = new address[] (0) 
     }
~~~
----

## Enviando ETH desde un contrato

- Hay **3 maneras de hacerlo**
  - **transfer**: 2300 GAS, throws error
  - **send**: 2300 GAS, returns bool
  - **call**: forward all GAS or set GAS, returns bool
- transfer

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './PriceConverter.sol';

contract FundMe{

    using PriceConverter for uint256;

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders; 

    mapping(address => uint256) public addressToAmountFounded;

    function fund() public payable{
        require(msg.value.getConversionRate() >= minimumUSD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFounded[msg.sender] += msg.value;
        
    }

       function withdraw() public{
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFounded[funder] = 0;
        }

        funders = new address[] (0);
                                        //this hace referencia a este contrato
        payable(msg.sender).transfer(address(this).balance); //tengo que castear msg.sender a payable

        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send failed");

        payable(msg.sender).call{value: address(this).balance}("");
    }
}
~~~

- Un buen sitio de consultas es **solidity-by-example.org**
- Con **send** tengo que comprobar que el booleano que devuelve sea true, porque si no no revertirá el gasto si hay un error

~~~solidity
bool sendSuccess = payable(msg.sender).send(address(this).balance);
require(sendSuccess, "Send failed")
~~~

- Con **call** podemos llamar a cualquier función de Ethereum. Es de bajo nivel
- Devuelve un boolean en callSuccess, y si devuelve algún dato lo hace en dataReturned

~~~solidity
(bool callSucess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");
~~~ 

- Si solo me interesa el callSuccess dejo la coma

~~~solidity
(bool callSucess,) = payable(msg.sender).call{value: address(this).balance}("");
require(callSuccess, "Call failed")
~~~
