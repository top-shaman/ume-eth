// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./UME.sol";

// smart contract for We (decentralized bank which mints UME)
contract We {
  UME private umeToken;

  constructor(UME _umeToken) public {
    umeToken = _umeToken;
  }
}
