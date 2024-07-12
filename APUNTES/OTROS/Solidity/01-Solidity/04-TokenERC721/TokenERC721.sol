//SPDX-License_Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract erc721 is ERC721 {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokensIds;

    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}

    //envío de NFTS

    function sendNFT( address _account) public{
        _tokensIds.increment();

        uint256 newItemId = _tokensIds.current();
        _safeMint(_account, newItemId);
    }

}

