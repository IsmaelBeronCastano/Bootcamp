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