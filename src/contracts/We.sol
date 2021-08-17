// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./ME.sol";
import "./UME.sol";

// smart contract for We (decentralized bank which mints UME)
contract We {
  ME private meToken;
  UME private umeToken;

  uint umeToMint = 0;
  uint256[7] meIds = [0,1,2,3,4,5,6];

  mapping(address => uint) postRedeemed;
  mapping(address => uint) likeRedeemed;
  mapping(address => uint) tagRedeemed;
  mapping(address => uint) followRedeemed;
  mapping(address => uint) respondRedeemed;
  mapping(address => uint) curateRedeemed;
  mapping(address => uint) juryRedeemed;


  mapping(address => uint) postInCache;
  mapping(address => uint) likeInCache;
  mapping(address => uint) tagInCache;
  mapping(address => uint) followInCache;
  mapping(address => uint) respondInCache;
  mapping(address => uint) curateInCache;
  mapping(address => uint) juryInCache;

  mapping(address => uint) redeemStart;
  mapping(address => bool) isCalculated;
  mapping(address => bool) isCached;
  mapping(address => bool) isRedeemed;

  event MintUME(address account, uint mintTime, uint amount);

  constructor(ME _meToken, UME _umeToken) public {
    meToken = _meToken;
    umeToken = _umeToken;
  }
  // cache ME
  function cache() private {
    require(isCached[msg.sender]!=true, 'Error: cache already active');
    require(isCalculated[msg.sender]!=true, 'Error: cache already calculated');
    // reset isRedeemed
    require(isRedeemed[msg.sender]!=true, 'Error: cache has been redeemed');

    uint256[7] memory _meBalances;
    for(uint8 i = 0; i < 7; i++) {
      _meBalances[i] = meToken.balanceOf(msg.sender, i);
    }

    // track token amount in Cache
    postInCache[msg.sender] = _meBalances[0];
    likeInCache[msg.sender] = _meBalances[1];
    tagInCache[msg.sender] = _meBalances[2];
    followInCache[msg.sender] = _meBalances[3];
    respondInCache[msg.sender] = _meBalances[4];
    curateInCache[msg.sender] = _meBalances[5];
    juryInCache[msg.sender] = _meBalances[6];

    // approve transfer of UserData tokens
    meToken.setApprovalForAll(address(msg.sender), true);
    // transfer UserData tokens
    for(uint i = 0; i < 7; i++) {
      meToken.safeTransferFrom(address(msg.sender), address(this), i, _meBalances[i], msg.data);
    }

    isCached[msg.sender] = true;
  }
  // calculate UME to mint
  function calculate() private {
    require(isCached[msg.sender]==true, 'Error: ME hasn\'t cached');
    require(postInCache[msg.sender] > 0 ||
            likeInCache[msg.sender] > 0 ||
            tagInCache[msg.sender] > 0 ||
            followInCache[msg.sender] > 0 ||
            respondInCache[msg.sender] > 0 ||
            curateInCache[msg.sender] > 0 ||
            juryInCache[msg.sender] > 0, 'Error: nothing to calculate');
    require(isCalculated[msg.sender]!=true, 'Error: has been calculated');
    // reset UME to mint
    umeToMint = 0;
    // POST tokens
    umeToMint += postInCache[msg.sender] * 1;
    umeToMint += likeInCache[msg.sender] * 2;
    umeToMint += tagInCache[msg.sender] * 2;
    umeToMint += followInCache[msg.sender] * 2;
    umeToMint += respondInCache[msg.sender] * 2;
    umeToMint += curateInCache[msg.sender] * 3;
    umeToMint += juryInCache[msg.sender] * 5;
    // set isCalculated to true so it can't double calculate
    isCalculated[msg.sender] = true;
  }

  function clear() private {
    require(isRedeemed[msg.sender]==true, 'Error: cache hasn\'t yet been redeemed');
    postInCache[msg.sender] = 0;
    likeInCache[msg.sender] = 0;
    tagInCache[msg.sender] = 0;
    followInCache[msg.sender] = 0;
    respondInCache[msg.sender] = 0;
    curateInCache[msg.sender] = 0;
    juryInCache[msg.sender] = 0;
    // reset state
    isCalculated[msg.sender] = false;
    isCached[msg.sender] = false;
    isRedeemed[msg.sender] = false;
  }

  function redeem() payable public {
    // cache to get values
    cache();
    calculate();

    umeToken.mint(msg.sender, umeToMint);
    isRedeemed[msg.sender] = true;
    clear();
  }

}
