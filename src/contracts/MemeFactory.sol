// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";
import "./Boost.sol";
import "./MemeStorage.sol";
import "./UserStorage.sol";

contract MemeFactory {
  // public variables
  UME private umeToken;
  MemeStorage private memeStorage;
  UserStorage private userStorage;
  Boost private boost;

  bytes32 zeroBytes;

  address public postSigner;

  event PostSignerChanged(
        address indexed from,
        address indexed to);
  event MemeCreated(
        bytes32 indexed memeId,
        uint time,
        address indexed account);
  event MemeDeleted(
        bytes32 indexed memeId,
        uint time,
        address indexed account);
  event Tagged(
        address indexed from,
        address indexed to);

  constructor(UME _umeToken,
              MemeStorage _memeStorage,
              UserStorage _userStorage,
              Boost _boost)
              public {
    umeToken = _umeToken;
    memeStorage = _memeStorage;
    userStorage = _userStorage;
    boost = _boost;

    postSigner = msg.sender;
  }

  // posting meme functions
  function newMeme(
            address _account,
            string memory _memeText,
            address[] memory _tags,
            bytes32 _parentId,
            bytes32 _originId,
            bytes32 _repostId)
            public {
    require(
      msg.sender==postSigner,
      'Error: msg.sender must be interface(signer)');
    // increment meme id
    memeStorage.increaseMemeCount();
    bytes32 _memeId = keccak256(abi.encodePacked(memeStorage.memeCount()));
    // set parent & origin id's to memeId if
    if (_parentId == zeroBytes) {
      _parentId = _memeId;
    }
    if (_originId == zeroBytes) {
      _originId = _memeId;
    }
    // map memeId to new meme
    memeStorage.setMeme(_memeId, MemeStorage.Meme(
      _memeId, // meme id
      block.timestamp, // meme time
      _memeText, // meme text
      0, // boost value
      new address[](0), // likers
      new address[](0), // unlikers
      new bytes32[](0), // reposts
      new bytes32[](0), // quotePosts
      _repostId, // repost id
      _tags, // tagged
      new bytes32[](0), // response array
      _parentId, // parent
      _originId, // origin
      _account, // author
      true // isVisible
    ));
    // if responding to a single post, then mint respond token
    if(_memeId!=_parentId && _parentId==_originId) {
      if(memeStorage.getAuthor(_parentId)!=_account)
        umeToken.mintRespond(_account, memeStorage.getAuthor(_parentId));
        _addResponse(_memeId, _parentId);
        boost.respondBoost(_memeId);
    } // if responding to a thread, mint respond token for parent, curate token for original
    else if(_memeId!=_parentId && _parentId!=_originId) {
      if(memeStorage.getAuthor(_parentId)!=_account)
        umeToken.mintRespond(_account, memeStorage.getAuthor(_parentId));
        boost.respondBoost(_memeId);
      if(memeStorage.getAuthor(_originId)!=_account)
        umeToken.mintCurate(_account, memeStorage.getAuthor(_originId));
        _addResponse(_memeId, _parentId);
        boost.curateBoost(_memeId);
    }
    // mint tags
    for(uint i = 0; i < _tags.length; i++) {
      if(_account!=_tags[i] && _tags[i]!=address(0x0)){
        umeToken.mintTag(_account, _tags[i]);
        boost.tagBoost(_memeId);
        emit Tagged(_account, _tags[i]);
      }
    }
    if(_repostId!=zeroBytes) {
      if(bytes(_memeText).length==0) {
        bytes32[] memory _oldReposts = memeStorage.getReposts(_repostId);
        _addRepost(_memeId, _memeText, _repostId, _oldReposts);
        memeStorage.addBoost(_memeId, 4);
        boost.repostBoost(_repostId);
      } else {
        bytes32[] memory _oldReposts = memeStorage.getQuotePosts(_repostId);
        _addRepost(_memeId, _memeText, _repostId, _oldReposts);
        boost.repostBoost(_repostId);
      }
    }
    _addPostToUser(_account, _memeId);
    userStorage.setUsersByMeme(_memeId, _account);
    boost.postBoost(_memeId);
    emit MemeCreated(_memeId, block.timestamp, _account);
  }
  function deleteMeme(
            address _author,
            bytes32 _memeId)
            public {
    require(
      postSigner==msg.sender,
      'Error: only signer can delete meme');
    // create empty Meme instance
    bytes32 _parentId = memeStorage.getParentId(_memeId);
    bytes32 _repostId = memeStorage.getRepostId(_memeId);
    string memory _repostText = memeStorage.getText(_repostId);
    _deletePostFromUser(_author, _memeId);
    memeStorage.deleteMeme(_memeId);
    emit MemeDeleted(_memeId, block.timestamp, _author);
  }

  function _addResponse(
            bytes32 _memeId,
            bytes32 _parentId)
            private {
    bytes32[] memory _oldResponses = memeStorage.getResponses(_parentId);
    uint _oldResponseCount = _oldResponses.length;
    bytes32[] memory _newResponses = new bytes32[](_oldResponseCount+1);
    for(uint i = 0; i < _oldResponseCount; i++)
      _newResponses[i] = _oldResponses[i];
    _newResponses[_newResponses.length-1] = _memeId;
    memeStorage.setResponses(_parentId, _newResponses);
  }
  function _addRepost(
            bytes32 _memeId,
            string memory _memeText,
            bytes32 _repostId,
            bytes32[] memory _oldReposts)
            private {

    uint _oldRepostCount = _oldReposts.length;
    bytes32[] memory _newReposts = new bytes32[](_oldRepostCount+1);
    for(uint i = 0; i < _oldRepostCount; i++)
      _newReposts[i] = _oldReposts[i];
    _newReposts[_newReposts.length-1] = _memeId;

    if(bytes(_memeText).length==0) memeStorage.setReposts(_repostId, _newReposts);
    else memeStorage.setQuotePosts(_repostId, _newReposts);
  }
  function _addPostToUser(
            address _account,
            bytes32 _memeId)
            private {
     // create memory array with length one greater than _user.posts length
     bytes32[] memory _oldPosts = userStorage.getPosts(_account);
     uint _oldPostCount = _oldPosts.length;
     bytes32[] memory _newPosts = new bytes32[](_oldPostCount+1);
     for(uint i = 0; i < _oldPostCount; i++)
       _newPosts[i] = _oldPosts[i];
     _newPosts[_oldPostCount] = _memeId;
     userStorage.setPosts(_account, _newPosts);
  }
  function _deletePostFromUser(
            address _account,
            bytes32 _memeId)
            private {
     bytes32[] memory _oldPosts = userStorage.getPosts(_account);
     uint _oldPostCount = _oldPosts.length;
     bytes32[] memory _newPosts = new bytes32[](_oldPostCount-1);
     uint _index;
     for(uint i = 0; i < _oldPosts.length; i++) {
       if(_oldPosts[i]==_memeId) {
         _index = i;
         break;
       }
     }
     _newPosts = _deleteBytes32(_oldPosts, _index);
     userStorage.setPosts(_account, _newPosts);
     // clears mapping of deleted meme, reroutes to 0x0 address instead of deleter
     userStorage.setUsersByMeme(_memeId, address(0x0));
  }

  // helper functions
  function _deleteBytes32(
            bytes32[] memory array,
            uint index)
            private pure returns(bytes32[] memory) {
    bytes32[] memory _array = new bytes32[](array.length-1);
    for(uint i = 0; i < index; i++)
      _array[i] = array[i];
    for(uint i = index; i < _array.length; i++)
      _array[i] = array[i+1];
    return _array;
  }

  function _bytesToBytes32(bytes memory source)
            public pure returns(bytes32 result) {
    if(source.length==0) return 0x0;
    assembly {
      result := mload(add(source, 32))
    }
  }
  // set signer roles
  function passPostSigner(address _post) public returns (bool) {
    require(
      msg.sender == postSigner,
      'Error: only deployer can pass post signer role');

    postSigner = _post;
    emit PostSignerChanged(msg.sender, postSigner);
    return true;
  }
}
