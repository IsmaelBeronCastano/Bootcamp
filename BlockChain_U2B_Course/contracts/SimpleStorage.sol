//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SimpleStorage{
    //Types: boolean, uint (siempre positivo), int (positivo o negativo), address, string, bytes

    uint256 favoriteNum;

    struct People {
    string name;
    uint256 favoriteNum;
    }

    mapping(string=>uint256) public nameToFavoriteNum;

    People[] public people;      //Puedo especificar el num de elementos con People[n]  


    function retrieve() public view returns(uint256){
        return favoriteNum;
  }
  
  function getPeople() external view returns(People[] memory){
    return people;
}

    function store(uint256 _favoriteNum) public virtual{
        favoriteNum = _favoriteNum;
    }



    function addPerson(string memory _name, uint256 _favoriteNum) public{
        people.push(People(_name, _favoriteNum)); //no necesita memory
        nameToFavoriteNum[_name] = _favoriteNum; //asigno números al nombre dado en un mapping
    }  
}