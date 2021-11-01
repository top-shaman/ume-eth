// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./MemeStorage.sol";
import "./UME.sol";

contract Boost {
  UME private umeToken;
  MemeStorage private memeStorage;

  address public interfaceSigner;
  address public likeSigner;
  address public factorySigner;
  address public valueSigner;

  // boost values
  uint public postBoostValue = 8;
  uint public likeBoostValue = 5;
  uint public tagBoostValue = 0;
  uint public respondBoostValue = 4;
  uint public curateBoostValue = 4;
  uint public repostBoostValue = 4;

  event InterfaceSignerChanged(
        address indexed from,
        address indexed to);
  event LikeSignerChanged(
        address indexed from,
        address indexed to);
  event FactorySignerChanged(
        address indexed from,
        address indexed to);
  event ValueSignerChanged(
        address indexed from,
        address indexed to);
  event Promote(
        address indexed promoter,
        bytes32 indexed memeId,
        uint amount);
  event Demote(
        address indexed demoter,
        bytes32 indexed memeId,
        uint amount);

  constructor(UME _umeToken,
              MemeStorage _memeStorage)
              public {
    umeToken = _umeToken;
    memeStorage = _memeStorage;
    interfaceSigner = msg.sender;
    factorySigner = msg.sender;
    likeSigner = msg.sender;
    valueSigner = msg.sender;
  }

  function boostCall(
            address _account,
            bytes32 _memeId,
            uint _boostNumber)
            public {
    require(
      msg.sender==interfaceSigner,
      'Error: msg.sender must be interfaceSigner');
    umeToken.burn(_account, _boostNumber);
    memeStorage.addBoost(_memeId, _boostNumber);
    emit Promote(_account, _memeId, _boostNumber);
  }
  function unBoostCall(
            address _account,
            bytes32 _memeId,
            uint _boostNumber)
            public {
    require(
      msg.sender==interfaceSigner,
      'Error: msg.sender must be interfaceSigner');
    uint _currentBoost = memeStorage.getBoost(_memeId);
    if(_boostNumber>_currentBoost) _boostNumber=_currentBoost;
    umeToken.burn(_account, _boostNumber);
    memeStorage.subtractBoost(_memeId, _boostNumber);
    emit Demote(_account, _memeId, _boostNumber);
  }

  function postBoost(
            bytes32 _memeId)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memeStorage.addBoost(_memeId, postBoostValue);
  }
  function likeBoost(
            bytes32 _memeId)
            public {
    require(
      msg.sender==likeSigner,
      'Error: msg.sender must be likeSigner');
    memeStorage.addBoost(_memeId, likeBoostValue);
  }
  function tagBoost(
            bytes32 _memeId)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memeStorage.addBoost(_memeId, tagBoostValue);
  }
  function respondBoost(
            bytes32 _memeId)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memeStorage.addBoost(_memeId, respondBoostValue);
  }
  function curateBoost(
            bytes32 _memeId)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memeStorage.addBoost(_memeId, curateBoostValue);
  }
  function repostBoost(
            bytes32 _memeId)
            public {
    require(
      msg.sender==factorySigner,
      'Error: msg.sender must be factorySigner');
    memeStorage.addBoost(_memeId, repostBoostValue);
  }

  // set new values
  function setPostBoost(uint _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: msg.sender must be valueSigner');
    postBoostValue = _value;
  }
  function setLikeBoost(uint _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: msg.sender must be valueSigner');
    likeBoostValue = _value;
  }
  function setTagBoost(uint _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: msg.sender must be valueSigner');
    tagBoostValue = _value;
  }
  function setRespondBoost(uint _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: msg.sender must be valueSigner');
    respondBoostValue = _value;
  }
  function setCurateBoost(uint _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: msg.sender must be valueSigner');
    curateBoostValue = _value;
  }
  function setRepostBoost(uint _value)
            public {
    require(
      msg.sender==valueSigner,
      'Error: msg.sender must be valueSigner');
    repostBoostValue = _value;
  }

  function passInterfaceSigner(address _userInterface) public returns (bool) {
    require(
      msg.sender == interfaceSigner,
      'Error: msg.sender must be interfaceSigner');
    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, interfaceSigner);
    return true;
  }
  function passLikeSigner(address _userLike) public returns (bool) {
    require(
      msg.sender == likeSigner,
      'Error: msg.sender must be likeSigner');
    likeSigner = _userLike;
    emit LikeSignerChanged(msg.sender, likeSigner);
    return true;
  }
  function passFactorySigner(address _userFactory) public returns (bool) {
    require(
      msg.sender == factorySigner,
      'Error: msg.sender must be factorySigner');
    factorySigner = _userFactory;
    emit FactorySignerChanged(msg.sender, factorySigner);
    return true;
  }
  function passValueSigner(address _userValue) public returns (bool) {
    require(
      msg.sender == valueSigner,
      'Error: msg.sender must be valueSigner');
    valueSigner = _userValue;
    emit ValueSignerChanged(msg.sender, valueSigner);
    return true;
  }
}
