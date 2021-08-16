// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "./ME.sol";
import "./UME.sol";

contract User {
  // assign ME & UME token contracts to variable
  Ume private ume;
  Me private me;
  // minter's address
  address public minter;

  // mapping of ERC1155 (ME)'s values
  mapping(address => uint) umeBalanceOf;
  mapping(address => Engagements) engagementsOf;
  mapping(address => uint) redeemStart;
  mapping(address => bool) isTallied;
  event RedeemMe(address indexed user, uint redeemTime, uint umeAmt);

  struct Engagements {
  // engagements to mint from
    uint amtPosted;
    uint amtLiked;
    uint amtTagged;
    uint amtFollowed;
    uint amtJuried;
  }

  function redeemMe(Me _me) public {
    require(isTallied[msg.sender]==false, 'Error: ME has already been redeemed');
    //assign ERC1155 token deployed to contract as variable
    me = _me;
    //extract values of each value in ERC1155 token
    engagementsOf[msg.sender] = Engagements(
      me.balanceOf(msg.sender, 1),
      me.balanceOf(msg.sender, 2),
      me.balanceOf(msg.sender, 3),
      me.balanceOf(msg.sender, 4),
      me.balanceOf(msg.sender, 5)
    );
    //me.balanceOf(msg.sender,
    // updates redeem time to msg.sender
    redeemStart[msg.sender] += block.timestamp;
    // set Redeemed to true
    isTallied[msg.sender] = true;

    // mint UME
    emit RedeemMe(msg.sender, block.timestamp, umeAmt);
  }
/*
  function mint(address account, uint256 amount) public {
    require(msg.sender==minter, 'Error: msg.sender is not minter');
    require(isTallied==true, 'Error: hasn\'t redeemed');
    _mint(account, amount);
  }
  */
}
