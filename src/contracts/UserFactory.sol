// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UserStorage.sol";

contract UserFactory {

  UserStorage private userStorage;

  address public signer;

  event NewUser(
         address indexed account,
         bytes32 userName,
         bytes32 userAddr,
         uint time);
  event DeletedUser(
         address indexed account,
         uint time);
  event SignerChanged(
         address indexed from,
         address indexed to);

  constructor(UserStorage _userStorage)
              public {
    signer = msg.sender;
    userStorage = _userStorage;
  }

  function newUser(
            address _account,
            bytes32 _userName,
            bytes32 _userAddress)
            public {
    require(
      msg.sender==signer,
      'Error: account must be interface');
    userStorage.increaseUserCount();
    // set user to account address
    userStorage.setUser( _account, UserStorage.User(
      keccak256(abi.encodePacked(userStorage.userCount())), // user id hashed through keccak
      _userName, // user name
      _userAddress, // user address
      block.timestamp, // user creation time
      _account, // address of user
      string(''), // bio
      string(''), // profile pic
      new address[](0), // addresses of followers
      new address[](0), // addresses of following
      new address[](0), // addresses of unfollowers
      new address[](0), // addresses of unfollowing
      new bytes32[](0) // memeIds of posts
    ));
    emit NewUser(_account, _userName, _userAddress, block.timestamp);
  }
  function deleteUser(
            address _account,
            bool failSafe)
            public {
    require(
      msg.sender==signer && failSafe==true,
      'Error: account must be interface');
    require(
      userStorage.getAddr(_account)==_account,
      'Error: account doesn\'t exist');

    // remove followers and following here
    userStorage.deleteUser(_account);
    emit DeletedUser(_account, block.timestamp);
  }

  // pass signer role to interface
  function passInterfaceSigner(address _userInterface)
            public returns(bool) {
    require(
      msg.sender==signer,
      'Error: msg.sender must be factorySigner');

    signer = _userInterface;
    emit SignerChanged(msg.sender, signer);
    return true;
  }
}
