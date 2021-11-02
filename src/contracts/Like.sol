// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";
import "./Boost.sol";
import "./MemeStorage.sol";

contract Like {

  UME private umeToken;
  MemeStorage private memeStorage;
  Boost private boost;

  address public interfaceSigner;

  event InterfaceSignerChanged(
        address indexed from,
        address indexed to);
  event Liked(address indexed liker,
             bytes32 indexed memeId);

  constructor(UME _umeToken,
              MemeStorage _memeStorage,
              Boost _boost)
              public {
    umeToken = _umeToken;
    memeStorage = _memeStorage;
    boost = _boost;
    interfaceSigner = msg.sender;
  }
  // like functions
  function likeMeme(
            address _account,
            bytes32 _memeId)
            public {
    require(
      msg.sender==interfaceSigner,
      'Error: liker must be operating account');
    address[] memory _likers = memeStorage.getLikers(_memeId);
    uint _likeCount = _likers.length;
    bool _unliked = false;
    bool _alreadyLiked = memeStorage.getHasLiked(_memeId, _account);
    //bool _alreadyLiked = false;
    // remove like if already liked
    for(uint i = 0; i < _likeCount; i++) {
      if(_account==_likers[i]) {
    //    _alreadyLiked = true;
        _unLike(_account, _memeId, _likers, i);
        _unliked = true;
        break;
      }
    } // check for double like minting
    address[] memory _unlikers = memeStorage.getUnlikers(_memeId);
    uint _unlikeCount = _unlikers.length;
    for(uint i = 0; i < _unlikeCount; i++) {
      if(_account==_unlikers[i] && _unliked==false) {
    //    _alreadyLiked = true;
        _addLike(_account, _memeId, _likers, _unlikers, i, _alreadyLiked);
        break;
      }
    }
    if(_alreadyLiked==false && _unliked==false) {
      _addLike(_account, _memeId, _likers, _unlikers, 0, _alreadyLiked);
      // mint like token
      if(_account!=memeStorage.getAuthor(_memeId)) {
        umeToken.mintLike(_account, memeStorage.getAuthor(_memeId));
        boost.likeBoost(_memeId);
      }
      emit Liked(_account, _memeId);
    }
  }
  // setter functions for Meme
  function _addLike(
            address _account,
            bytes32 _memeId,
            address[] memory _oldLikers,
            address[] memory _unlikers,
            uint _index,
            bool _alreadyLiked)
            private {
    if(_alreadyLiked==true) {
      memeStorage.setUnlikers(_memeId, _deleteAddress(_unlikers, _index));
    } else {
      memeStorage.setHasLiked(_memeId, _account);
    }
    uint _oldLikeCount = _oldLikers.length;
    // set memory to _meme.likers length plus one
    address[] memory _newLikers = new address[](_oldLikeCount+1);

    // populate address array with existing _meme.likers
    for(uint i = 0; i < _oldLikeCount; i++) {
      //require(account!=_meme.likers[i], 'Error: liker has already liked account');
      _newLikers[i] = _oldLikers[i];
    }
    // set _likers value to msg.sender at last slot of array
    _newLikers[_oldLikeCount] = _account;
    // set likers field of _meme.likers to _likers
    memeStorage.setLikers(_memeId, _newLikers);
  }
  function _unLike(
            address _account,
            bytes32 _memeId,
            address[] memory _oldLikers,
            uint _index)
            private {
    require(
      memeStorage.getLikeCount(_memeId)>0,
      'Error: no likers in meme');
    bool _alreadyUnliked = memeStorage.getHasUnliked(_memeId, _account);
    if(_alreadyUnliked==false) {
      require(
        umeToken.balanceOf(_account)>=umeToken.likeFromValue(),
        'Error: not enough UME to unlike');
      umeToken.burn(_account, umeToken.likeFromValue());
      memeStorage.setHasUnliked(_memeId, _account);
    }
    address[] memory _oldUnlikers = memeStorage.getUnlikers(_memeId);
    // delete liked index, moving all successive elements
    memeStorage.setLikers(_memeId, _deleteAddress(_oldLikers, _index));
    uint _oldUnlikeCount = _oldUnlikers.length;
    // set memory to _meme.unlikers length plus one
    address[] memory _newUnlikers = new address[](_oldUnlikeCount+1);

    // populate address array with existing _meme.unlikers
    for(uint i = 0; i < _oldUnlikeCount; i++) {
      _newUnlikers[i] = _oldUnlikers[i];
    }
    // set _unlikers value to msg.sender at last slot of array
    _newUnlikers[_oldUnlikeCount] = _account;
    // set unlikers field of _meme.likers to _unlikers
    memeStorage.setUnlikers(_memeId, _newUnlikers);
  }

  // helper functions
  function _deleteAddress(
            address[] memory array,
            uint index)
            private pure returns(address[] memory) {
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
  function passInterfaceSigner(address _userInterface)
            public returns (bool) {
    require(
      msg.sender == interfaceSigner,
      'Error: only deployer can pass signer role');
    interfaceSigner = _userInterface;
    emit InterfaceSignerChanged(msg.sender, _userInterface);
    return true;
  }
}
