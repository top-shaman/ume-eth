// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract UserStorage {
  address factorySigner;
  address memeFactorySigner;
  address likeSigner;
  address followSigner;
  address interfaceSigner;

  uint public userCount = 0;

  mapping(address => User) public users; // address to Users map
  mapping(bytes32 => address) public usersByMeme; // memeId to account addresses
  mapping(bytes32 => address) public usersByUserAddr; // userAddr to account address

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

  event FactorySignerChanged(address from, address to);
  event InterfaceSignerChanged(address from, address to);
  event PostSignerChanged(address from, address to);
  event LikeSignerChanged(address from, address to);
  event FollowSignerChanged(address from, address to);

  constructor() public {
    factorySigner = msg.sender;
    memeFactorySigner = msg.sender;
    likeSigner = msg.sender;
    followSigner = msg.sender;
    interfaceSigner = msg.sender;
  }


  // Factory-Specific setters
  function setUser(address _account, User _user) public {
    require(msg.sender==factorySigner,
            'Error: user factory must be signer');
    users[_account] = _user;
    usersByUserAddress[_user.userAddr] = _account;
  }
  function setUser(address _account, User _user) public {
    require(msg.sender==factorySigner,
            'Error: user factory must be signer');
    users[_account] = _user;
    usersByUserAddress[_user.userAddr] = _account;
  }
  function setUsersByUserAddress(bytes32 _userAddr, address _account) public {
    require(msg.sender==factorySigner,
            'Error: user factory must be signer');
    usersByUserAddress[_userAddr] = _account;
  }
  function deleteUser(address _account) public {
    require(msg.sender==factorySigner,
            'Error: user factory must be signer');
    delete users[_account];
  }
  function increaseUserCount() public {
    require(msg.sender==factorySigner,
            'Error: user factory must be signer');
    userCount++;
  }
  // Setters for interface only
  function setUserName(address _account, bytes32 _userName) public {
    require(msg.sender==interfaceSigner, 'Error: user factory must be signer');
    users[_account].name= _userName;
  }
  function setUserAddress(address _account, bytes32 _userAddress) public {
    require(msg.sender==interfaceSigner, 'Error: user factory must be signer');
    users[_account].userAddr = _userAddress;
    usersByUserAddr[_userAddress] = _account;
  }

  // Setters for all signers
  function setUsersByMeme(bytes32 _memeId, address _account) public {
    require(msg.sender==memeFactorySigner,
            'Error: user factory must be signer');
    usersByMeme[_memeId] = _account;
  }

  // set post meme
  function setPosts(address _account,

  // set follow
  function setFollowers(address _account, address[] memory _followers) public {
    users[_account].followers = _followers;
  }
  function setFollowing(address _account, address[] memory _following) public {
    users[_account].following = _following;
  }

  // getter functions for UserStorage
  function getUserCount() public returns(uint){
    return userCount;
  }
  function getId(address _account) public view returns(bytes32) {
    return users[_account].id;
  }
  function getName(address _account) public view returns(bytes32) {
    return users[_account].name;
  }
  function getUserAddr(address _account) public view returns(bytes32) {
    return users[_account].userAddr;
  }
  function getAddr(address _account) public view returns(address) {
    return users[_account].addr;
  }
  function getFollowerCount(address _account) public view returns(uint) {
    return users[_account].followerCount;
  }
  function getFollowers(address _account) public view returns(address[] memory) {
    return users[_account].followers;
  }
  function getFollowerAt(address _account, uint _index) public view returns(address) {
    return users[_account].followers[_index];
  }
  function getFollowingCount(address _account) public view returns(uint) {
    return users[_account].followingCount;
  }
  function getFollowing(address _account) public view returns(address[] memory) {
    return users[_account].following;
  }
  function getFollowingAt(address _account, uint _index) public view returns(address) {
    return users[_account].following[_index];
  }
  function getFollowingCount(address _account) public view returns(uint) {
    return users[_account].followingCount;
  }
  function getFollowing(address _account) public view returns(address[] memory) {
    return users[_account].following;
  }
  function getPostCount(address _account) public view returns (uint) {
    return users[_account].posts.length;
  }
  function getPosts(address _account) public view returns (uint[] memory) {
    return users[_account].posts;
  }

  // pass signer roles
  function passFactorySigner(address _userFactory) public returns(bool){
    require(msg.sender==factorySigner,
            'Error: msg.sender must be factorySigner');

    factorySigner = _userFactory;
    emit FactorySignerChanged(msg.sender, userFactory);
    return true;
  }
  function passInterfaceSigner(address _userInterface) public returns(bool){
    require(msg.sender==interfaceSigner,
            'Error: msg.sender must be factorySigner');

    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
  function passMemeFactorySigner(address _memeFactory) public returns(bool){
    require(msg.sender==postSigner,
            'Error: msg.sender must be memeFactorySigner');

    memeFactorySigner = _memeFactory;
    emit PostSignerChanged(msg.sender, memeFactorySigner);
    return true;
  }
  function passLikeSigner(address _likeSigner) public returns(bool){
    require(msg.sender==likeSigner,
            'Error: msg.sender must be likeSigner');

    likeSigner = _likeSigner;
    emit LikeSignerChanged(msg.sender, likeSigner);
    return true;
  }
  function passFollowSigner(address _followSigner) public returns(bool){
    require(msg.sender==factorySigner,
            'Error: msg.sender must be factorySigner');

    followSigner = _followSigner;
    emit FollowSignerChanged(msg.sender, followSigner);
    return true;
  }
}
