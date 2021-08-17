// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// contract for ME (User Token) with tokenized metadata from engagement

contract ME is ERC1155 {
  // user variable
  address public user;

  // ID's for ME's metadata tokens
  uint256 public constant POST = 0;
  uint256 public constant LIKE = 1;
  uint256 public constant TAG = 2;
  uint256 public constant FOLLOW = 3;
  uint256 public constant RESPOND = 4;
  uint256 public constant CURATE = 5;
  uint256 public constant JURY = 6;

  // minting events
  event MintPost(address account, uint mintTime, string postHash);
  event MintLike(address account, uint mintTime, string postHash);
  event MintTag(address account, uint mintTime);
  event MintFollow(address account, uint mintTime);
  event MintRespond(address account, uint mintTime, string postHash, string originHash);
  event MintCurate(address account, uint mintTime, string postHash, string originHash);
  event MintJury(address account, uint mintTime, string postHash);

  constructor() public payable ERC1155("{id}") {
    _mint(msg.sender, POST, 0, "");
    _mint(msg.sender, LIKE, 0, "");
    _mint(msg.sender, TAG, 0, "");
    _mint(msg.sender, FOLLOW, 0, "");
    _mint(msg.sender, RESPOND, 0, "");
    _mint(msg.sender, CURATE, 0, "");
    _mint(msg.sender, JURY, 0, "");
  }

  function mintPost(address account, string memory _postHash, string memory _postText) public {
    // make sure user is same as sender, which they would be if they've set up a ME token
    require(msg.sender==account, 'Error: no ME created yet');
    require(bytes(_postHash).length > 0, 'Error: no post exists'); // check if post hash exists
    require(bytes(_postText).length > 0, 'Error: no text in post'); // check if there's text in post
    // mint a POSTED token
    _mint(address(account), POST, 1, bytes(_postHash));
    // set event for minted POSTED token
    emit MintPost(account, block.timestamp, _postHash);
  }

  function mintLike(address accountFrom, address accountTo, string memory _postHash) public { // 1:3 Liker:Liked
    require(msg.sender==accountFrom, 'Error: no ME created yet'); // makes sure accounts exist
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if liked one's own post
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a LIKE token for liker
    _mint(address(accountFrom), LIKE, 1, bytes(_postHash));
    // set event for LIKE token FROM
    emit MintLike(accountFrom, block.timestamp, _postHash);
    // mint LIKE tokens for likee
    _mint(address(accountTo), LIKE, 3, bytes(_postHash));
    // set event for LIKE token TO
    emit MintLike(accountTo, block.timestamp, _postHash);
  }

  function mintTag(address accountFrom, address accountTo, string memory _postHash) public { // 1:3 Tagger:Tagged
    require(msg.sender==accountFrom, 'Error: no ME created yet'); // makes sure accounts exist
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    //increase like count
    //tagCount++;
    // mint a TAG token for tagger
    _mint(address(accountFrom), TAG, 1, bytes(_postHash));
    // set event for TAG token FROM
    emit MintTag(accountFrom, block.timestamp);
    // mint TAG tokens for taggee
    _mint(address(accountTo), TAG, 3, bytes(_postHash));
    // set event for TAG token TO
    emit MintTag(accountTo, block.timestamp);
  }

  function mintFollow(address accountFrom, address accountTo) public { // 1:3 Follower:Followed
    require(msg.sender==accountFrom, 'Error: no ME created yet'); // makes sure accounts exist
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    //increase like count
    //tagCount++;
    // mint a FOLLOW token for follower
    _mint(accountFrom, FOLLOW, 1, "");
    // set event for FOLLOW token FROM
    emit MintFollow(accountFrom, block.timestamp);
    // mint FOLLOW tokens for followed
    _mint(accountTo, FOLLOW, 3, "");
    // set event for FOLLOW token TO
    emit MintFollow(accountTo, block.timestamp);
  }

  function mintRespond(address accountFrom, address accountTo, string memory _postHash, string memory _originHash) public { // 1:2 Responder:Responded
    require(msg.sender==accountFrom, 'Error: no ME created yet'); // makes sure accounts exist
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a RESPOND token for responder
    _mint(accountFrom, RESPOND, 1, bytes(_postHash));
    // set event for RESPOND token FROM
    emit MintRespond(accountFrom, block.timestamp, _postHash, _originHash);
    // mint RESPOND tokens for responded
    _mint(accountTo, RESPOND, 2, bytes(_postHash));
    // set event for RESPOND token TO
    emit MintRespond(accountTo, block.timestamp, _postHash, _originHash);
  }

  function mintCurate(address accountFrom, address accountTo, string memory _postHash, string memory _originHash) public { // 1:4 Responder:Responded
    require(msg.sender==accountFrom, 'Error: no ME created yet'); // makes sure accounts exist
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a CURATE token for curatee
    _mint(accountFrom, CURATE, 1, bytes(_postHash));
    // set event for CURATE token FROM
    emit MintCurate(accountFrom, block.timestamp, _postHash, _originHash);
    // mint CURATE tokens for curator
    _mint(accountTo, CURATE, 2, bytes(_postHash));
    // set event for CURATE token TO
    emit MintCurate(accountTo, block.timestamp, _postHash, _originHash);
  }

  function mintJury(address account, string memory _postHash, bool consensusReached) public { // 1 Juror token if no consensus reached, 5if consensus reached
    require(msg.sender==account, 'Error: no ME created yet'); // makes sure accounts exist
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    if(consensusReached==true){
      // mint 10 JURY token for juror
      _mint(account, JURY, 5, bytes(_postHash));
      // set event for JURY token consensus reached
      emit MintJury(account, block.timestamp, _postHash);
    } else {
      // mint a JURY token for juror
      _mint(account, JURY, 1, bytes(_postHash));
      // set event for JURY no consensus reached
      emit MintJury(account, block.timestamp, _postHash);
    }
  }
}
