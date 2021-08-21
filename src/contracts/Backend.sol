// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";

contract Backend {
  // public variables
  UME private umeToken;
  // app name
  string public name = "uMe";
  uint public memeCount = 0;
  uint public userCount = 0;

  // mapping of Memes
  mapping(uint => Meme) public memes; // memeId to meme map
  /*
  mapping(uint => uint) public memeCreation; // memeId to meme creation time
  mapping(uint => string) public memeHashes; // memeId to memeHash
  mapping(uint => string) public memeTexts; // memeId to memeText
  mapping(uint => uint) public memeLikes; // memeId to like count
  mapping(uint => address[]) public memeLikers; // memeId to likers
  mapping(uint => uint[]) public memeTags; // memeId to tagged, input needs to be parsed before
  mapping(uint => uint[]) public memeResponses; // memeId to response id's
  */
  mapping(address => User) public users;
  mapping(uint => address) public usersByMeme; // memeId to user addresses

  // Meme structure
  struct Meme {
    uint id; // number in all of timeline
    uint time; // time of post
    string hash; // hash of Meme
    string text; // test of Meme
    uint likes; // number of likes on Meme
    address[] likers; // list of addresses of likers
    address[] tags; // list of id's of tagged
    uint[] responses; // collection of id's of responses
    uint parentId; // memeId of parent (can be self)
    uint originId; // memeId of origin (can be self)
    address author; // address of author
    //bool hasLink // if Meme has link
    //bool hasMedia; // if Meme has media
    //string mediaHash; // address of media
  }

  struct User {
    uint id; // user number in order
    string userName; // user name
    string userAddress; // user address (@)
    uint time; // user creation time
    address addr; // address of user
    uint followerCount; // user follower count
    address[] followers; // addresses of followers
    uint followingCount; // user following count
    address[] following; // addressses of following
    uint[] posts; // memeIds of posts
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

  constructor(UME _umeToken) public {
    umeToken = _umeToken;
  }
  function newAccount(address account, string memory userName, string memory userAddress) public {
    require(msg.sender==account, 'Error: account must be account creator');
    require(bytes(userName).length > 0, 'Error: userName must have characters');
    require(bytes(userAddress).length > 0, 'Error: userAddress must have characters');
    userCount++;
    users[account] = User(
      userCount, // user id
      userName, // user name
      userAddress, // user address
      block.timestamp, // user creation time
      account, // address of user
      0, // follower count
      new address[](0), // addresses of followers
      0, // following count
      new address[](0), // addresses of following
      new uint[](0) // memeIds of posts
    );
  }

  function newMeme(address account, string memory _memeHash, string memory _memeText, address[] memory _tags, uint _parentId, uint _originId) public {
    require(bytes(_memeHash).length > 0, 'Error: meme hash doesn\'t exist');
    require(bytes(_memeText).length > 0, 'Error: meme text doesn\'t exist');
    require(msg.sender==account, 'Error: poster must be operating account');
    require(msg.sender != address(0x0), 'Error: author address doesn\'t exist');

    // increment meme id
    memeCount++;
    // set parent & origin id's to memeId if
    if (_parentId == 0) {
      _parentId = memeCount;
    }
    if (_originId == 0) {
      _originId = memeCount;
    }

    // set meme to user address
    usersByMeme[memeCount] = msg.sender;
    // map memeId to new meme (if parent & origin)
    memes[memeCount] = Meme(
      memeCount, // meme id
      block.timestamp, // meme time
      _memeHash, // meme hash
      _memeText, // meme text
      0, // like count
      new address[](0), // likers
      _tags, // tagged
      new uint[](0), // response array
      _parentId, // parent
      _originId, // origin
      msg.sender // author
    );
    // if responding to a single post, then mint respond token
    if(memeCount!=_parentId && _parentId==_originId) {
      umeToken.mintRespond(account, usersByMeme[_parentId], _memeHash);
    } // if responding to a thread, mint respond token for parent, curate token for original
    else if(memeCount!=_parentId && _parentId!=_originId) {
      umeToken.mintRespond(account, usersByMeme[_parentId], _memeHash);
      umeToken.mintCurate(account, usersByMeme[_originId], _memeHash);
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
    require(account!=usersByMeme[memeId], 'Error: cannot like one\'s own meme');
    require(account==msg.sender, 'Error: liker must be operating account');
    require(usersByMeme[memeId]!=address(0x0), 'Error: Meme must have address');
    require(memes[memeId].time!=0, 'Error: Meme must have creation time');
    require(memeCount > 0, 'Error: Meme must have id');

    // fetch meme from blockchain
    Meme memory _meme = memes[memeId];

    // set memory to _meme.likers length plus one
    address[] memory _likers = new address[](_meme.likers.length+1);

    // check if account has already liked meme
    for(uint i = 0; i < _meme.likers.length; i++) {
      require(account!=_meme.likers[i], 'Error: liker has already liked account');
    // populate address array with existing _meme.likers
      _likers[i] = _meme.likers[i];
    }
    // increment meme's likes
    _meme.likes++;
    // set likers to
    _likers[_likers.length-1] = msg.sender;
    _meme.likers = _likers;
    memes[memeId] = _meme;

    // mint like token
    umeToken.mintLike(msg.sender, usersByMeme[memeId], _meme.hash);
  }

  function follow(address accountFrom, address accountTo) public {
    require(accountFrom==msg.sender, 'Error: follower must be operating account');
    require(accountFrom!=accountTo, 'Error: same account');
    // fetch user from blockchain
    User memory _userFrom = users[accountFrom];
    User memory _userTo = users[accountTo];

    // set memory to userFrom following & userTo's follower count + 1
    address[] memory _userFromFollowing = new address[](_userFrom.following.length+1);
    address[] memory _userToFollowers = new address[](_userTo.followers.length+1);
    // populate userFromFollowing & userToFollowers with existing following/followers
    for(uint i = 0; i < _userFrom.following.length; i++) {
      _userFromFollowing[i] = _userFrom.following[i];
    }
    for(uint i = 0; i < _userTo.followers.length; i++) {
      _userToFollowers[i] = _userTo.followers[i];
    }
    // increment _userFrom's following & _userTo's followers
    _userFrom.followerCount++;
    _userTo.followingCount++;
    // update last element of _userFromFollowing to accountTo
    _userFromFollowing[_userFromFollowing.length-1] = accountTo;
    // update last element of _userToFollowers to accountFrom
    _userToFollowers[_userToFollowers.length-1] = accountFrom;
    // update _userFrom.following & _userTo.followers to new memory arrays
    _userFrom.following = _userFromFollowing;
    _userTo.followers = _userToFollowers;
    // put _userFrom & _userTo back onto the blockchain
    users[accountFrom] = _userFrom;
    users[accountTo] = _userTo;
    umeToken.mintFollow(msg.sender, accountTo);
  }

  function getLikers(uint memeId) public view returns(address[] memory) {
    Meme memory _meme = memes[memeId];
    address[] memory _likers = _meme.likers;
    return _likers;
  }
  function getTags(uint memeId) public view returns(address[] memory) {
    Meme memory _meme = memes[memeId];
    address[] memory _tags = _meme.tags;
    return _tags;
  }
  function getResponses(uint memeId) public view returns(uint[] memory) {
    Meme memory _meme = memes[memeId];
    uint[] memory _responses = _meme.responses;
    return _responses;
  }
  function getFollowers(address account) public view returns(address[] memory) {
    User memory _user = users[account];
    address[] memory _followers = _user.followers;
    return _followers;
  }
  function getFollowing(address account) public view returns(address[] memory) {
    User memory _user = users[account];
    address[] memory _following = _user.following;
    return _following;
  }
}
