~~~~js
//SPDX-License_Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract  ArtToken is ERC721, Ownable{

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){}

    uint256 COUNTER;

    uint256 public fee = 5 ether;

    struct Art {

        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;

    }

    Art [] public art_works;

    event NewArtWork (address indexed owner, uint256 id, uint256 dna);

    function _createRandomNum(uint256 _mod) internal view returns(uint256){
        bytes32 hash_randomNum= keccak256(abi.encodePacked(block.timestamp, msg.sender));

        uint256 randomNum = uint256(hash_randomNum);

        return randomNum % _mod;
    }

    function _createArtWork(string memory _name) internal{
        uint8 randRarity = uint8(_createRandomNum(1000));
        uint256 randDna = _createRandomNum(10**16);
        Art memory newArtWork = Art(_name, COUNTER, randDna, 1, randRarity);

        art_works.push(newArtWork);

        _safeMint(msg.sender, COUNTER);

        emit NewArtWork(msg.sender, COUNTER, randDna);
        COUNTER++;
    }

    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function infoSmartContract() public view returns(address, uint256){
        address SC_address = address(this);
        uint256 SC_money = address(this).balance / 10**18;

        return (SC_address, SC_money);

    }

    function getArtWorks() public view returns (Art [] memory){
        return art_works;
    }

    function getOwnerArtwork(address _owner)public view returns(Art [] memory){
        Art [] memory result = new Art[](balanceOf(_owner));

        uint256 counter_owner = 0;

        for (uint256 i = 0; i < art_works.length; i++){
            if (ownerOf(i)==_owner){
                result[counter_owner]= art_works[i];
                counter_owner ++;
            }
        }
        return result;
    }

    function createRandomArtWork(string memory _name) public payable{
        require(msg.value >= fee);
        _createArtWork(_name);
    }

    function  withdraw() external payable onlyOwner{
        address payable _owner = payable(owner());

        _owner.transfer(address(this).balance);
    }

    function levelUp(uint256 _artId) public{
        require(ownerOf(_artId)== msg.sender);

        Art storage art = art_works[_artId];

        art.level ++;
    }

}
~~~