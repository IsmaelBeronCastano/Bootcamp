## Constructor

- Podemos usar el constructor para que solo el propietario del contrato pueda introducir parámetros
- Para hacer que la función withdraw solo la pueda usar el propietario del contrato, creamos una variable global owner
- Guardamos msg.sender en el constructor
- Ahora puedo usar require dentro de la función para que ejecute el código de manera condicional

~~~solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './PriceConverter.sol';

contract FundMe{

    using PriceConverter for uint256;

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders; 

    mapping(address => uint256) public addressToAmountFounded;

    address public owner;

    //CONSTRUCTOR!!!!    
    constructor(){
        owner = msg.sender;    
    }

    function fund() public payable{
        require(msg.value.getConversionRate() >= minimumUSD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFounded[msg.sender] += msg.value;
        
    }

       function withdraw() public{
        require(msg.sender == owner, "sender is not the owner"); //SOLO SIGUE EL cÓDIGO SI EL msg.sender ES EL OWNER
        
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFounded[funder] = 0;
        }

        funders = new address[] (0);
                                        //this hace referencia a este contrato
        payable(msg.sender).transfer(address(this).balance); //tengo que castear msg.sender a payable

        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send failed");

        (bool callSucess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");

        function callMeRightAway(){

        }
    }
}
~~~

- Si necesitamos hacerlo en varias funciones podemos usar **modificadores** para no estar repitiendo código.

~~~solidity
modifier onlyOwner {
    require(msg.sender == owner, "Sender is not the owner");
    _; //este _ representa "haz el resto del código"    
}
~~~

- Si colocara el _; antes del require, le estaría diciendo a solidity que primero ejecute el código que hay en la función y luego el rquire

~~~solidity
modifier onlyOwner {
    _;
    require(msg.sender == owner, "Sender is not the owner");
    
}

 function withdraw() public onlyOwner {
       
        
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFounded[funder] = 0;
        }

        funders = new address[] (0);
                                        //this hace referencia a este contrato
        payable(msg.sender).transfer(address(this).balance); //tengo que castear msg.sender a payable

        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send failed");

        (bool callSucess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");


    }
~~~

- **Quien hace el deploy del contrato es el owner**
- Haciendo el cálculo ETH vale 3.000 USD, el mínimo que he estipulado son 50, entonces 50/3000 = 0.02 ETH(aprox)
- Voy al conversor y pongo 0.02 ETH y me da 10000000000 (nose) WEI
- Se lo paso como valor al contrato en REMIX, le doy a la función fund (que está en botón rojo)
- Estoy usando una red de test conectada a metamask
- En el caso de rinkby (rede de eth de test) se puede acceder  a rinkeby.etherscan con la dirección del contrato y puedo ver la info de la transacción
