// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./MemeFactory.sol";
import "./MemeStorage.sol";
import "./UME.sol";

contract Post {
  // public variables
  UME private umeToken;
  MemeFactory private memeFactory;
  MemeStorage private memeStorage;

  address private interfaceSigner;
  bytes32 zeroBytes;

  event InterfaceSignerChanged(address indexed from, address indexed to);

  constructor(
    UME _umeToken,
    MemeFactory _memeFactory,
    MemeStorage _memeStorage
  ) public {
    umeToken = _umeToken;
    memeFactory = _memeFactory;
    memeStorage = _memeStorage;

    interfaceSigner = msg.sender;
  }

  // posting meme functions
  function newMeme(
    address _account,
    string memory _memeText,
    address[] memory _tags,
    bytes32 _parentId,
    bytes32 _originId
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: poster must be operating account');
    memeFactory.newMeme(_account, _memeText, _tags, _parentId, _originId, zeroBytes);
    umeToken.mintPost(_account, _memeText);
  }

  function rememe(
    address _account,
    bytes32 _memeId
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: poster must be operating account');
    memeFactory.newMeme(_account, '', new address[](0), zeroBytes, zeroBytes, _memeId);
    if(_account!=memeStorage.getAuthor(_memeId))
      umeToken.mintRepost(_account, memeStorage.getAuthor(_memeId));
  }
  function quoteMeme(
    address _account,
    string memory _memeText,
    address[] memory _tags,
    bytes32 _parentId,
    bytes32 _originId,
    bytes32 _repostId
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: poster must be operating account');
    memeFactory.newMeme(_account, _memeText, _tags, _parentId, _originId, _repostId);
    if(_account!=memeStorage.getAuthor(_repostId))
      umeToken.mintRepost(_account, memeStorage.getAuthor(_parentId));
  }

  function deleteMeme(
    bytes32 _memeId
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: only interface signer can delete meme');
    memeStorage.deleteMeme(_memeId);
  }

  // set caller role to User upon deployment
  function passInterfaceSigner(address _userInterface) public returns (bool) {
    require(
      msg.sender == interfaceSigner,
      'Error, only deployer can pass interface signer role');
    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
}
