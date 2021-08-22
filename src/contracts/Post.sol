// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";

contract Post {
  // public variables
  UME private umeToken;
  address public caller;

  string public name = "uMe";
  uint public memeCount = 0;

  // mapping of Memes
  mapping(uint => Meme) public memes; // memeId to meme map

  // Meme structure
  struct Meme {
    uint id; // number in all of timeline
    uint time; // time of post
    // string hash; // hash of Meme
    string text; // test of Meme
    uint likes; // number of likes on Meme
    address[] likers; // list of addresses of likers
    address[] unlikers; // list of addresses that have unliked
    address[] tags; // list of id's of tagged
    uint[] responses; // collection of id's of responses
    uint parentId; // memeId of parent (can be self)
    uint originId; // memeId of origin (can be self)
    address author; // address of author
    bool isVisible;
    //bool hasLink // if Meme has link
    //bool hasMedia; // if Meme has media
    //string mediaHash; // address of media
  }


  event MemeCreated(
    uint memeId,
    uint memeTime,
    // string memeHash,
    string memeText,
    address author
  );
  event MemeLiked(
    uint memeId,
    uint memeTime,
    // string memeHash,
    string memeText,
    address author
  );
  event PostCallerChanged(
    address accountFrom,
    address accountTo
  );

  constructor(UME _umeToken) public {
    umeToken = _umeToken;
    caller = msg.sender;
  }

  // posting meme functions
  function newMeme(address account, string memory _memeText, address[] memory _tags, uint _parentId, uint _originId) public {
    //require(bytes(_memeHash).length > 0, 'Error: meme hash doesn\'t exist');
    //require(bytes(_memeText).length > 0, 'Error: meme text doesn\'t exist');
    require(msg.sender==caller, 'Error: poster must be operating account');
    //require(msg.sender != address(0x0), 'Error: author address doesn\'t exist');
    // increment meme id
    memeCount++;
    // set parent & origin id's to memeId if
    if (_parentId == 0) {
      _parentId = memeCount;
    }
    if (_originId == 0) {
      _originId = memeCount;
    }
    // map memeId to new meme (if parent & origin)
    memes[memeCount] = Meme(
      memeCount, // meme id
      block.timestamp, // meme time
      // _memeHash, // meme hash
      _memeText, // meme text
      0, // like count
      new address[](0), // likers
      new address[](0), // unlikers
      _tags, // tagged
      new uint[](0), // response array
      _parentId, // parent
      _originId, // origin
      account, // author
      true // isVisible
    );
    // if responding to a single post, then mint respond token
    if(memeCount!=_parentId && _parentId==_originId && memes[_parentId].author!=account) {
      umeToken.mintRespond(account, memes[_parentId].author /* , _memehash */);
    } // if responding to a thread, mint respond token for parent, curate token for original
    else if(memeCount!=_parentId && _parentId!=_originId && memes[_originId].author!=account) {
      umeToken.mintRespond(account, memes[_parentId].author /* , _memehash */);
      umeToken.mintCurate(account, memes[_originId].author /* , _memehash */);
    }
    // mint tags
    for(uint i = 0; i < _tags.length; i++) {
      if(account!=_tags[i]){
        umeToken.mintTag(account, _tags[i] /* , _memehash */);
      }
    }
    // mint post token
    umeToken.mintPost(account /* , _memehash */, _memeText);
    emit MemeCreated(memeCount, block.timestamp /* , _memehash */, _memeText, msg.sender);
  }

  function deleteMeme(address account, uint memeId) public {
    require(caller==msg.sender, 'Error: only account owner can delete meme');
    // create empty Meme instance
    memes[memeId] = Meme(
      0, // memeId
      0, // time
      '', // meme text
      0, // like count
      new address[](0), // likers
      new address[](0), // unlikers
      new address[](0), // tagged
      new uint[](0), // response array
      0, // parent
      0, // origin
      address(0x0), // author
      false // isVisible
    );
  }

  // like functions
  function likeMeme(address account, uint memeId) public {
    require(msg.sender==caller, 'Error: liker must be operating account');

    bool firstLike = true;
    bool unliked = false;
    // remove like if already liked
    for(uint i = 0; i < memes[memeId].likers.length; i++) {
      if(account==memes[memeId].likers[i]) {
        firstLike = false;
        _unLike(account, memeId, i);
        unliked = true;
      }
    } // check for double like minting
    for(uint i = 0; i < memes[memeId].unlikers.length; i++) {
      if(account==memes[memeId].unlikers[i] && unliked==false) {
        firstLike = false;
        _addLike(account, memeId, i, firstLike);
        break;
      }
    }
    if(firstLike==true && unliked==false) {
      _addLike(account, memeId, 0, firstLike);
      // mint like token
      umeToken.mintLike(account, memes[memeId].author /*, memes[memeId].hash*/ );
    }
  }
  // setter functions for Meme
  function _addLike(address account, uint memeId, uint index, bool firstLike) private {
    // fetch meme from blockchain
    Meme memory _meme = memes[memeId];

    if(firstLike==false) {
      _meme.unlikers = _deleteAddress(_meme.unlikers, index);
    }

    // set memory to _meme.likers length plus one
    address[] memory _likers = new address[](_meme.likers.length+1);

    // populate address array with existing _meme.likers
    for(uint i = 0; i < _meme.likers.length; i++) {
      //require(account!=_meme.likers[i], 'Error: liker has already liked account');
      _likers[i] = _meme.likers[i];
    }
    // increment meme's likes
    _meme.likes++;
    // set _likers value to msg.sender at last slot of array
    _likers[_likers.length-1] = msg.sender;
    // set likers field of _meme.likers to _likers
    _meme.likers = _likers;
    // set meme at memeId to _meme instance
    memes[memeId] = _meme;
  }
  function _unLike(address account, uint memeId, uint index) private {
    require(memes[memeId].likers.length > 0, 'Error, no likers in meme');
    // fetch meme from blockchain
    Meme memory _meme = memes[memeId];

    // delete liked index, moving all successive elements
    _meme.likers = _deleteAddress(_meme.likers, index);
    // decrement meme's likes
    _meme.likes--;
    // set memory to _meme.unlikers length plus one
    address[] memory _unlikers = new address[](_meme.unlikers.length+1);
    // populate address array with existing _meme.unlikers
    for(uint i = 0; i < _meme.unlikers.length; i++) {
      _unlikers[i] = _meme.unlikers[i];
    }
    // set _unlikers value to msg.sender at last slot of array
    _unlikers[_unlikers.length-1] = msg.sender;
    // set unlikers field of _meme.likers to _unlikers
    _meme.unlikers = _unlikers;
    // set meme at memeId to _meme instance
    memes[memeId] = _meme;
  }

  // getter functions for Meme
  function getLikers(uint memeId) public view returns(address[] memory) {
    return memes[memeId].likers;
  }
  function getUnlikers(uint memeId) public view returns(address[] memory) {
    return memes[memeId].unlikers;
  }
  function getTags(uint memeId) public view returns(address[] memory) {
    return memes[memeId].tags;
  }
  function getResponses(uint memeId) public view returns(uint[] memory) {
    return memes[memeId].responses;
  }
  // helper functions
  function _deleteAddress(address[] memory array, uint index) private returns(address[] memory) {
    address[] memory _array = new address[](array.length-1);
    for(uint i = 0; i < index; i++) {
      _array[i] = array[i];
    }
    for(uint i = index; i < _array.length; i++) {
      _array[i] = array[i+1];
    }
    return _array;
  }

  // set caller role to User upon deployment
  function passPostRole(address user) public returns (bool) {
    require(msg.sender == caller, 'Error, only owner can pass post role');

    caller = user;
    emit PostCallerChanged(msg.sender, user);
    return true;
  }
}
