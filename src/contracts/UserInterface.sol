// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./Follow.sol";
import "./Like.sol";
import "./Post.sol";
import "./Boost.sol";
import "./UME.sol";
import "./MemeStorage.sol";
import "./UserFactory.sol";
import "./UserStorage.sol";

contract UserInterface {

  UME private umeToken;
  MemeStorage private memeStorage;
  UserStorage private userStorage;
  UserFactory private userFactory;

  Post private post;
  Like private like;
  Follow private follow;
  Boost private boost;

  bytes32 zeroBytes;

  struct User {
    uint id; // user number in order
    string name; // user name
    string userAddr; // user address (@)
    uint time; // user creation time
    address addr; // address of user
    address[] followers; // addresses of followers
    address[] following; // addressses of following
    uint[] posts; // memeIds of posts
  }

  event NewUser(
    address indexed account,
    bytes32 userName,
    bytes32 userAddress);
  event ChangedUserName(
    address indexed account,
    bytes32 userName);
  event ChangedUserAddress(
    address indexed account,
    bytes32 userAddress);

  constructor(
    UME _umeToken,
    MemeStorage _memeStorage,
    UserStorage _userStorage,
    UserFactory _userFactory,
    Post _post,
    Like _like,
    Follow _follow,
    Boost _boost
  ) public {
    umeToken = _umeToken;
    memeStorage = _memeStorage;
    userStorage = _userStorage;
    userFactory = _userFactory;
    post = _post;
    like = _like;
    follow = _follow;
    boost = _boost;
  }

  function newUser(
    address _account,
    bytes memory _userName,
    bytes memory _userAddress
  ) public {
    require(
      msg.sender==_account,
      'Error: account must be account creator');
    require(
      _userName.length>1 &&
      _userName.length<=32,
      'Error: userName must be between 2 & 32 characters');
    require(
      _userAddress[0]==bytes1('@'),
      'Error: first element of string must be "@"');
    require(
      _userAddress.length>2 &&
      _userAddress.length<=32,
      'Error: userAddress must be between 2 & 32 characters');
    require(
      userStorage.getAddr(_account)!=_account,
      'Error: account already exists');
    require(
      userStorage.getAddr(_account)==address(0x0),
      'Error: user address already exists');

    bytes32 _un = _bytesToBytes32(_userName);
    bytes32 _ua = _bytesToBytes32(_userAddress);
    userFactory.newUser(_account, _un, _ua);
    emit NewUser(_account, _un, _ua);
  }
  function changeUserName(
    address _account,
    bytes memory _userName
  ) public {
    bytes32 _un = _bytesToBytes32(_userName);
    require(
      msg.sender==_account,
      'Error: operator must be account owner');
    require(
      userStorage.getName(_account)!=_un,
      'Error: must be different username');
    require(
      _userName.length>1 &&
      _userName.length<=32,
      'Error: userName must be between 2 & 32 characters');
    require(
      userStorage.getId(_account)!=0,
      'Error: must have an existing account');

    userStorage.setUserName(_account, _un);
    emit ChangedUserName(_account, _un);
  }
  function changeUserAddress(
    address _account,
    bytes memory _userAddress
  ) public {
    bytes32 _ua = _bytesToBytes32(_userAddress);
    require(
      msg.sender==_account,
      'Error: operator must be account owner');
    require(
      _userAddress[0]==bytes1('@'),
      'Error: first element of string must be "@"');
    require(
      _userAddress.length>2 &&
      _userAddress.length<=32,
      'Error: userAddress must be between 2 & 32 characters');
    require(
      userStorage.getUserAddr(_account)!=_ua,
      'Error: must be different user address');
    require(
      userStorage.usersByUserAddr(_ua)==_account,
      'Error: user address must exist at current address');

    userStorage.setUserAddress(_account, _ua);
    emit ChangedUserAddress(_account, _ua);
  }

  // Meme posting functionality
  function newMeme(
    address _account,
    string memory _postText,
    address[] memory _tags,
    bytes32 _parentId,
    bytes32 _originId
  ) public {
    require(
      _account==msg.sender,
      'Error: wrong account calling post');
    require(
      bytes(_postText).length > 0,
      'Error: meme must have text');
    require(
      userStorage.getAddr(_account)!=address(0x0),
      'Error: user doesn\'t have account');
    require(
      (_parentId==zeroBytes && _originId==zeroBytes) ||
      userStorage.usersByMeme(_parentId)!=address(0x0),
      'Error: either parent&origin are zero or they must exist');
    // post new meme
    post.newMeme(_account, _postText, _tags, _parentId, _originId);
  }
  function rememe(
    address _account,
    bytes32 _memeId
  ) public {
    require(
      _account==msg.sender,
      'Error: wrong account calling post');
    require(
      userStorage.getAddr(_account)!=address(0x0),
      'Error: user doesn\'t have account');
    require(
      memeStorage.getVisibility(_memeId)==true,
      'Error: reposted meme doesn\'t exist');
    // repost meme
    post.rememe(_account, _memeId);
  }
  function quoteMeme(
    address _account,
    string memory _postText,
    address[] memory _tags,
    bytes32 _parentId,
    bytes32 _originId,
    bytes32 _memeId
  ) public {
    require(
      _account==msg.sender,
      'Error: wrong account calling post');
    require(
      bytes(_postText).length > 0,
      'Error: meme must have text');
    require(
      userStorage.getAddr(_account)!=address(0x0),
      'Error: user doesn\'t have account');
    require(
      (_parentId==zeroBytes && _originId==zeroBytes) ||
      memeStorage.getVisibility(_parentId)==true,
      'Error: either parent&origin are zero or they must exist');
    require(
      memeStorage.getVisibility(_memeId)==true,
      'Error: repost must exist');
    post.quoteMeme(_account, _postText, _tags, _parentId, _originId, _memeId);
  }

  function deleteMeme(
    address _account,
    bytes32 _memeId
  ) public {
    require(
      _account==msg.sender,
      'Error: only account can delete meme');
    post.deleteMeme(_memeId);
  }


  // like functions
  function likeMeme(
    address _account,
    bytes32 _memeId
  ) public {
     require(
       _account==msg.sender,
       'Error: liker must be operating account');
     require(
       userStorage.getAddr(_account)!=address(0x0),
       'Error: Meme liked must have address');
     require(
       memeStorage.getAuthor(_memeId)!=address(0x0),
       'Error: Meme must exist');

     like.likeMeme(_account, _memeId);
  }

  function followUser(
    address _from,
    address _to
  ) public {
    require(
      _from==msg.sender,
      'Error: follower must be operating account');
    require(
      _from!=_to,
      'Error: same account');
    require(
      userStorage.getAddr(_from)!=address(0x0) &&
      userStorage.getAddr(_to)!=address(0x0),
      'Error: both follower and followee must have accounts');

    follow.follow(_from, _to);
  }

  function boostMeme(
    address _account,
    bytes32 _memeId,
    uint _boostNumber
  ) public {
    require(
      _account==msg.sender,
      'Error: booster must be msg.sender');
    require(
      umeToken.balanceOf(_account)>=_boostNumber,
      'Error: booster must have tokens in balance');
    boost.boostCall(_account, _memeId, _boostNumber);
  }
  function unBoostMeme(
    address _account,
    bytes32 _memeId,
    uint _boostNumber
  ) public {
    require(
      _account==msg.sender,
      'Error: booster must be msg.sender');
    require(
      umeToken.balanceOf(_account)>=_boostNumber,
      'Error: booster must have tokens in balance');
    boost.unBoostCall(_account, _memeId, _boostNumber);
  }

  // helper functions
  function _bytesToBytes32(bytes memory source) public pure returns(bytes32 result) {
    if(source.length==0) return 0x0;
    assembly {
      result := mload(add(source, 32))
    }
  }

  function encode(uint num) public pure returns(bytes32) {
    return keccak256(abi.encodePacked(num));
  }

  function _deleteUints(uint[] memory array, uint index) private pure returns(uint[] memory) {
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
