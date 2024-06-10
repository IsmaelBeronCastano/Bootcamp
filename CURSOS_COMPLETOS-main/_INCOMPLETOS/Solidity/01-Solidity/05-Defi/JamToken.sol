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

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

}