// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract MemeStorage {
  address factorySigner;
  address interfaceSigner;
  address postSigner;
  address likeSigner;

  uint public memeCount = 0;
  bytes32 constant zeroBytes = keccak256(abi.encodePacked(0));


  // mapping of Memes
  mapping(bytes32 => Meme) public memes; // memeId to meme map

  // Meme structure
  struct Meme {
    bytes32 id; // number in all of timeline
    uint time; // time of post
    string text; // text of Meme
    uint boost; // boost value
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

  event FactorySignerChanged(address from, address to);
  event InterfaceSignerChanged(address from, address to);
  event PostSignerChanged(address from, address to);
  event LikeSignerChanged(address from, address to);
  event RepostSignerChanged(address from, address to);

  constructor() public {
    factorySigner = msg.sender;
    interfaceSigner = msg.sender;
    postSigner = msg.sender;
    likeSigner = msg.sender;
  }

  // Factory-Specific setters
  function setMeme(
    bytes32 _memeId,
    Meme _meme
  ) public {
    require(msg.sender==factorySigner,
            'Error: msg.sender must be memeFactory to create meme');
    memes[_memeId] = _meme;
  }
  function deleteMeme(bytes32 _memeId) public {
    require(msg.sender==factorySigner,
            'Error: only factorySigner can delete');
    // create empty Meme instance
    delete memes[_memeId];
  }
  function increaseMemeCount() public {
    require(msg.sender==factorySigner,
            'Error: only factorySigner can increase Count');
    memeCount++;
  }

  function setResponses(
    bytes32 _memeId,
    bytes32[] memory _responses
  ) public {
    require(msg.sender==factorySigner, 'Error: msg.sender must be factorySigner');
    memes[_memeId].responses = _responses;
  }

  // getter functions for Meme
  function getLikeCount(bytes32 _memeId) public view returns(uint) {
    return memes[_memeId].likers.length;
  }
  function getLikers(bytes32 _memeId) public view returns(address[] memory) {
    return memes[_memeId].likers;
  }
  function getUnlikers(bytes32 _memeId) public view returns(address[] memory) {
    return memes[_memeId].unlikers;
  }
  function getRepostCount(bytes32 _memeId) public view returns(uint) {
    return memes[_memeId].reposts.length;
  }
  function getReposts(bytes32 _memeId) public view returns(bytes32[] memory) {
    return memes[_memeId].reposts;
  }
  function getQuotePostCount(bytes32 _memeId) public view returns(uint) {
    return memes[_memeId].quotePosts.length;
  }
  function getQuotePosts(bytes32 _memeId) public view returns(bytes32[] memory) {
    return memes[_memeId].quotePosts;
  }
  function getTags(bytes32 _memeId) public view returns(address[] memory) {
    return memes[_memeId].tags;
  }
  function getResponseCount(bytes32 _memeId) public view returns(uint) {
    return memes[_memeId].responses.length;
  }
  function getResponses(bytes32 _memeId) public view returns(bytes32[] memory) {
    return memes[_memeId].responses;
  }
  function getParentId(bytes32 _memeId) public view returns(bytes32 memory) {
    return memes[memeId].parentId;
  }
  function getOriginId(bytes32 _memeId) public view returns(bytes32 memory) {
    return memes[memeId].originId;
  }
  function getAuthor(bytes32 _memeId) public view returns(address) {
    return memes[memeId].author;
  }
  function getVisibility(bytes32 _memeId public view returns(bool) {
    return memes[memeId].isVisible;
  }

  // set caller role to User upon deployment
  function passFactorySigner(address _memeFactory) public returns (bool) {
    require(msg.sender == factorySigner,
            'Error: msg.sender must be factorySigner');

    factorySigner = _memeFactory;
    emit FactorySignerChanged(msg.sender, factorySigner);
    return true;
  }
  function passInterfaceSigner(address _userInterface) public returns (bool) {
    require(msg.sender == interfaceSigner,
            'Error: msg.sender must be factorySigner');

    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
  function passPostSigner(address _post) public returns (bool) {
    require(msg.sender == postSigner,
            'Error: msg.sender must be postSigner');

    postSigner = _post;
    emit PostSignerChanged(msg.sender, postSigner);
    return true;
  }
  function passLikeSigner(address _like) public returns (bool) {
    require(msg.sender == likeSigner,
            'Error: msg.sender must be likeSigner');

    likeSigner = _like;
    emit LikeSignerChanged(msg.sender, likeSigner);
    return true;
  }
}