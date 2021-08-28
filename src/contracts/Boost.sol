// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./MemeStorage.sol";
import "./UME.sol";

contract Boost {
  UME private umeToken;
  MemeStorage private memeStorage;

  address public interfaceSigner;

  event InterfaceSignerChanged(address from, address to);

  constructor(UME _umeToken, MemeStorage _memeStorage) public {
    umeToken = _umeToken;
    memeStorage = _memeStorage;
    interfaceSigner = msg.sender;
  }

  function boostCall(
    address _account,
    bytes32 _memeId,
    uint _boostNumber
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: msg.sender must be interfaceSigner');
    umeToken.burn(_account, _boostNumber);
    memeStorage.addBoost(_memeId, _boostNumber);
  }
  function unBoostCall(
    address _account,
    bytes32 _memeId,
    uint _boostNumber
  ) public {
    require(
      msg.sender==interfaceSigner,
      'Error: msg.sender must be interfaceSigner');
    uint _currentBoost = memeStorage.getBoost(_memeId);
    if(_boostNumber>_currentBoost) _boostNumber=_currentBoost;
    umeToken.burn(_account, _boostNumber);
    memeStorage.subtractBoost(_memeId, _boostNumber);
  }

  function passInterfaceSigner(address _userInterface) public returns (bool) {
    require(
      msg.sender == interfaceSigner,
      'Error: msg.sender must be interfaceSigner');
    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
}
