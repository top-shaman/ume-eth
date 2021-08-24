// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./Follow.sol";
import "./MemeStorage.sol";
import "./Post.sol";
import "./UME.sol";
import "./UserStorage.sol";

contract UserInterface {

  UME private umeToken;
  MemeStorage private memeStorage;
  UserStorage private userStorage;

  Post private post;
  Like private like;
  Follow private follow;

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
    address account,
    string userName,
    string userAddress
  );
  event ChangedUserName(
    address account,
    string userName
  );
  event ChangedUserAddress(
    address account,
    string userAddress
  );
  event Followed(
    address from,
    address to
  );

  constructor(
    UME _umeToken,
    MemeStorage _memeStorage,
    UserStorage _userStorage,
    Follow _follow,
    Post _post
  ) public {
    umeToken = _umeToken;
    userStorage = _userStorage;
    follow = _follow
    post = _post;
  }

  function newUser(
    address _account,
    string memory _userName,
    string memory _userAddress
  ) public {
    require(msg.sender==_account,
            'Error: account must be account creator');
    require(bytes(_userName).length>1 &&
            bytes(_userName).length<=32,
            'Error: userName must be between 2 & 32 characters');
    require(bytes32(_userAddress)[0]==bytes1('@'),
            'Error: first element of string must be "@"');
    require(bytes(_userAddress).length>2 &&
            bytes(_userAddress).length<=32,
            'Error: userAddress must be between 2 & 32 characters');
    require(userStorage.getAddr(_account)!=_account,
            'Error: account already exists');
    require(userStorage.usersByUserAddr(_userAddress)==address(0x0),
            'Error: user address already exists');

    userFactory.newUser(_account, bytes32(_userName), bytes32(_userAddress));
    emit NewUser(account, userName, userAddress);
  }
  function changeUserName(
    address _account,
    string memory _userName
  ) public {
    require(msg.sender==_account,
            'Error: operator must be account owner');
    require(userStorage.users(_account).name!=bytes32(_userName),
            'Error: must be different username');
    require(bytes(_userName).length>1 &&
            bytes(_userName).length<=32,
            'Error: userName must be between 2 & 32 characters');
    require(userStorage.users(_account).id!=0,
            'Error: must have an existing account');

    userStorage.setUserName(_account, bytes32(_userName));
    emit ChangedUserName(_account, _userName);
  }
  function changeUserAddress(
    address _account,
    string memory _userAddress
  ) public {
    require(msg.sender==_account,
            'Error: operator must be account owner');
    require(bytes(_userAddress[0])==bytes1('@'),
            'Error: first element of string must be "@"');
    require(bytes(_userAddress).length>2 &&
            bytes(_userAddress).length<=32,
            'Error: userAddress must be between 2 & 32 characters');
    require(userStorage.getAddr(_account)!=_userAddress,
            'Error: must be different user address');
    require(userStorage.usersByUserAddr(_userAddress)==_account,
            'Error: user address must exist at current address');

    userStorage.setUserAddress(_account, bytes32(_userAddress));
    emit ChangedUserAddress(_account, userAddress);
  }

  // Meme posting functionality
  function newMeme(
    address _account,
    string memory _postText,
    address[] memory _tags,
    bytes32 _parentId,
    bytes32 originId
  ) public {
    require(_account==msg.sender,
            'Error: wrong account calling post');
    require(bytes(_postText).length > 0,
            'Error: meme must have text');
    require(userStorage.getAddr(_account).addr!=address(0x0),
            'Error: user doesn\'t have account');
    require(memeStorage.getVisibilty(_parentId),
            'Error: parent&origin must exist');
    // post new meme
    post.newMeme(account, postText, tags, parentId, originId);
  }
  function rememe(
    address _account,
    bytes32 _memeId
  ) public {
    require(_account==msg.sender,
            'Error: wrong account calling post');
    require(userStorage.getAddr(_account)!=address(0x0),
            'Error: user doesn\'t have account');
    // repost meme
    post.rememe(account, memeId);
  }
  function quoteMeme(
    address _account,
    string memory _postText,
    address[] memory _tags,
    uint _parentId,
    uint _originId,
    uint _memeId
  ) public {
    require(_account==msg.sender,
            'Error: wrong account calling post');
    require(bytes(_postText).length > 0,
            'Error: meme must have text');
    require(userStorage.getAddr(_account)!=address(0x0),
            'Error: user doesn\'t have account');
    require(memeStorage.getVisibilitiy(_parentId),
            'Error: parent must exist');
    post.quoteMeme(account, postText, tags, parentId, originId, memeId);
  }

  function deleteMeme(address account, uint memeId) public {
    require(account==msg.sender, 'Error: only account can delete meme');
    post.deleteMeme(account, memeId);
  }


  // like functions
  function likeMeme(address account, uint memeId) public {
     require(account!=usersByMeme[memeId], 'Error: cannot like one\'s own meme');
     require(account==msg.sender, 'Error: liker must be operating account');
     require(usersByMeme[memeId]!=address(0x0), 'Error: Meme liked must have address');
     require(post.memeCount() > 0, 'Error: Meme must have id');

     like.likeMeme(account, memeId);
  }

  function follow(
    address accountFrom,
    address accountTo
  ) public {
    require(accountFrom==msg.sender,
            'Error: follower must be operating account');
    require(accountFrom!=accountTo,
            'Error: same account');
    require(userStorage.getUserAddr(accountFrom).length>0 &&
            userStorage.getUserAddr(accountTo).length>0,
            'Error: both follower and followee must have accounts');

    follow.follow(accountFrom, accountTo);
    emit Followed(accountFrom, accountTo);
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
