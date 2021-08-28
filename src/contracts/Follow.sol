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
  }

  function _addFollower(
    address _from,
    address _to
  ) private {
    // create new memory instance of an array one larger than current follower count
    bool _alreadyFollower=false;
    bool _isUnfollower = false;
    address[] memory _oldFollowers = userStorage.getFollowers(_to);
    uint _followerCount = _oldFollowers.length;
    address[] memory _newFollowers = new address[](_followerCount+1);
    for (uint i = 0; i < _followerCount; i++) {
      if(_oldFollowers[i]==_from) {
        _alreadyFollower = true;
        _unFollower(_from, _to, _oldFollowers, i);
        _isUnfollower = true;
        break;
      }
      _newFollowers[i] = _oldFollowers[i];
    }
    address[] memory _unfollowers = userStorage.getUnfollowers(_to);
    uint _unfollowCount = _unfollowers.length;
    for(uint i = 0; i < _unfollowCount; i++) {
      if(_to==_unfollowers[i] && _isUnfollower==false) {
        _alreadyFollower = true;
        userStorage.setFollowers(_to, _newFollowers);
        userStorage.setUnfollowers(_to, _deleteAddress(_unfollowers, i));
        break;
      }
    }
    if(_alreadyFollower!=true && _isUnfollower==false) {
      // set last element in new array to _from
      _newFollowers[_followerCount] = _from;
      // update followers to storage
      userStorage.setFollowers(_to, _newFollowers);
      umeToken.mintFollow(_from, _to);
    }
  }
  function _addFollowing(
    address _from,
    address _to
  ) private {
    // create new memory instance of an array one larger than current following count
    bool _alreadyFollowing=false;
    bool _isUnfollowing = false;
    address[] memory _oldFollowing = userStorage.getFollowing(_from);
    uint _followingCount = _oldFollowing.length;
    address[] memory _newFollowing = new address[](_followingCount+1);
    for (uint i = 0; i < _followingCount; i++) {
      if(_oldFollowing[i]==_to) {
        _alreadyFollowing = true;
        _unFollowing(_from, _to, _oldFollowing, i);
        _isUnfollowing = true;
        break;
      }
      _newFollowing[i] = _oldFollowing[i];
    }
    address[] memory _unfollowing = userStorage.getUnfollowing(_from);
    uint _unfollowCount = _unfollowing.length;
    for(uint i = 0; i < _unfollowCount; i++) {
      if(_from==_unfollowing[i] && _isUnfollowing==false) {
        _alreadyFollowing = true;
        userStorage.setFollowing(_from, _newFollowing);
        userStorage.setUnfollowing(_from, _deleteAddress(_unfollowing, i));
        break;
      }
    }
    if(_alreadyFollowing!=true && _isUnfollowing==false) {
      // set last element in new array to _from
      _newFollowing[_followingCount] = _to;
      // update followings to storage
      userStorage.setFollowing(_from, _newFollowing);
    }
  }

  function _unFollower(
    address _from,
    address _to,
    address[] memory _oldFollowers,
    uint index
  ) private {
    require(
      userStorage.getFollowerCount(_to)>0,
      'Error: no followers');
    address[] memory _oldUnfollowers = userStorage.getUnfollowers(_to);
    userStorage.setFollowers(_to, _deleteAddress(_oldFollowers, index));
    uint _oldUnfollowCount = _oldUnfollowers.length;
    address[] memory _newUnfollowers = new address[](_oldUnfollowCount+1);

    for(uint i = 0; i < _oldUnfollowCount; i++) {
      _newUnfollowers[i] = _oldUnfollowers[i];
    }
    _newUnfollowers[_oldUnfollowCount] = _from;
    userStorage.setUnfollowers(_to, _newUnfollowers);
  }
  function _unFollowing(
    address _from,
    address _to,
    address[] memory _oldFollowing,
    uint index
  ) private {
    require(
      userStorage.getFollowingCount(_from)>0,
      'Error: no following');
    address[] memory _oldUnfollowing = userStorage.getUnfollowing(_from);
    userStorage.setFollowing(_from, _deleteAddress(_oldFollowing, index));
    uint _oldUnfollowCount = _oldUnfollowing.length;
    address[] memory _newUnfollowing = new address[](_oldUnfollowCount+1);

    for(uint i = 0; i < _oldUnfollowCount; i++) {
      _newUnfollowing[i] = _oldUnfollowing[i];
    }
    _newUnfollowing[_oldUnfollowCount] = _to;
    userStorage.setUnfollowing(_from, _newUnfollowing);
  }

  function _deleteAddress(
    address[] memory array,
    uint index
  ) private pure returns(address[] memory) {
    address[] memory _array = new address[](array.length-1);
    for(uint i = 0; i < index; i++) {
      _array[i] = array[i];
    }
    for(uint i = index; i < _array.length; i++) {
      _array[i] = array[i+1];
    }
    return _array;
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
