//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

contract data_structures {
    
    // Estructura de datos
    struct Customer{
        uint256 id;
        string name;
        string email;
    }

    // Variable de tipo cliente

    Customer customer_1 = Customer(1, "Migue", "migue@gmail.com");

    uint256 [5] public fixed_list_uints = [1,2,3,4,5];

    uint256 [] dynamic_list_uint;

    Customer [] public dynamic_list_customer;

    function array_modification(uint256 _id, string memory _name, string memory _email) public {
        
        Customer memory random_customer = Customer(_id, _name, _email);

        dynamic_list_customer.push(random_customer);
    }

    mapping(address => uint256) public address_uint;

    mapping(string=> uint256 []) public string_listUints;

    mapping(address => Customer) public address_customer;

    function assignNumber (uint256 _number) public{
        address_uint[msg.sender] = _number;
    }

    function assignList ( string memory _name, uint256 _number) public{
        string_listUints[_name].push(_number);
    }

    function assignDataStructure(uint _id, string memory _name, string memory _email) public{
        address_customer[msg.sender] = Customer(_id, _name, _email);
    }


}