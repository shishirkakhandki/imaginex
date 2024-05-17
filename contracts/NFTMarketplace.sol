// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    uint256 public listPrice = 0.001 ether;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMarketplace", "NFTM") {
    }

    function updateListPrice(uint256 _listPrice) external onlyOwner {
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createListedToken(newTokenId, price);
        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        require(price > 0, "Make sure the price isn't negative");

        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            true
        );

        emit TokenListedSuccess(
            tokenId,
            msg.sender,
            msg.sender,
            price,
            true
        );
    }
    
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
    
        for(uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            tokens[i] = idToListedToken[currentId];
        }
        return tokens;
    }
    
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;

        for(uint i = 0; i < totalItemCount; i++) {
            if(idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                itemCount++;
            }
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        uint currentIndex = 0;
        
        for(uint i = 0; i < totalItemCount; i++) {
            if(idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                items[currentIndex] = idToListedToken[i + 1];
                currentIndex++;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        _transfer(seller, msg.sender, tokenId);

        payable(owner()).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }
}
