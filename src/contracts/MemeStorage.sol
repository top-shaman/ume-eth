// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract MemeStorage {
  address public factorySigner;
  address public interfaceSigner;
  address public postSigner;
  address public likeSigner;
  address public boostSigner;

  uint public memeCount = 0;
  bytes32[] memeIds;

  // mapping of Memes
  mapping(bytes32 => Meme) public memes; // memeId to meme map
  mapping(bytes32 => mapping(address => bool)) public hasLiked;
  mapping(bytes32 => mapping(address => bool)) public hasUnliked;

  // Meme structure
  struct Meme {
    bytes32 id; // number in all of timeline
    uint time; // time of post
    string text; // text of Meme
    uint boosts; // boost value
    address[] likers; // list of addresses of likers
    address[] unlikers; // list of addresses that have unliked
    bytes32[] reposts; // list of ids that have reposted
    bytes32[] quotePosts; // list of ids that have quotePosted
    bytes32 repostId;// repost id
    address[] tags; // list of id's of tagged
    bytes32[] responses; // collection of id's of responses
    bytes32 parentId; // memeId of parent (can be self)
    bytes32 originId; // memeId of origin (can be self)
    address author; // address of author
    bool isVisible; // is visible
  }

  event FactorySignerChanged(
        address indexed from,
        address indexed to);
  event InterfaceSignerChanged(
        address indexed from,
        address indexed to);
  event PostSignerChanged(
        address indexed from,
        address indexed to);
  event LikeSignerChanged(
        address indexed from,
        address indexed to);
  event BoostSignerChanged(
        address indexed from,
        address indexed to);

  constructor() public {
    factorySigner = msg.sender;
    interfaceSigner = msg.sender;
    postSigner = msg.sender;
    likeSigner = msg.sender;
    boostSigner = msg.sender;
  }

  // Factory-Specific setters
  function setMeme(
            bytes32 _memeId,
            Meme memory _meme)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be memeFactory to create meme');
    memes[_memeId] = _meme;
    memeIds.push(_memeId);
  }
  function deleteMeme(bytes32 _memeId)
            public {
    require(
      msg.sender==factorySigner,
      'Error: only factorySigner can delete');
    // create empty Meme instance
    Meme memory _meme = Meme(
      _memeId,
      0,
      '',
      0,
      new address[](0),
      new address[](0),
      new bytes32[](0),
      new bytes32[](0),
      0x0,
      new address[](0),
      memes[_memeId].responses,
      memes[_memeId].parentId,
      memes[_memeId].originId,
      address(0x0),
      false
    );
    memes[_memeId] = _meme;
  }
  function increaseMemeCount()
            public {
    require(
      msg.sender==factorySigner,
      'Error: only factorySigner can increase Count'
    );
    memeCount++;
  }

  function setResponses(
            bytes32 _memeId,
            bytes32[] memory _responses)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memes[_memeId].responses = _responses;
  }

  function setReposts(
            bytes32 _memeId,
            bytes32[] memory _reposts)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memes[_memeId].reposts = _reposts;
  }
  function setQuotePosts(
            bytes32 _memeId,
            bytes32[] memory _quotePosts)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memes[_memeId].quotePosts = _quotePosts;
  }

  function setLikers(
            bytes32 _memeId,
            address[] memory _likers)
            public {
    require(
      msg.sender==likeSigner,
      'Error: msg.sender must be likeSigner');
    memes[_memeId].likers = _likers;
  }
  function setUnlikers(
            bytes32 _memeId,
            address[] memory _unlikers)
            public {
    require(
      msg.sender==likeSigner,
      'Error: msg.sender must be likeSigner');
    memes[_memeId].unlikers = _unlikers;
  }
  function setHasLiked(
            bytes32 _memeId,
            address _account)
            public {
    require(
      msg.sender==likeSigner,
      'Error: msg.sender must be likeSigner');
    hasLiked[_memeId][_account] = true;
  }
  function setHasUnliked(
            bytes32 _memeId,
            address _account)
            public {
    require(
      msg.sender==likeSigner,
      'Error: msg.sender must be likeSigner');
    hasUnliked[_memeId][_account] = true;
  }

  function addBoost(
            bytes32 _memeId,
            uint _boosts)
            public {
    require(
      msg.sender==boostSigner,
      'Error: msg.sender must be boost signer');
    memes[_memeId].boosts += _boosts;
  }
  function subtractBoost(
            bytes32 _memeId,
            uint _boosts)
            public {
    require(
      msg.sender==boostSigner,
      'Error: msg.sender must be like, post, or boost signer');
    memes[_memeId].boosts -= _boosts;
  }

  // getter functions for Meme
  function getMemeCount()
            public view returns(uint) {
    return memeCount;
  }

  function getText(bytes32 _memeId)
            public view returns(string memory) {
    return memes[_memeId].text;
  }
  function getLikeCount(bytes32 _memeId)
            public view returns(uint) {
    return memes[_memeId].likers.length;
  }
  function getBoost(bytes32 _memeId)
            public view returns(uint) {
    return memes[_memeId].boosts;
  }
  function getLikers(bytes32 _memeId)
            public view returns(address[] memory) {
    return memes[_memeId].likers;
  }
  function getUnlikers(bytes32 _memeId)
            public view returns(address[] memory) {
    return memes[_memeId].unlikers;
  }
  function getRepostCount(bytes32 _memeId)
            public view returns(uint) {
    return memes[_memeId].reposts.length;
  }
  function getReposts(bytes32 _memeId)
            public view returns(bytes32[] memory) {
    return memes[_memeId].reposts;
  }
  function getQuotePostCount(bytes32 _memeId)
            public view returns(uint) {
    return memes[_memeId].quotePosts.length;
  }
  function getQuotePosts(bytes32 _memeId)
            public view returns(bytes32[] memory) {
    return memes[_memeId].quotePosts;
  }
  function getTags(bytes32 _memeId)
            public view returns(address[] memory) {
    return memes[_memeId].tags;
  }
  function getResponseCount(bytes32 _memeId)
            public view returns(uint) {
    return memes[_memeId].responses.length;
  }
  function getResponses(bytes32 _memeId)
            public view returns(bytes32[] memory) {
    return memes[_memeId].responses;
  }
  function getParentId(bytes32 _memeId)
            public view returns(bytes32) {
    return memes[_memeId].parentId;
  }
  function getOriginId(bytes32 _memeId)
            public view returns(bytes32) {
    return memes[_memeId].originId;
  }
  function getRepostId(bytes32 _memeId)
            public view returns(bytes32) {
    return memes[_memeId].repostId;
  }
  function getAuthor(bytes32 _memeId)
            public view returns(address) {
    return memes[_memeId].author;
  }
  function getVisibility(bytes32 _memeId)
            public view returns(bool) {
    return memes[_memeId].isVisible;
  }
  function getEncodedIds()
            public view returns(bytes32[] memory) {
    return memeIds;
  }

