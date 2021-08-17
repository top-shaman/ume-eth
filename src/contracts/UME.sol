// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {

  // minter's address
  address public minter;
  constructor() public payable ERC20("uMe token", "UME") {
    // assign bank minter role
    minter = msg.sender;
  }
/*
  // check to see if UME exists, set engageMentsOf mapping
  function hasUme(Me _me) private returns (bool){
    require(me==_me, 'Error: no ME available');
    //assign ERC1155 token deployed to contract as variable
    engagementsOf[msg.sender] = Engagements(
      me.balanceOf(msg.sender, 1),
      me.balanceOf(msg.sender, 2),
      me.balanceOf(msg.sender, 3),
      me.balanceOf(msg.sender, 4),
      me.balanceOf(msg.sender, 5),
      me.balanceOf(msg.sender, 6),
      me.balanceOf(msg.sender, 7)
    );
    // add UME
    uint umeTally =
    engagementsOf[msg.sender].amtPosted +
    engagementsOf[msg.sender].amtLiked +
    engagementsOf[msg.sender].amtTagged +
    engagementsOf[msg.sender].amtFollowed +
    engagementsOf[msg.sender].amtResponded +
    engagementsOf[msg.sender].amtCurated +
    engagementsOf[msg.sender].amtJuried;

    if(umeTally > 0) {
      return true;
    } else
      return false;
    }
  }
*/
  function mint(address account, uint256 amount) public {
    require(msg.sender==minter, 'Error: msg.sender is not minter');
    _mint(account, amount);
  }
}
