// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";
import "./UserStorage.sol";

contract Follow {
  UME private umeToken;
  UserStorage private userStorage;

  address public interfaceSigner;

  event FollowSignerChanged(address indexed from, address indexed to);

  constructor (UME _umeToken, UserStorage _userStorage) public {
    umeToken = _umeToken;
    userStorage = _userStorage;

    interfaceSigner = msg.sender;
  }

  function follow(
    address _from,
    address _to
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: operator must be user interface');
    _addFollower(_from, _to);
    _addFollowing(_from, _to);
    umeToken.mintFollow(_from, _to);
  }

  function _addFollower(
    address _from,
    address _to
  ) private {
    // create new memory instance of an array one larger than current follower count
    address[] memory _oldFollowers = userStorage.getFollowers(_to);
    uint _followerCount = _oldFollowers.length;
    address[] memory _newFollowers = new address[](_followerCount+1);
    for (uint i = 0; i < _followerCount; i++) {
      require(_oldFollowers[i]!=_from, 'Error: account already a follower');
      _newFollowers[i] = _oldFollowers[i];
    }
    // set last element in new array to _from
    _newFollowers[_followerCount] = _from;
    // update followers to storage
    userStorage.setFollowers(_to, _newFollowers);
  }
  function _addFollowing(
    address _from,
    address _to
  ) private {
    // create new memory instance of an array one larger than current following count
    address[] memory _oldFollowing = userStorage.getFollowing(_from);
    uint _followingCount = _oldFollowing.length;
    address[] memory _newFollowing = new address[](_followingCount+1);
    for (uint i = 0; i < _followingCount; i++) {
      require(_oldFollowing[i]!=_to, 'Error: account already a following');
      _newFollowing[i] = _oldFollowing[i];
    }
    // set last element in new array to _from
    _newFollowing[_followingCount] = _to;
    // update followings to storage
    userStorage.setFollowing(_from, _newFollowing);
  }

  function passInterfaceSigner(address _userInterface) public returns(bool){
    require(
      interfaceSigner==msg.sender,
      'Error: msg.sender must be interfaceSigner');
    interfaceSigner = _userInterface;
    emit FollowSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
}
