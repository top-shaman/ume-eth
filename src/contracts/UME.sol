// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {

  // minter's address
  address public minter;
  address public memeFactorySigner;
  address public postSigner;
  address public likeSigner;
  address public followSigner;
  address public boostSigner;

  // minter role has changed to We
  event MinterChanged(address indexed from, address indexed to);
  event PostSignerChanged(address indexed from, address indexed to);
  event MemeFactorySignerChanged(address indexed from, address indexed to);
  event LikeSignerChanged(address indexed from, address indexed to);
  event FollowSignerChanged(address indexed from, address indexed to);
  // minting events
  event Minted(address indexed account, uint time, string flag);

  constructor() public payable ERC20("uMe token", "UME") {
    // assign minter & caller roles
    minter = msg.sender;
    postSigner = msg.sender;
    memeFactorySigner = msg.sender;
    likeSigner = msg.sender;
    followSigner = msg.sender;
    boostSigner = msg.sender;
  }

  function mintPost(
    address _account,
    string memory _postText
  ) public {
    // make sure minter is same as sender
    require(
      postSigner==msg.sender,
      'Error: wrong _account calling mint');
    //require(minter!=_account, 'Error: "we" cannot call mint');
    //require(bytes(_postHash).length > 0, 'Error: no post exists'); // check if post hash exists
//    require(
//      bytes(_postText).length > 0,
//      'Error: no text in post'); // check if there's text in post
    // mint UME token for Posted
    _mint(address(_account), 8);
    // set event for minted Posted UME tokens
    emit Minted(_account, block.timestamp /*, _postHash  */ , 'POST');
  }
  function mintLike(
    address _from,
    address _to
  ) public { // 2:5 Liker:Liked
    require(
      likeSigner==msg.sender,
      'Error: wrong account calling mint');
//    require(
//      _from!=_to,
//      'Error: same account');
//    require(
//      minter!=_from,
//      'Error: "we" cannot call mint');
    //require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a LIKE token for liker
    _mint(address(_from), 2);
    // set event for LIKE token FROM
    emit Minted(_from, block.timestamp /*, _postHash  */ , 'LIKE');
    // mint LIKE tokens for likee
    _mint(address(_to), 5);
    // set event for LIKE token TO
    emit Minted(_to, block.timestamp /*, _postHash  */ , 'LIKE');
  }
  function mintTag(
    address _from,
    address _to
  ) public { // 1:3 Tagger:Tagged
    require(
      memeFactorySigner==msg.sender,
      'Error: wrong account');
//    require(
//      minter!=_from,
//      'Error: "we" cannot call mint');
//    require(
//      _from!=_to,
//      'Error: same account');
    // mint a TAG token for tagger
    _mint(_from, 1);
    // set event for TAG token FROM
    emit Minted(_from, block.timestamp /*, _postHash  */ , 'TAG');
    // mint TAG tokens for taggee
    _mint(_to, 3);
    // set event for TAG token TO
    emit Minted(_to, block.timestamp /*, _postHash  */ , 'TAG');
  }
  function mintFollow(
    address _from,
    address _to
  ) public { // 1:3 Follower:Followed
    require(
      followSigner==msg.sender,
      'Error: wrong account');
//    require(
//      minter!=_from,
//      'Error: "we" cannot call mint');
//    require(
//      _from!=_to,
//      'Error: same account'); // doesn't mint tokens if tagged oneself
    // mint a FOLLOW token for follower
    _mint(_from, 1);
    // set event for FOLLOW token FROM
    emit Minted(_from, block.timestamp, 'FOLLOW');
    // mint FOLLOW tokens for followed
    _mint(_to, 6);
    // set event for FOLLOW token TO
    emit Minted(_to, block.timestamp,'FOLLOW');
  }
  function mintRespond(
    address _from,
    address _to
  ) public { // 2:4 Responder:Responded
    require(
      memeFactorySigner==msg.sender,
      'Error: wrong account');
//    require(
//      minter!=_from,
//      'Error: "we" cannot call mint');
//    require(
//      _from!=_to,
//      'Error: same account');
    // mint a RESPOND token for responder
    _mint(_from, 2);
    // set event for RESPOND token FROM
    emit Minted(_from, block.timestamp, 'RESPOND FROM');
    // mint RESPOND tokens for responded
    _mint(_to, 4);
    // set event for RESPOND token TO
    emit Minted(_to, block.timestamp, 'RESPOND TO');
  }
  function mintCurate(
    address _from,
    address _to
  ) public { // 2:4 Responder:Responded
    require(
      memeFactorySigner==msg.sender,
      'Error: wrong account');
//    require(
//      minter!=_from,
//      'Error: "we" cannot mint');
//    require(
//      _from!=_to,
//      'Error: same account'); // doesn't mint tokens if tagged oneself
    //require(bytes(_postHash).length > 0, 'Error: no post exists');
    // mint a CURATE token for curatee
    _mint(_from, 2);
    // set event for CURATE token FROM
    emit Minted(_from, block.timestamp, 'CURATE');
    // mint CURATE tokens for curator
    _mint(_to, 4);
    // set event for CURATE token TO
    emit Minted(_to, block.timestamp, 'CURATE');
  }
  function mintRepost(
    address _from,
    address _to
  ) public {
    require(
      postSigner==msg.sender,
      'Error: wrong account');
//    require(
//      minter!=_from,
//      'Error: "we" cannot mint');
//    require(_from!=_to, 'Error: same account');
    //mint REPOST token for reposter
    _mint(_from, 5);
    // set event for REPOST from
    emit Minted(_from, block.timestamp, 'REPOST');
    // mint REPOST token for original poster
    _mint(_to, 6);
    // set event for REPOST to
    emit Minted(_from, block.timestamp, 'REPOST');
  }
  /*
  function mintJury(
    address account,
    bool consensusReached
  ) public { // 4 Juror token if no consensus reached, 24 if consensus reached
    require(
      followSigner==msg.sender,
      'Error: wrong account, needs to be signer');
    require(
    minter!=account,
    'Error: "we" cannot mint');
    //require(
    bytes(_postHash).length > 0,
    'Error: no post exists');
    if(consensusReached==true){
      // mint 10 JURY token for juror
      _mint(account, 24);
      // set event for JURY token consensus reached
      emit Minted(account, block.timestamp, 'JURY');
    } else if(consensusReached==false){
      // mint a JURY token for juror
      _mint(account, 4);
      // set event for JURY no consensus reached
      emit Minted(account, block.timestamp, 'JURY');
    }
  }
*/
  function burn(address _account, uint _amount) public {
    require(
      msg.sender==boostSigner,
      'Error: burner must be boost-signer');
//    require(
//      minter!=_account,
//      'Error: "we" cannot call burn');
    _burn(_account, _amount);
  }
  function passMinterRole(address _we) public returns (bool) {
    require(
      msg.sender==minter,
      'Error: only deployer can change pass minter role');
    minter = _we;

    emit MinterChanged(msg.sender, minter);
    return true;
  }
  function passPostSignerRole(address _post) public returns (bool) {
    require(
      msg.sender==postSigner,
      'Error, only deployer can pass post\'s caller role');
    postSigner = _post;
    emit PostSignerChanged(msg.sender, postSigner);
    return true;
  }
  function passMemeFactorySignerRole(address _memeFactory) public returns (bool) {
    require(
      msg.sender==memeFactorySigner,
      'Error, only deployer can pass memeFactory caller role');
    memeFactorySigner= _memeFactory;
    emit PostSignerChanged(msg.sender, memeFactorySigner);
    return true;
  }
  function passLikeSignerRole(address _like) public returns (bool) {
    require(
      msg.sender==likeSigner,
      'Error: only deployer can pass like minter signer caller role');
    likeSigner = _like;
    emit PostSignerChanged(msg.sender, likeSigner);
    return true;
  }
  function passFollowSignerRole(address _follow) public returns (bool) {
    require(
      msg.sender==followSigner,
      'Error: only deployer can pass follow minter signer role');
    followSigner = _follow;
    emit FollowSignerChanged(msg.sender, followSigner);
    return true;
  }
  function passBoostSignerRole(address _boost) public returns (bool) {
    require(
      msg.sender==boostSigner,
      'Error: only deployer can pass boost signer role');
    boostSigner = _boost;
    emit FollowSignerChanged(msg.sender, boostSigner);
    return true;
  }
}
