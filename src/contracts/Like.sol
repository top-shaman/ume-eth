// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";
import "./MemeStorage.sol";

contract Like {

  MemeStorage private memeStorage;
  UME private umeToken;

  address public interfaceSigner;

  constructor(UME _umeToken) public {
    umeToken = _umeToken;
    memeStorage = _memeStorage;
    interfaceSigner = msg.sender;
  }

  // like functions
  function likeMeme(address account, uint memeId) public {
    require(msg.sender==interfaceSigner, 'Error: liker must be operating account');

    bool firstLike = true;
    bool unliked = false;
    // remove like if already liked
    for(uint i = 0; i < memes[memeId].likers.length; i++) {
      if(account==memes[memeId].likers[i]) {
        firstLike = false;
        _unLike(account, memeId, i);
        unliked = true;
      }
    } // check for double like minting
    for(uint i = 0; i < memes[memeId].unlikers.length; i++) {
      if(account==memes[memeId].unlikers[i] && unliked==false) {
        firstLike = false;
        _addLike(account, memeId, i, firstLike);
        break;
      }
    }
    if(firstLike==true && unliked==false) {
      _addLike(account, memeId, 0, firstLike);
      // mint like token
      umeToken.mintLike(account, memes[memeId].author /*, memes[memeId].hash*/ );
    }
  }
  // setter functions for Meme
  function _addLike(address account, uint memeId, uint index, bool firstLike) private {
    // fetch meme from blockchain
    Meme memory _meme = memes[memeId];

    if(firstLike==false) {
      _meme.unlikers = _deleteAddress(_meme.unlikers, index);
    }

    // set memory to _meme.likers length plus one
    address[] memory _likers = new address[](_meme.likers.length+1);

    // populate address array with existing _meme.likers
    for(uint i = 0; i < _meme.likers.length; i++) {
      //require(account!=_meme.likers[i], 'Error: liker has already liked account');
      _likers[i] = _meme.likers[i];
    }
    // increment meme's likes
    _meme.likes++;
    // set _likers value to msg.sender at last slot of array
    _likers[_likers.length-1] = account;
    // set likers field of _meme.likers to _likers
    _meme.likers = _likers;
    // set meme at memeId to _meme instance
    memes[memeId] = _meme;
  }
  function _unLike(address account, uint memeId, uint index) private {
    require(memes[memeId].likers.length > 0, 'Error, no likers in meme');
    // fetch meme from blockchain
    Meme memory _meme = memes[memeId];

    // delete liked index, moving all successive elements
    _meme.likers = _deleteAddress(_meme.likers, index);
    // decrement meme's likes
    _meme.likes--;
    // set memory to _meme.unlikers length plus one
    address[] memory _unlikers = new address[](_meme.unlikers.length+1);
    // populate address array with existing _meme.unlikers
    for(uint i = 0; i < _meme.unlikers.length; i++) {
      _unlikers[i] = _meme.unlikers[i];
    }
    // set _unlikers value to msg.sender at last slot of array
    _unlikers[_unlikers.length-1] = account;
    // set unlikers field of _meme.likers to _unlikers
    _meme.unlikers = _unlikers;
    // set meme at memeId to _meme instance
    memes[memeId] = _meme;
  }

  // helper functions
  function _deleteAddress(address[] memory array, uint index) private returns(address[] memory) {
    address[] memory _array = new address[](array.length-1);
    for(uint i = 0; i < index; i++) {
      _array[i] = array[i];
    }
    for(uint i = index; i < _array.length; i++) {
      _array[i] = array[i+1];
    }
    return _array;
  }

  // set interfaceSigner role to User upon deployment
  function passInterfaceSigner(address _userInterface) public returns (bool) {
    require(msg.sender == interfaceSigner, 'Error: only deployer can pass signer role');

    interfaceSigner = _userInterface;
    emit PostCallerChanged(msg.sender, _userInterface);
    return true;
  }
}
