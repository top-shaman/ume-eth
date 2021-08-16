// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// contract for ME (User Token) with tokenized metadata from engagement

contract ME is ERC1155 {
  // user variable
  address public user;
  uint public postCount = 0;
  uint public likeCount = 0;
  uint public taggedCount = 0;
  uint public followedCount = 0;
  uint public juriedCount = 0;

  // ID's for ME's metadata tokens
  uint256 public constant POSTED = 0;
  uint256 public constant LIKED = 1;
  uint256 public constant TAGGED = 2;
  uint256 public constant FOLLOWED = 3;
  uint256 public constant JURIED = 4;

  // metadata tokens' internal ID's
  mapping(uint => string) public postId;
  mapping(uint => string) public likedId;
  mapping(uint => string) public taggedId;
  mapping(uint => string) public followedId;
  mapping(uint => string) public juriedId;

  // minting events
  event MintPost(address account, uint postId, uint mintTime,


  construtor() public payable ERC1155() {
    user = msg.sender;
    _mint(msg.sender, POSTED, 0, "");
    _mint(msg.sender, LIKED, 0, "");
    _mint(msg.sender, TAGGED, 0, "");
    _mint(msg.sender, FOLLOWED, 0, "");
    _mint(msg.sender, JURIED, 0, "");
  }

  function mintPost(address account, string memory _postHash, string memory _postText) public {
    // make sure user is same as sender, which they would be if they've set up a ME token
    require(user==msg.sender && user == account, 'Error: no ME created yet');
    require(bytes(_postHash).length > 0, 'Error: no post exists'); // check if post hash exists
    require(bytes(_postText).length > 0, 'Error: no text in post'); // check if there's text in post

    postCount++;
    // mint a POSTED token
    _mint(address(user), 0, 1, bytes(_postHash));
    // set event for minted POSTED token
    emit MintPost(account, postCount, block.timestamp, _postHash);
  }
}
