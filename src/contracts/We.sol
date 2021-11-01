// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract We {
  mapping(address => uint) balance;

  function receiveEth()
            public payable {
    assert(balance[msg.sender] + msg.value >= balance[msg.sender]);
    balance[msg.sender] += msg.value;
  }
  function withdrawEth(
            address payable _to,
            uint _amount)
            public {
    require(_amount <= balance[msg.sender], 'not enough funds');
    assert(balance[msg.sender] >= balance[msg.sender] - _amount);
    balance[msg.sender] -= _amount;
    _to.transfer(_amount);
  }

  receive() external payable {
    receiveEth();
  }
}
