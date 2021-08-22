// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";
import "./Post.sol";

contract User {

  UME private umeToken;
  Post private post;

  string public name = "uMe";
  uint public userCount = 0;

  mapping(address => User) public users; // address to Users map
  mapping(uint => address) public usersByMeme; // memeId to user addresses

  struct User {
    uint id; // user number in order
    string name; // user name
    string userAddr; // user address (@)
    uint time; // user creation time
    address addr; // address of user
    uint followerCount; // user follower count
    address[] followers; // addresses of followers
    uint followingCount; // user following count
    address[] following; // addressses of following
    uint postCount; // post count
    uint[] posts; // memeIds of posts
  }

  constructor(UME _umeToken, Post _post) public {
    umeToken = _umeToken;
    post = _post;
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
      0, // post count
      new uint[](0) // memeIds of posts
    );
  }

  function newMeme(address account, string memory postText, address[] memory tags, uint parentId, uint originId) public {
    require(account==msg.sender, 'Error: wrong account calling post');
    require(bytes(postText).length > 0, 'Error: meme must have text');
    require(users[account].addr!=address(0x0), 'Error: user doesn\'t have account');
    post.newMeme(account, postText, tags, parentId, originId);
    // set meme to user address
    User memory _user = users[account];
     // create memory array with length one greater than _user.posts length
     uint[] memory _posts = new uint[](_user.posts.length+1);
     // populate memory array
     for(uint i = 0; i < _user.posts.length; i++) {
       _posts[i] = _user.posts[i];
     }
     // increment postCount
     _user.postCount++;
     // insert new post in last slot of array
     _posts[_posts.length-1] = post.memeCount();
     // set posts of _user instance to _posts
     _user.posts = _posts;
     users[account] = _user;
     usersByMeme[post.memeCount()] = msg.sender;
  }
  function deleteMeme(address account, uint memeId) public {
    require(account==msg.sender, 'Require: only account can delete meme');
    post.deleteMeme(account, memeId);
    User memory _user = users[account];
     uint memeIndex;
     for(uint i = 0; i < _user.posts.length; i++) {
       if(_user.posts[i]==memeId) {
         memeIndex = i;
         break;
       }
     }
     _user.postCount--;
     _user.posts = _deleteUints(_user.posts, memeIndex);
     users[account] = _user;
  }


  // like functions
  function likeMeme(address account, uint memeId) public {
     require(account!=usersByMeme[memeId], 'Error: cannot like one\'s own meme');
     require(account==msg.sender, 'Error: liker must be operating account');
     require(usersByMeme[memeId]!=address(0x0), 'Error: Meme liked must have address');
     require(post.memeCount() > 0, 'Error: Meme must have id');

     post.likeMeme(account, memeId);
   }

  function follow(address accountFrom, address accountTo) public {
    require(accountFrom==msg.sender, 'Error: follower must be operating account');
    require(accountFrom!=accountTo, 'Error: same account');

    _addFollower(accountFrom, accountTo);
    _addFollowing(accountFrom, accountTo);

    umeToken.mintFollow(msg.sender, accountTo);
  }
  function _addFollower(address accountFrom, address accountTo) private {
    User memory _userTo = users[accountTo];
    // incrememnt _userTo instance's followerCount
    _userTo.followerCount++;
    // create new memory instance of an array one larger than current follower count
    address[] memory _followers = new address[](_userTo.followers.length+1);
    for (uint i = 0; i < _userTo.followers.length; i++) {
      _followers[i] = _userTo.followers[i];
    }
    // set last element in new array to accountFrom
    _followers[_followers.length-1] = accountFrom;
    _userTo.followers = _followers;
    // update instance to blockchain
    users[accountTo] = _userTo;
  }
  function _addFollowing(address accountFrom, address accountTo) private {
    User memory _userFrom = users[accountFrom];
    // incrememnt _userTo instance's followerCount
    _userFrom.followingCount++;
    // create new memory instance of an array one larger than current follower count
    address[] memory _following = new address[](_userFrom.following.length+1);
    for (uint i = 0; i < _userFrom.following.length; i++) {
      _following[i] = _userFrom.following[i];
    }
    // set last element in new array to accountTo
    _following[_following.length-1] = accountTo;
    _userFrom.following  = _following;
    // update instance to blockchain
    users[accountFrom] = _userFrom;
  }

  // getter functions for User
  function getId(address account) public view returns(uint) {
    return users[account].id;
  }
  function getName(address account) public view returns(string memory) {
    return users[account].name;
  }
  function getUserAddr(address account) public view returns(string memory) {
    return users[account].userAddr;
  }
  function getFollowerCount(address account) public view returns(uint) {
    return users[account].followerCount;
  }
  function getFollowers(address account) public view returns(address[] memory) {
    return users[account].followers;
  }
  function getFollowingCount(address account) public view returns(uint) {
    return users[account].followingCount;
  }
  function getFollowing(address account) public view returns(address[] memory) {
    return users[account].following;
  }
  function getPostCount(address account) public view returns (uint) {
    return users[account].postCount;
  }
  function getPosts(address account) public view returns (uint[] memory) {
    return users[account].posts;
  }
  function _deleteUints(uint[] memory array, uint index) private returns(uint[] memory) {
    uint[] memory _array = new uint[](array.length-1);
    for(uint i = 0; i < index; i++) {
      _array[i] = array[i];
    }
    for(uint i = index; i < _array.length; i++) {
      _array[i] = array[i+1];
    }
    return _array;
  }
}
