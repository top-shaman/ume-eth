// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {

  // minter's address
  address public minter;
  address public caller;

  // minter role has changed to We
  event MinterChanged(address indexed accountFrom, address indexed accountTo);
  event CallerChanged(address indexed accountFrom, address indexed accountTo);
  // minting events
  event Minted(address indexed account, uint time, string postHash, string flag);

  constructor() public payable ERC20("uMe token", "UME") {
    // assign minter & caller roles
    minter = msg.sender;
    caller = msg.sender;
  }

  function mintPost(address account, string memory _postHash, string memory _postText) public {
    // make sure minter is same as sender
    require(caller==msg.sender, 'Error: wrong account calling mint');
    require(minter!=account, 'Error: "we" cannot call mint');
    require(bytes(_postHash).length > 0, 'Error: no post exists'); // check if post hash exists
    require(bytes(_postText).length > 0, 'Error: no text in post'); // check if there's text in post
    // mint UME token for Posted
    _mint(address(account), 8);
    // set event for minted Posted UME tokens
    emit Minted(account, block.timestamp, _postHash, 'POST');
  }
  function mintLike(address accountFrom, address accountTo, string memory _postHash) public { // 2:5 Liker:Liked
    require(caller==msg.sender, 'Error: wrong account calling mint');
    require(accountFrom!=accountTo, 'Error: same account');
    require(minter!=accountFrom, 'Error: "we" cannot call mint');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a LIKE token for liker
    _mint(address(accountFrom), 2);
    // set event for LIKE token FROM
    emit Minted(accountFrom, block.timestamp, _postHash, 'LIKE');
    // mint LIKE tokens for likee
    _mint(address(accountTo), 5);
    // set event for LIKE token TO
    emit Minted(accountTo, block.timestamp, _postHash, 'LIKE');
  }
  function mintTag(address accountFrom, address accountTo, string memory _postHash) public { // 1:3 Tagger:Tagged
    require(caller==msg.sender, 'Error: wrong account');
    require(minter!=accountFrom, 'Error: "we" cannot call mint');
    require(accountFrom!=accountTo, 'Error: same account');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a TAG token for tagger
    _mint(accountFrom, 1);
    // set event for TAG token FROM
    emit Minted(accountFrom, block.timestamp, _postHash, 'TAG');
    // mint TAG tokens for taggee
    _mint(accountTo, 3);
    // set event for TAG token TO
    emit Minted(accountTo, block.timestamp, _postHash, 'TAG');
  }
  function mintFollow(address accountFrom, address accountTo) public { // 1:3 Follower:Followed
    require(caller==msg.sender, 'Error: wrong account');
    require(minter!=accountFrom, 'Error: "we" cannot call mint');
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    // mint a FOLLOW token for follower
    _mint(accountFrom, 1);
    // set event for FOLLOW token FROM
    emit Minted(accountFrom, block.timestamp, '0x0', 'FOLLOW');
    // mint FOLLOW tokens for followed
    _mint(accountTo, 6);
    // set event for FOLLOW token TO
    emit Minted(accountTo, block.timestamp, '0x0','FOLLOW');
  }
  function mintRespond(address accountFrom, address accountTo, string memory _postHash) public { // 2:4 Responder:Responded
    require(caller==msg.sender, 'Error: wrong account');
    require(minter!=accountFrom, 'Error: "we" cannot call mint');
    require(accountFrom!=accountTo, 'Error: same account');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a RESPOND token for responder
    _mint(accountFrom, 2);
    // set event for RESPOND token FROM
    emit Minted(accountFrom, block.timestamp, _postHash, 'RESPOND FROM');
    // mint RESPOND tokens for responded
    _mint(accountTo, 4);
    // set event for RESPOND token TO
    emit Minted(accountTo, block.timestamp, _postHash, 'RESPOND TO');
  }
  function mintCurate(address accountFrom, address accountTo, string memory _postHash) public { // 2:4 Responder:Responded
    require(caller==msg.sender, 'Error: wrong account');
    require(minter!=accountFrom, 'Error: "we" cannot mint');
    require(accountFrom!=accountTo, 'Error: same account'); // doesn't mint tokens if tagged oneself
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a CURATE token for curatee
    _mint(accountFrom, 2);
    // set event for CURATE token FROM
    emit Minted(accountFrom, block.timestamp, _postHash, 'CURATE');
    // mint CURATE tokens for curator
    _mint(accountTo, 4);
    // set event for CURATE token TO
    emit Minted(accountTo, block.timestamp, _postHash, 'CURATE');
  }

  function mintJury(address account, string memory _postHash, bool consensusReached) public { // 4 Juror token if no consensus reached, 24 if consensus reached
    require(caller==msg.sender, 'Error: wrong account');
    require(minter!=account, 'Error: "we" cannot mint');
    require(bytes(_postHash).length > 0, 'Error: no post exists');
    if(consensusReached==true){
      // mint 10 JURY token for juror
      _mint(account, 24);
      // set event for JURY token consensus reached
      emit Minted(account, block.timestamp, _postHash, 'JURY');
    } else if(consensusReached==false){
      // mint a JURY token for juror
      _mint(account, 4);
      // set event for JURY no consensus reached
      emit Minted(account, block.timestamp, _postHash, 'JURY');
    }
  }

  function passMinterRole(address we) public returns (bool) {
    require(msg.sender == minter, 'Error, only owner can change pass minter role');
    minter = we;

    emit MinterChanged(msg.sender, we);
    return true;
  }

  function passCallerRole(address timeline) public returns (bool) {
    require(msg.sender == caller, 'Error, only caller can pass minter role');

    caller = timeline;
    emit CallerChanged(msg.sender, timeline);
    return true;
  }
}