// encode uint for testing
  function getEncodeId(uint _memeId)
            public view returns(bytes32) {
    return memes[keccak256(abi.encodePacked(_memeId))].id;
  }
  function getEncodeLikeCount(uint _memeId)
            public view returns(uint) {
    return memes[keccak256(abi.encodePacked(_memeId))].likers.length;
  }
  function getEncodeLikers(uint _memeId)
            public view returns(address[] memory) {
    return memes[keccak256(abi.encodePacked(_memeId))].likers;
  }
  function getEncodeUnlikers(uint _memeId)
            public view returns(address[] memory) {
    return memes[keccak256(abi.encodePacked(_memeId))].unlikers;
  }
  function getEncodeRepostCount(uint _memeId)
            public view returns(uint) {
    return memes[keccak256(abi.encodePacked(_memeId))].reposts.length;
  }
  function getEncodeReposts(uint _memeId)
            public view returns(bytes32[] memory) {
    return memes[keccak256(abi.encodePacked(_memeId))].reposts;
  }
  function getEncodeQuotePostCount(uint _memeId)
            public view returns(uint) {
    return memes[keccak256(abi.encodePacked(_memeId))].quotePosts.length;
  }
  function getEncodeQuotePosts(uint _memeId)
            public view returns(bytes32[] memory) {
    return memes[keccak256(abi.encodePacked(_memeId))].quotePosts;
  }
  function getEncodeTags(uint _memeId)
            public view returns(address[] memory) {
    return memes[keccak256(abi.encodePacked(_memeId))].tags;
  }
  function getEncodeResponseCount(uint _memeId)
            public view returns(uint) {
    return memes[keccak256(abi.encodePacked(_memeId))].responses.length;
  }
  function getEncodeResponses(uint _memeId)
            public view returns(bytes32[] memory) {
    return memes[keccak256(abi.encodePacked(_memeId))].responses;
  }
  function getEncodeParentId(uint _memeId)
            public view returns(bytes32) {
    return memes[keccak256(abi.encodePacked(_memeId))].parentId;
  }
  function getEncodeOriginId(uint _memeId)
            public view returns(bytes32) {
    return memes[keccak256(abi.encodePacked(_memeId))].originId;
  }
  function getEncodeAuthor(uint _memeId)
            public view returns(address) {
    return memes[keccak256(abi.encodePacked(_memeId))].author;
  }
  function getEncodeVisibility(uint _memeId)
            public view returns(bool) {
    return memes[keccak256(abi.encodePacked(_memeId))].isVisible;
  }

  // set caller role to User upon deployment
  function passFactorySigner(address _memeFactory)
            public returns (bool) {
    require(
      msg.sender == factorySigner,
      'Error: msg.sender must be factorySigner');

    factorySigner = _memeFactory;
    emit FactorySignerChanged(msg.sender, factorySigner);
    return true;
  }
  function passInterfaceSigner(address _userInterface)
            public returns (bool) {
    require(
      msg.sender == interfaceSigner,
      'Error: msg.sender must be factorySigner');

    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
  function passPostSigner(address _post)
            public returns (bool) {
    require(
      msg.sender == postSigner,
      'Error: msg.sender must be postSigner');

    postSigner = _post;
    emit PostSignerChanged(msg.sender, postSigner);
    return true;
  }
  function passLikeSigner(address _like)
            public returns (bool) {
    require(
      msg.sender == likeSigner,
      'Error: msg.sender must be likeSigner');

    likeSigner = _like;
    emit LikeSignerChanged(msg.sender, likeSigner);
    return true;
  }
  function passBoostSigner(address _boost)
            public returns (bool) {
    require(
      msg.sender == boostSigner,
      'Error: msg.sender must be likeSigner');

    boostSigner = _boost;
    emit BoostSignerChanged(msg.sender, boostSigner);
    return true;
  }
}
