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







