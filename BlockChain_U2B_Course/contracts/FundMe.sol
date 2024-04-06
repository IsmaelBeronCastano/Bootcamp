//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './PriceConverter.sol';
error notOwner();

contract FundMe{

    using PriceConverter for uint256;

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders; 

    mapping(address => uint256) public addressToAmountFounded;

    address public immutable i_owner;
    
    constructor(){
        i_owner = msg.sender;    
    }

    function fund() public payable{
        require(msg.value.getConversionRate() >= minimumUSD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFounded[msg.sender] += msg.value;
        
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

    modifier onlyOwner {
    _;
    //require(msg.sender ==i_owner, "Sender is not the owner");
    if(msg.sender != i_owner){
        revert notOwner();
    }    
}

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }
}