// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {

  // minter's address
  address public minter;

  event MinterChanged(address accountFrom, address accountTo);
  event MintPost(address account, uint time, string postHash, string flag);
  event MintLike(address account, uint time, string postHash, string flag);
  event MintTag(address account, uint time, string postHash, string flag);
  event MintFollow(address account, uint time, string flag);
  event MintRespond(address account, uint time, string postHash, string originHash, string flag);
  event MintCurate(address account, uint time, string postHash, string originHash, string flag);
  event MintJury(address account, uint time, string postHash, string flag);

  constructor() public payable ERC20("uMe token", "UME") {
    // assign bank minter role
    minter = msg.sender;
  }

  function mintPost(address account, string memory _postHash, string memory _postText) public {
    // make sure minter is same as sender, which they would be if they've set up a ME token
    require(account==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    require(bytes(_postHash).length > 0, 'Error: no post exists'); // check if post hash exists
    require(bytes(_postText).length > 0, 'Error: no text in post'); // check if there's text in post
    // mint UME token for Posted
    _mint(address(account), 8);
    // set event for minted Posted UME tokens
    emit MintPost(account, block.timestamp, _postHash, 'POST');
  }
  function mintLike(address accountFrom, address accountTo, string memory _postHash) public { // 1:3 Liker:Liked
    require(accountFrom==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a LIKE token for liker
    _mint(address(accountFrom), 2);
    // set event for LIKE token FROM
    emit MintLike(accountFrom, block.timestamp, _postHash, 'LIKE');
    // mint LIKE tokens for likee
    _mint(address(accountTo), 4);
    // set event for LIKE token TO
    emit MintLike(accountTo, block.timestamp, _postHash, 'LIKE');
  }
  function mintTag(address accountFrom, address accountTo, string memory _postHash) public { // 1:3 Tagger:Tagged
    require(accountFrom==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    require(accountFrom!=accountTo, 'Error: same account');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a TAG token for tagger
    _mint(address(accountFrom), 1);
    // set event for TAG token FROM
    emit MintTag(accountFrom, block.timestamp, _postHash, 'TAG');
    // mint TAG tokens for taggee
    _mint(address(accountTo), 2);
    // set event for TAG token TO
    emit MintTag(accountTo, block.timestamp, _postHash, 'TAG');
  }
  function mintFollow(address accountFrom, address accountTo) public { // 1:3 Follower:Followed
    require(accountFrom==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    // mint a FOLLOW token for follower
    _mint(accountFrom, 1);
    // set event for FOLLOW token FROM
    emit MintFollow(accountFrom, block.timestamp, 'FOLLOW');
    // mint FOLLOW tokens for followed
    _mint(accountTo, 6);
    // set event for FOLLOW token TO
    emit MintFollow(accountTo, block.timestamp, 'FOLLOW');
  }
  function mintRespond(address accountFrom, address accountTo, string memory _postHash, string memory _originHash) public { // 2:4 Responder:Responded
    require(accountFrom==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    //require(minter==msg.sender, 'Error: wrong account '); // makes sure accounts exist
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a RESPOND token for responder
    _mint(accountFrom, 2);
    // set event for RESPOND token FROM
    emit MintRespond(accountFrom, block.timestamp, _postHash, _originHash, 'RESPOND FROM');
    // mint RESPOND tokens for responded
    _mint(accountTo, 4);
    // set event for RESPOND token TO
    emit MintRespond(accountTo, block.timestamp, _postHash, _originHash, 'RESPOND TO');
  }
  function mintCurate(address accountFrom, address accountTo, string memory _postHash, string memory _originHash) public { // 2:4 Responder:Responded
    require(accountFrom==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a CURATE token for curatee
    _mint(accountFrom, 2);
    // set event for CURATE token FROM
    emit MintCurate(accountFrom, block.timestamp, _postHash, _originHash, 'CURATE');
    // mint CURATE tokens for curator
    _mint(accountTo, 4);
    // set event for CURATE token TO
    emit MintCurate(accountTo, block.timestamp, _postHash, _originHash, 'CURATE');
  }

  function mintJury(address account, string memory _postHash, bool consensusReached) public { // 4 Juror token if no consensus reached, 24 if consensus reached
    require(account==msg.sender, 'Error: wrong account');
    require(minter!=msg.sender, 'Error: "we" cannot mint');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    if(consensusReached==true){
      // mint 10 JURY token for juror
      _mint(account, 24);
      // set event for JURY token consensus reached
      emit MintJury(account, block.timestamp, _postHash, 'JURY');
    } else if(consensusReached==false){
      // mint a JURY token for juror
      _mint(account, 4);
      // set event for JURY no consensus reached
      emit MintJury(account, block.timestamp, _postHash, 'JURY');
    }
  }

  //misread
  function passMinterRole(address we) public returns (bool) {
    require(msg.sender == minter, 'Error, only owner can change pass minter role');
    minter = we;

    emit MinterChanged(msg.sender, we);
    return true;
  }
}
