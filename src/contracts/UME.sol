// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "./ME.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {
  // assign ME token contract to private variable
  ME private me;
  // minter's address
  address public minter;

  // minting event
  event MintedUME(address indexed user, uint mintedTime, uint umeAmt);

  struct Engagements {
  // engagements to mint from
    uint amtPosted;
    uint amtLiked;
    uint amtTagged;
    uint amtFollowed;
    uint amtJuried;
  }

  constructor(Me _me) public payable ERC20("uMe token", "UME") {
    // assign ME to private variable
    me = _me;
    // assign minter
    minter = msg.sender;
  }


  function hasUme(Me _me) private returns (bool){
    require(me==_me, 'Error: no ME available');
    //assign ERC1155 token deployed to contract as variable
    engagementsOf[msg.sender] = Engagements(
      me.balanceOf(msg.sender, 1),
      me.balanceOf(msg.sender, 2),
      me.balanceOf(msg.sender, 3),
      me.balanceOf(msg.sender, 4),
      me.balanceOf(msg.sender, 5)
    );
    // add UME
    uint umeTally =
    engagementsOf[msg.sender].amtPosted +
    engagementsOf[msg.sender].amtLiked +
    engagementsOf[msg.sender].amtTagged +
    engagementsOf[msg.sender].amtFollowed +
    engagementsOf[msg.sender].amtJuried;

    if(umeTally > 0) {
      return true;
    } else
      return false;
    }
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender==minter, 'Error: msg.sender is not minter');
    require(hasUme(me), 'Error: user has no ME');
    _mint(account, amount);
    emit MintedUME(account, block.timestamp, amount);
  }
}
