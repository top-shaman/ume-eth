// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";

contract Timeline {
  // public variables
  UME private umeToken;
  // app name
  string public name = "uMe";
  uint public memeCount = 0;


  // mapping of Memes
  mapping(uint => Meme) public memes; // memeId to meme map
  /*
  mapping(uint => uint) public memeCreation; // memeId to meme creation time
  mapping(uint => string) public memeHashes; // memeId to memeHash
  mapping(uint => string) public memeTexts; // memeId to memeText
  mapping(uint => uint) public memeLikes; // memeId to like count
  */
  mapping(uint => address[]) public memeLikers; // memeId to likers
  /*
  mapping(uint => uint[]) public memeTags; // memeId to tagged, input needs to be parsed before
  mapping(uint => uint[]) public memeResponses; // memeId to response id's
  */
  mapping(uint => address) public users; // memeId to user addresses

  // Meme structure
  struct Meme {
    uint id; // number in all of timeline
    uint time; // time of post
    string hash; // hash of Meme
    string text; // test of Meme
    uint likes; // number of likes on Meme
    //address[] likers; // list of addresses of likers
    address[] tags; // list of id's of tagged
    uint[] responses; // collection of id's of responses
    uint parentId; // memeId of parent (can be self)
    uint originId; // memeId of origin (can be self)
    address author; // address of author
    //bool hasLink // if Meme has link
    //bool hasMedia; // if Meme has media
    //string mediaHash; // address of media
  }

  event MemeCreated(
    uint memeId,
    uint memeTime,
    string memeHash,
    string memeText,
    address author
  );
  event MemeLiked(
    uint memeId,
    uint memeTime,
    string memeHash,
    string memeText,
    address author
  );

/*
  struct Engagements {
  // engagements to mint from
    uint amtPosted;
    uint amtLiked;
    uint amtTagged;
    uint amtFollowed;
    uint amtResponded;
    uint amtCurated;
    uint amtJuried;
  }
*/
  constructor(UME _umeToken) public {
    umeToken = _umeToken;
  }

  function newMeme(address account, string memory _memeHash, string memory _memeText, address[] memory _tags, uint _parentId, uint _originId) public {
    require(bytes(_memeHash).length > 0, 'Error: meme hash doesn\'t exist');
    require(bytes(_memeText).length > 0, 'Error: meme text doesn\'t exist');
    require(msg.sender==account, 'Error: poster must be operating account');
    require(msg.sender != address(0x0), 'Error: author address doesn\'t exist');

    memeCount++; // increment meme id
    if (_parentId == 0) {
      _parentId = memeCount;
    }
    if (_originId == 0) {
      _originId = 0;
    }
    //memeTime[memeCount] = block.timestamp; // set creation time
    //memeHashes[memeCount] = _memeHash; // set meme hash
    //memeTexts[memeCount] = _memeText; // set meme text
    //memeLikes[memeCount] = 0;
    //memeLikers[memeCount] = []; // set likers to default
    //memeTagged[memeCount] = tags; // set tagged to tags
    //memeResponses[memeCount] = []; // set responses to default

    users[memeCount] = msg.sender; // set meme to user address
    // map memeId to meme (if parent & origin)
    memes[memeCount] = Meme(
      memeCount, // meme id
      block.timestamp, // meme time
      _memeHash, // meme hash
      _memeText, // meme text
      0, // like count
      // new address[](0), // likers
      _tags, // tagged
      new uint[](0), // response array
      _parentId, // parent
      _originId, // origin
      msg.sender // author
    );
    // if responding to a single post, then mint respond token
    if(memeCount!=_parentId && _parentId==_originId) {
      umeToken.mintRespond(account, users[_parentId], _memeHash);
    } // if responding to a thread, mint respond token for parent, curate token for original
    else if(memeCount!=_parentId && _parentId!=_originId) {
      umeToken.mintRespond(account, users[_parentId], _memeHash);
      umeToken.mintCurate(account, users[_originId], _memeHash);
    }
    // mint post token
    umeToken.mintPost(account, _memeHash, _memeText);

    // mint tags
    for(uint i = 0; i < _tags.length; i++) {
      if(account!=_tags[i]){
        umeToken.mintTag(account, _tags[i], _memeHash);
      }
    }

    emit MemeCreated(memeCount, block.timestamp, _memeHash, _memeText, msg.sender);
  }

  function likeMeme(address account, uint memeId) public {
    require(account!=users[memeId], 'Error: cannot like one\'s own meme');
    require(account==msg.sender, 'Error: liker must be operating account');
    require(users[memeId]!=address(0x0), 'Error: Meme must exist1');
    require(memes[memeId].time!=0, 'Error: Meme must exist2');
    require(memeCount > 0, 'Error: Meme must exist3');


    // set memory to _meme.likers length plus one
    //address[] memory _likers = new address[](_meme.likers.length+1);

    // check if account has already liked meme
    for(uint i = 0; i < memeLikers[memeId].length; i++) {
      require(account==memeLikers[memeId][i], 'Error: liker has already liked account');
      //_likers[i] = _meme.likers[i];
    }

    // fetch meme from blockchain
    Meme memory _meme = memes[memeId];

    // populate address array with existing _meme.likers
    //for(uint i = 0; i < _meme.likers.length; i++) {
    //}
    //if(_meme.likes==0) {
      //_meme.likers = new address[](0);
    //}
/*
    Meme memory _meme = Meme(
      memes[memeId].id, // meme id
      memes[memeId].time, // meme time
      memes[memeId].hash, // meme hash
      memes[memeId].text, // meme text
      memes[memeId].likes, // like count
      new address[](0), // likers
      memes[memeId].tags, // tagged
      memes[memeId].responses, // response array
      memes[memeId].parentId, // parent
      memes[memeId].originId, // origin
      memes[memeId].author// author
    );
*/
    // increment like count of particular image
    //likeCount[memeId]++;
    memeLikers[memeId].push(msg.sender);
    _meme.likes++;
    //_likers[_meme.likers.length-1] = msg.sender;
    //_meme.likers = _likers;
    memes[memeId] = _meme;

    // mint like token
    umeToken.mintLike(msg.sender, users[memeId], _meme.hash);
  }
}
