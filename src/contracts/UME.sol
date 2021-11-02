// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {

  // minting values
  uint public postValue = 8e18;
  uint public likeFromValue = 2e18;
  uint public likeToValue = 5e18;
  uint public tagFromValue = 1e18;
  uint public tagToValue = 3e18;
  uint public followFromValue = 1e18;
  uint public followToValue = 6e18;
  uint public respondFromValue = 2e18;
  uint public respondToValue = 4e18;
  uint public curateFromValue = 2e18;
  uint public curateToValue = 4e18;
  uint public repostFromValue = 5e18;
  uint public repostToValue = 6e18;

  // signer's address
  address public memeFactorySigner;
  address public postSigner;
  address public likeSigner;
  address public followSigner;
  address public boostSigner;
  address public valueSigner;

  // Signer role changes
  event PostSignerChanged(
        address indexed from,
        address indexed to);
  event MemeFactorySignerChanged(
        address indexed from,
        address indexed to);
  event LikeSignerChanged(
        address indexed from,
        address indexed to);
  event FollowSignerChanged(
        address indexed from,
        address indexed to);
  event BoostSignerChanged(
        address indexed from,
        address indexed to);
  event ValueSignerChanged(
        address indexed from,
        address indexed to);
  event Minted(
        address indexed account,
        uint time,
        uint256 amount,
        string flag);

  constructor()
    public payable ERC20("uMe token", "UME") {
    // assign signer roles
    postSigner = msg.sender;
    memeFactorySigner = msg.sender;
    likeSigner = msg.sender;
    followSigner = msg.sender;
    boostSigner = msg.sender;
    valueSigner = msg.sender;
  }

  function mintPost(
            address _account,
            string memory _postText)
            public {
    // make sure minter is same as sender
    require(
      postSigner==msg.sender,
      'Error: wrong account calling post mint');
    _mint(address(_account), postValue);
    // set event for minted Posted UME tokens
    emit Minted(_account, block.timestamp, postValue, 'POST');
  }
  function mintLike(
            address _from,
            address _to)
            public { // 2:5 Liker:Liked
    require(
      likeSigner==msg.sender,
      'Error: wrong account calling like mint');
    // mint a LIKE token for liker
    _mint(address(_from), likeFromValue);
    // set event for LIKE token FROM
    emit Minted(_from, block.timestamp, likeFromValue, 'LIKE');
    // mint LIKE tokens for likee
    _mint(address(_to), likeToValue);
    // set event for LIKE token TO
    emit Minted(_to, block.timestamp, likeToValue, 'LIKE');
  }
  function mintTag(
            address _from,
            address _to)
            public { // 1:3 Tagger:Tagged
    require(
      memeFactorySigner==msg.sender,
      'Error: wrong account calling tag mint');
    // mint a TAG token for tagger
    _mint(_from, tagFromValue);
    // set event for TAG token FROM
    emit Minted(_from, block.timestamp, tagFromValue, 'TAG');
    // mint TAG tokens for taggee
    _mint(_to, tagToValue);
    // set event for TAG token TO
    emit Minted(_to, block.timestamp, tagToValue, 'TAG');
  }
  function mintFollow(
            address _from,
            address _to)
            public { // 1:3 Follower:Followed
    require(
      followSigner==msg.sender,
      'Error: wrong account');
    // mint a FOLLOW token for follower
    _mint(_from, followFromValue);
    // set event for FOLLOW token FROM
    emit Minted(_from, block.timestamp, followFromValue, 'FOLLOW');
    // mint FOLLOW tokens for followed
    _mint(_to, followToValue);
    // set event for FOLLOW token TO
    emit Minted(_to, block.timestamp, followToValue, 'FOLLOW');
  }
  function mintRespond(
            address _from,
            address _to)
            public { // 2:4 Responder:Responded
    require(
      memeFactorySigner==msg.sender,
      'Error: wrong account');
    // mint a RESPOND token for responder
    _mint(_from, respondFromValue);
    // set event for RESPOND token FROM
    emit Minted(_from, block.timestamp, respondFromValue, 'RESPOND FROM');
    // mint RESPOND tokens for responded
    if(_to!=address(0x0)) {
      _mint(_to, respondToValue);
    }
    // set event for RESPOND token TO
    emit Minted(_to, block.timestamp, respondToValue, 'RESPOND TO');
  }
  function mintCurate(
            address _from,
            address _to)
            public { // 2:4 Responder:Responded
    require(
      memeFactorySigner==msg.sender,
      'Error: wrong account');
    // mint a CURATE token for curatee
    _mint(_from, curateFromValue);
    // set event for CURATE token FROM
    emit Minted(_from, block.timestamp, curateFromValue, 'CURATE');
    // mint CURATE tokens for curator
    if(_to!=address(0x0)) {
      _mint(_to, curateToValue);
    }
    // set event for CURATE token TO
    emit Minted(_to, block.timestamp, curateToValue, 'CURATE');
  }
  function mintRepost(
            address _from,
            address _to)
            public {
    require(
      postSigner==msg.sender,
      'Error: wrong account');
    //mint REPOST token for reposter
    _mint(_from, repostFromValue);
    // set event for REPOST from
    emit Minted(_from, block.timestamp, repostFromValue, 'REPOST');
    // mint REPOST token for original poster
    _mint(_to, repostToValue);
    // set event for REPOST to
    emit Minted(_from, block.timestamp, repostToValue, 'REPOST');
  }
  function burn(
            address _account,
            uint _amount)
            public {
    require(
      msg.sender==likeSigner ||
      msg.sender==followSigner ||
      msg.sender==boostSigner,
      'Error: burner must be valid signer');
    _burn(_account, _amount);
  }

  function setPostValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    postValue = _value;
  }
  function setLikeFromValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    likeFromValue = _value;
  }
  function setLikeToValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    likeToValue = _value;
  }
  function setTagFromValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    tagFromValue = _value;
  }
  function setTagToValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    tagToValue = _value;
  }
  function setFollowFromValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    followFromValue = _value;
  }
  function setFollowToValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    followToValue = _value;
  }
  function setRespondFromValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    respondFromValue = _value;
  }
  function setRespondToValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    respondToValue = _value;
  }
  function setCurateFromValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    curateFromValue = _value;
  }
  function setCurateToValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    curateToValue = _value;
  }
  function setRepostFromValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    repostFromValue = _value;
  }
  function setRepostToValue(uint256 _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: value must be changed by signer');
    repostToValue = _value;
  }

  function passPostSignerRole(address _post)
            public returns (bool) {
    require(
      msg.sender==postSigner,
      'Error, only deployer can pass post\'s caller role');
    postSigner = _post;
    emit PostSignerChanged(msg.sender, postSigner);
    return true;
  }
  function passMemeFactorySignerRole(address _memeFactory)
            public returns (bool) {
    require(
      msg.sender==memeFactorySigner,
      'Error, only deployer can pass memeFactory caller role');
    memeFactorySigner= _memeFactory;
    emit PostSignerChanged(msg.sender, memeFactorySigner);
    return true;
  }
  function passLikeSignerRole(address _like)
            public returns (bool) {
    require(
      msg.sender==likeSigner,
      'Error: only deployer can pass like minter signer caller role');
    likeSigner = _like;
    emit PostSignerChanged(msg.sender, likeSigner);
    return true;
  }
  function passFollowSignerRole(address _follow)
            public returns (bool) {
    require(
      msg.sender==followSigner,
      'Error: only deployer can pass follow minter signer role');
    followSigner = _follow;
    emit FollowSignerChanged(msg.sender, followSigner);
    return true;
  }
  function passBoostSignerRole(address _boost)
            public returns (bool) {
    require(
      msg.sender==boostSigner,
      'Error: only deployer can pass boost signer role');
    boostSigner = _boost;
    emit BoostSignerChanged(msg.sender, boostSigner);
    return true;
  }
  function passValueSignerRole(address _value)
            public returns (bool) {
    require(
      msg.sender==valueSigner,
      'Error: only deployer can pass value signer role');
    valueSigner = _value;
    emit BoostSignerChanged(msg.sender, valueSigner);
    return true;
  }
}
