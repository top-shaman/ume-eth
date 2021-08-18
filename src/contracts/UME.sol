// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UME is ERC20 {

  // minter's address
  address public minter;

  event MinterChanged(address accountFrom, address accountTo);

  constructor() public payable ERC20("uMe token", "UME") {
    // assign bank minter role
    minter = msg.sender;
  }

  // change minter role for test
  function passMinterRole(address we) public returns (bool) {
    require(msg.sender == minter, 'Error, only owner can change pass minter role');
    minter = we;

    emit MinterChanged(msg.sender, we);
    return true;
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender==minter, 'Error: msg.sender is not minter');
    _mint(account, amount);
  }
}
