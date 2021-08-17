// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./ME.sol";
import "./UME.sol";

contract Timeline {
  // public variables
  ME private meToken;
  string public name = "uMe";
  uint public memeCount = 0;

  struct Meme {
    uint memeId; // number in all of timeline
    uint memeTime; // time of post
    string memeHash; // hash of Meme
    string memeText; // test of Meme
    //bool hasLink // if Meme has link
    //bool hasMedia; // if Meme has media
    //string mediaHash; // address of media
    uint likeCount; // number of likes on Meme
    //address[] likers; // list of addresses of likers
    //address[] tags; // list of addresses of tagged
    //bool isChild; // if meme is child of a previous meme
    //string parentHash; // hash of direct parent in thread
    //string originHash; // hash of originator of thread
    address author; // address of author
  }

  event MemeCreated(
    uint memeId,
    uint memeTime,
    string memeHash,
    string memeText,
    address author
  );
  event MemeLiked(
    uint memeId,
    uint memeTime,
    string memeHash,
    string memeText,
    address author
  );

  // mapping of ERC1155 (ME)'s values
  mapping(uint => Meme) public memes;
/*
  struct Engagements {
  // engagements to mint from
    uint amtPosted;
    uint amtLiked;
    uint amtTagged;
    uint amtFollowed;
    uint amtResponded;
    uint amtCurated;
    uint amtJuried;
  }
*/
  constructor(ME _meToken) public {
    meToken = _meToken;
  }

  function newMeme(string memory _memeHash, string memory _memeText) public {
    require(bytes(_memeHash).length > 0, 'Error: meme hash doesn\'t exist');
    require(bytes(_memeText).length > 0, 'Error: meme text doesn\'t exist');
    require(msg.sender != address(0x0), 'Error: author address doesn\'t exist');

    // increment meme id
    memeCount++;
    memes[memeCount] = Meme(memeCount, block.timestamp, _memeHash, _memeText, 0, msg.sender);

    // mint post token
    meToken.mintPost(msg.sender, _memeHash, _memeText);

    // create token event
    emit MemeCreated(memeCount, block.timestamp, _memeHash, _memeText, msg.sender);
  }


/*
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
      me.balanceOf(msg.sender, 5),
      me.balanceOf(msg.sender, 6),
      me.balanceOf(msg.sender, 7)
    );
    //me.balanceOf(msg.sender,
    // updates redeem time to msg.sender
    redeemStart[msg.sender] += block.timestamp;
    // set Redeemed to true
    isTallied[msg.sender] = true;
    safe
    // mint UME
    emit RedeemMe(msg.sender, block.timestamp, umeAmt);
  }
*/
/*
  function mint(address account, uint256 amount) public {
    require(msg.sender==minter, 'Error: msg.sender is not minter');
    require(isTallied==true, 'Error: hasn\'t redeemed');
    _mint(account, amount);
  }
  */
}
