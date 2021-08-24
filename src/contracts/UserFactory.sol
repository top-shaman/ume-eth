// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UserStorage.sol";

contract UserFactory {

  UserStorage private userStorage;

  address private signer;

  event NewUser(address account, string userName, string userAddr);
  event DeletedUser(uint id, uint time);
  event SignerChanged(address from, address to);

  struct User {
    bytes32 id; // user number in order
    bytes32 name; // user name
    bytes32 userAddr; // user address (@)
    uint time; // user creation time
    address addr; // address of user
    address[] followers; // addresses of followers
    address[] following; // addressses of following
    uint[] posts; // memeIds of posts
  }

  constructor(UserStorage _userStorage) public {
    signer = msg.sender;
    userStorage = _userStorage;
  }

  function newUser(
    address _account,
    bytes32 _userName,
    bytes32 _userAddress
  ) public {
    require(_account==signer, 'Error: account must be interface');

    userStorage.increaseUserCount();
    // set user to account address
    userStorage.setUser(_account,  User(
      keccak256(abi.encodePacked(userStorage.getUserCount())), // user id hashed through keccak
      _userName, // user name
      _userAddress, // user address
      block.timestamp, // user creation time
      _account, // address of user
      new address[](0), // addresses of followers
      new address[](0), // addresses of following
      new uint[](0) // memeIds of posts
    ));
    emit NewUser(_account, _userName, _userAddress, block.timestamp);
  }
  function deleteUser(
    address _account,
    bool failSafe
  ) public {
    require(_account==signer && failSafe==true,
            'Error: account must be interface');
    require(userStorage.getAddr(_account)==account,
            'Error: account doesn\'t exist');

    bytes32 _deletedUser = userStorage.getId(_account);
    // remove followers and following here
    userStorage.deleteUser(address _account);
    emit DeletedUser(_deletedUser, block.timestamp);
  }

  // pass signer role to interface
  function passSigner(address userInterface) public returns(bool) {
    require(msg.sender==signer,
            'Error: msg.sender must be factorySigner');

    signer = userInterface;
    emit SignerChanged(msg.sender, signer);
    return true;
  }
}
