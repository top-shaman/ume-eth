const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const EVM_SENDER = 'Returned error: sender account not recognized'

const ether = n => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

// Same as ether
const tokens = n => ether(n)

const wait = s => {
  const milliseconds = s * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

var Post = artifacts.require("./Post.sol");
var UME = artifacts.require("./UME.sol");
var User = artifacts.require("./User.sol");
var We = artifacts.require("./We.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Post', ([deployer, user1, user2, user3, user4]) => {
  let we, umeToken, post, user

  beforeEach(async () => {
    umeToken = await UME.new()
    we = await We.new(umeToken.address)
    post = await Post.new(umeToken.address)
    user = await User.new(umeToken.address, post.address)
    await umeToken.passMinterRole(we.address, {from: deployer})
    await post.passPostRole(user.address, {from: deployer})



  })
//  describe ('testing basic UME minting functionality', () => {
//    beforeEach(async () => {
//      await umeToken.passPostCallerRole(user1, {from: deployer}) // for the sake of testing basic functionality, assign caller to user1
//      await umeToken.passUserCallerRole(user1, {from: deployer}) // for the sake of testing basic functionality, assign caller to user1
//      await user.newAccount(user1, 'user_1', '@user_1', {from: user1})
//      await user.newAccount(user2, 'user_2', '@user_2', {from: user2})
//    })
//    describe('success', () => {
//      it('checking UME token name', async () => {
//        expect(await umeToken.name()).to.be.eq('uMe token')
//      })
//      it('checking UME token symbol', async () => {
//        expect(await umeToken.symbol()).to.be.eq('UME')
//      })
//      it('checking initial token supply for UME token', async () => {
//        expect(await umeToken.totalSupply().then(supply => supply.toString())).to.be.eq('0')
//      })
//      it('checking if Post mints', async () => {
//        await umeToken.mintPost(user1 /* , '0x012345' */, 'hello world!', {from: user1}) // sample Post
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//      })
//      it('checking if Like mints', async () => {
//        await umeToken.mintLike(user1, user2 /* , '0x012345' */, {from: user1}) // sample Like
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('5')
//      })
//      it('checking if Tag mints', async () => {
//        await umeToken.mintTag(user1, user2 /* , '0x012345' */, {from: user1}) // sample Tag
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('3')
//      })
//      it('checking if Follow mints', async () => {
//        await umeToken.mintFollow(user1, user2, {from: user1}) // sample Follow
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
//      })
//      it('checking if Respond mints', async () => {
//        await umeToken.mintRespond(user1, user2 /* , '0x12345' */, {from: user1}) // sample Respond
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
//      })
//      it('checking if Curate mints', async () => {
//        await umeToken.mintCurate(user1, user2 /* , '0x12345' */, {from: user1}) // sample Curate
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
//      })
//      it('checking if Jury mints', async () => {
//        await umeToken.mintJury(user1 /* , '0x012345' */, true, {from: user1}) // sample Jury consensus
//
//        await umeToken.passPostCallerRole(user2, {from: user1})
//        await umeToken.passUserCallerRole(user2, {from: user1})
//        await umeToken.mintJury(user2 /* , '0x012345' */, false, {from: user2}) // sample Jury no consensus
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
//      })
//      it('checking group functionality', async () => {
//        await umeToken.mintPost(user1 /* , '0x012345' */, 'hello world!', {from: user1}) // sample Post
//        await umeToken.mintLike(user1, user2 /* , '0x012345' */, {from: user1}) // sample Like
//        await umeToken.mintTag(user1, user2 /* , '0x012345' */, {from: user1}) // sample Tag
//        await umeToken.mintFollow(user1, user2, {from: user1}) // sample Follow
//        await umeToken.mintRespond(user1, user2 /* , '0x12345' */, {from: user1}) // sample Respond
//        await umeToken.mintCurate(user1, user2 /* , '0x12345' */, {from: user1}) // sample Curate
//        await umeToken.mintJury(user1 /* , '0x012345' */, true, {from: user1}) // sample Jury consensus
//
//        await umeToken.passPostCallerRole(user2, {from: user1})
//        await umeToken.passUserCallerRole(user2, {from: user1})
//        await umeToken.mintJury(user2 /* , '0x012345' */, false, {from: user2}) // sample Jury no consensus
//
//        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('40')
//        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('26')
//      })
//      it('We should have the UME token minter role', async () => {
//        expect(await umeToken.minter()).to.be.eq(we.address)
//      })
//      it('For the sake of these tests, user1 should have caller role', async () => {
//        expect(await umeToken.postCaller()).to.be.eq(user1)
//        expect(await umeToken.userCaller()).to.be.eq(user1)
//      })
//      it('Deployer, user1, user2 shouldn\'t have token minter role', async () => {
//        expect(await umeToken.minter()).to.not.eq(deployer)
//        expect(await umeToken.minter()).to.not.eq(user1)
//        expect(await umeToken.minter()).to.not.eq(user2)
//      })
//      it('Once transfered, deployer, user1, user2 shouldn\'t have caller role', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//
//        expect(await umeToken.postCaller()).to.not.eq(deployer)
//        expect(await umeToken.postCaller()).to.not.eq(user1)
//        expect(await umeToken.postCaller()).to.not.eq(user2)
//      })
//    })
//    describe('failures', () => {
//      it('checking for false minting, group', async () => {
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
//      })
//      it('We shouldn\'t be able to post and therefore cannot mint UME', async () => {
//        await umeToken.passPostCallerRole(we.address, {from: user1})
//        await umeToken.mintPost(we.address /* , '0x012345' */, 'hello world!', {from: we.address}).should.be.rejectedWith(EVM_SENDER)
//      })
//      it('Incorrect addresses shouldn\'t be able to mint POST UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintPost(user1 /* , '0x012345' */, 'hello world!', {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample Post
//        await umeToken.mintPost(user1 /* , '0x012345' */, 'hello world!', {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Post
//      })
//      it('Incorrect addresses shouldn\'t be able to mint LIKE UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintLike(user1, user2 /* , '0x012345' */, {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample
//        await umeToken.mintLike(user1, user2 /* , '0x012345' */, {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Like
//      })
//      it('Incorrect addresses shouldn\'t be able to mint TAG UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintTag(user1, user2 /* , '0x012345' */, {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample Tag
//        await umeToken.mintTag(user1, user2 /* , '0x012345' */, {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Tag
//      })
//      it('Incorrect addresses shouldn\'t be able to mint FOLLOW UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintFollow(user1, user2, {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample Follow
//        await umeToken.mintFollow(user1, user2, {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Follow
//      })
//      it('Incorrect addresses shouldn\'t be able to mint RESPOND UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintRespond(user1, user2 /* , '0x12345' */, {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample Respond
//        await umeToken.mintRespond(user1, user2 /* , '0x12345' */, {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Respond
//      })
//      it('Incorrect addresses shouldn\'t be able to mint CURATE UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintCurate(user1, user2 /* , '0x12345' */, {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample Curate
//        await umeToken.mintCurate(user1, user2 /* , '0x12345' */, {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Curate
//      })
//      it('Incorrect addresses shouldn\'t be able to mint JURY UME if they are not caller', async () => {
//        await umeToken.passPostCallerRole(post.address, {from: user1})
//        await umeToken.passUserCallerRole(user.address, {from: user1})
//
//        await umeToken.mintJury(user1 /* , '0x012345' */, true, {from: user2})
//          .should.be.rejectedWith(EVM_REVERT) // sample Jury consensus
//        await umeToken.mintJury(user1 /* , '0x012345' */, true, {from: deployer})
//          .should.be.rejectedWith(EVM_REVERT) // sample Jury consensus
//      })
//      it('passing minter role should be rejected', async () => {
//        await umeToken.passMinterRole(user1, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        await umeToken.passPostCallerRole(user.address, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        await umeToken.passUserCallerRole(user.address, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//      })
//      it('minting role should not be able to be passed between users who don\'t have it', async () => {
//        await umeToken.passMinterRole(user1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//      })
//      it('passing caller role should be rejected', async () => {
//        await umeToken.passPostCallerRole(user2, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//      })
//      it('caller role should not be able to be passed between users who don\'t have it', async () => {
//        await umeToken.passPostCallerRole(deployer, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//      })
//    })
//  })
  describe('testing Post functionality', () => {
    beforeEach(async () => {
      await umeToken.passPostCallerRole(post.address, {from: deployer})
      await umeToken.passUserCallerRole(user.address, {from: deployer})
      await user.newAccount(user1, 'user_1', '@user_1', {from: user1})
      await user.newAccount(user2, 'user_2', '@user_2', {from: user2})
      await user.newAccount(deployer, 'deployer', '@deployer', {from: deployer})
    })
//    describe('Posting meme', () => {
//      describe('success', () => {
//        it('post meme', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//          expect(await post.memeCount().then(bal => bal.toString())).to.be.eq('1')
//          expect(await user.usersByMeme(1)).to.be.eq(user1)
//        })
//        it('post meme with tags', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [user2, deployer], 0, 0, {from: user1})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('10')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('3')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('3')
//        })
//        it('no excess UME minted upon "dry" post', async () => { // with empty tag list & 0 for parentId and originId, no excess
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('0')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('0')
//        })
//        it('no UME minted from tagging self', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [user1], 0, 0, {from: user1})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//        })
//        it('respond works when parentId & originId are the same', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1})
//          await user.newMeme(user2 /* , '0x67891011' */, 'what\'s up?', [], 1, 1, {from: user2})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('12')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('10')
//        })
//        it('respond & curate work when parentId & originId are different', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1}) // user1 post
//          await user.newMeme(user2 /* , '0x67891011' */, 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
//          await user.newMeme(deployer /* , '0x67891011' */, 'what?', [], 2, 1, {from: deployer}) // deployer responds to user2
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('16')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('14')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('12')
//        })
//        it('user post count works', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1}) // user1 post
//          await user.newMeme(user2 /* , '0x67891011' */, 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
//          await user.newMeme(deployer /* , '0x5363635735'*/, 'what?', [], 2, 1, {from: deployer}) // deployer responds to user2
//          await user.newMeme(user1/*, '0x064536476'*/, 'you heard me!', [], 3, 1, {from: user1}) // user1 post
//
//          expect(await user.getPosts(user1).then(elem => elem.map(e => e.toString()))).to.deep.eq(['1','4'])
//          expect(await user.getPosts(user2).then(elem => elem.map(e => e.toString()))).to.deep.eq(['2'])
//          expect(await user.getPosts(deployer).then(elem => elem.map(e => e.toString()))).to.deep.eq(['3'])
//        })
//        it('delete meme works', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1}) // user1 post
//          await user.deleteMeme(user1, 1, {from: user1})
//
//          const meme1 = await post.memes(1);
//
//          expect(await meme1.id.toNumber()).to.be.eq(1)
//          expect(await meme1.time.toNumber()).to.be.eq(0)
//          expect(await meme1.text).to.be.eq('')
//          expect(await meme1.likes.toNumber()).to.be.eq(0)
//          expect(await meme1.parentId.toNumber()).to.be.eq(0)
//          expect(await meme1.originId.toNumber()).to.be.eq(0)
//          expect(await meme1.author).to.be.eq(ETHER_ADDRESS)
//          expect(await meme1.isVisible).to.be.eq(false)
//
//          expect(await post.getLikers(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getUnlikers(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getTags(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getResponses(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//
//        })
//        it('post meme tallies responses', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1}) // user1 post
//          await user.newMeme(user2 /* , '0x67891011' */, 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
//          await user.newMeme(deployer /* , '0x5363635735'*/, 'what?', [], 2, 1, {from: deployer}) // deployer responds to user2
//          await user.newMeme(user1/*, '0x064536476'*/, 'you heard me!', [], 3, 1, {from: user1}) // user1 post
//          await user.newMeme(deployer /* , '0x5363635735'*/, 'wait what?', [], 1, 1, {from: deployer}) // deployer responds to user2
//
//          expect(await post.getResponses(1).then(elem => elem.map(e => e.toString()))).to.deep.eq(['2','5'])
//          expect(await post.getResponses(2).then(elem => elem.map(e => e.toString()))).to.deep.eq(['3'])
//          expect(await post.getResponses(3).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getResponses(4).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//        })
//        it('delete meme deletes response in parent', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1}) // user1 post
//          await user.newMeme(user2 /* , '0x67891011' */, 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
//          await user.newMeme(deployer /* , '0x5363635735'*/, 'what?', [], 2, 1, {from: deployer}) // deployer responds to user2
//          await user.newMeme(user1/*, '0x064536476'*/, 'you heard me!', [], 3, 1, {from: user1}) // user1 post
//          await user.newMeme(deployer /* , '0x5363635735'*/, 'wait what?', [], 1, 1, {from: deployer}) // deployer responds to user2
//          await user.deleteMeme(user2, 2, {from: user2})
//          await user.deleteMeme(deployer, 3, {from: deployer})
//          await user.deleteMeme(deployer, 5, {from: deployer})
//
//          expect(await post.getResponses(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getResponses(2).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getResponses(3).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await post.getResponses(4).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//        })
//      })
//      describe('failure', () => {
//        it('doesn\'t post meme with wrong users', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t bypass to mint (ume)', async () => {
//          await umeToken.mintPost(user1, 'hello world!', {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await umeToken.mintPost(user2, 'hello world!', {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t bypass to mint (post)', async () => {
//          await post.newMeme(user1, 'hello world!', [], 0, 0, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await post.newMeme(user2, 'hello world!', [], 0, 0, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('doesn\'t post meme with empty message', async () => {
//          await post.newMeme(user1 /* , '0x012345' */, '', [], 0, 0, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('other user can\'t delete user\'s meme', async () => {
//          await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1})
//          await user.deleteMeme(user1, 1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t create meme with parentId greater than memeCount', async () => {
//          await user.newMeme(user1, 'hello world!', [], 3, 0, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//          await user.newMeme(user1, 'hello world!', [], 0, 3, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//      })
//    })
//    describe('Liking meme', () => {
//      beforeEach(async () => {
//        /*await user.newAccount(user1, 'user_1', '@user_1', {from: user1})
//        await user.newAccount(user2, 'user_2', '@user_2', {from: user2})
//        await user.newAccount(deployer, 'deployer', '@deployer', {from: deployer})
//        */
//        await user.newMeme(user1 /* , '0x012345' */, 'hello world!', [], 0, 0, {from: user1}) // user1 post
//        await user.newMeme(user2 /* , '0x67891011' */, 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
//        await user.newMeme(deployer /* , '0x67891011' */, 'what?', [user1, user2], 2, 1, {from: deployer}) // deployer responds to user2, tags user1 & user2
//        await user.likeMeme(user2, 1, {from: user2}) //user2 likes meme id1
//      })
//      describe('success', () => {
//        it('like functionality', async () => {
//          let meme1 = await post.memes(1)
//          let meme2 = await post.memes(2)
//          let meme3 = await post.memes(3)
//          // checks resulting struct data
//          // checks likers
//          expect(await post.getLikers(1).then(elem => elem)).to.deep.eq([user2])
//          // checks taggs of third post
//          expect(await post.getTags(3).then(elem => elem)).to.deep.eq([user1, user2])
//          // checks number of likes in first & 2nd post
//          expect(await meme1.likes.toNumber()).to.be.eq(1)
//          expect(await meme2.likes.toNumber()).to.be.eq(0)
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('14')
//        })
//        it('unlike functionality', async () => {
//          await user.likeMeme(user2, 1, {from: user2}) //user2 should unlike meme id1
//
//          let meme1 = await post.memes(1)
//          // likers list should have a deleted element
//          expect(await post.getLikers(1).then(elem => elem)).to.deep.eq([])
//          // unlikers list should have increased
//          expect(await post.getUnlikers(1).then(elem => elem)).to.deep.eq([user2])
//          // likes should decrement
//          expect(await meme1.likes.toNumber()).to.be.eq(0)
//          // balance should remain unchanged
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
//        })
//        it('like, unlike, like functionality', async () => {
//          await user.likeMeme(user2, 1, {from: user2}) //user2 should unlike meme id1
//          await user.likeMeme(user2, 1, {from: user2}) //user2 should unlike meme id1
//
//          let meme1 = await post.memes(1)
//
//          expect(await post.getLikers(1).then(elem => elem)).to.deep.eq([user2])
//          expect(await post.getUnlikers(1).then(elem => elem)).to.deep.eq([])
//          // checks taggs of third post
//          expect(await post.getTags(3).then(elem => elem)).to.deep.eq([user1, user2])
//          // checks number of likes in first & 2nd post
//          expect(await meme1.likes.toNumber()).to.be.eq(1)
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
//        })
//      })
//      describe('failure', () => {
//        it('wrong account shouldn\'t be able to like', async () => {
//           await user.likeMeme(user1, 1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//           await user.likeMeme(deployer, 1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('user shouldn\'t be able to call post.likeMeme', async () => {
//          await post.likeMeme(user1, 1, {from: user1}).should.be.rejected
//        })
//        it('post shouldn\'t be able to call post.likeMeme', async () => {
//          await post.likeMeme(user1, 1, {from: post.address}).should.be.rejected
//        })
//        it('user shouldn\'t be able to like memes that don\'t exist', async () => {
//          await user.likeMeme(user1, 4, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//      })
//    })
//    describe('User functionality', () => {
//      describe('success', () => {
//        it('3 accounts created from before statement', async () => {
//          expect(await user.userCount().then(elem => elem.toString())).to.be.eq('3')
//        })
//        it('account #1 has id #1 and account #2 has name #2', async () => {
//          const account1 = await user.users(user1)
//          const account2 = await user.users(user2)
//          assert.equal(await account1.id.toNumber(), 1, 'id is correct')
//          assert.equal(await account2.id.toNumber(), 2, 'id is correct')
//        })
//        it('follow functionality', async () => {
//          await user.follow(user1, user2, {from: user1})
//
//          const account1 = await user.users(user1)
//          const account2 = await user.users(user2)
//
//          //check follower/following counts
//          assert.equal(await account1.followerCount.toNumber(), 0, 'acct1 followerCount is correct')
//          assert.equal(await account1.followingCount.toNumber(), 1, 'acct1 followingCount is correct')
//          assert.equal(await account2.followerCount.toNumber(), 1, 'acct2 followerCount is correct')
//          assert.equal(await account2.followingCount.toNumber(), 0, 'acct2 followingCount is correct')
//          // check follower/following list
//
//          expect(await user.getFollowers(user1).then(e => e)).to.deep.eq([])
//          expect(await user.getFollowing(user1).then(e => e)).to.deep.eq([user2])
//          expect(await user.getFollowers(user2).then(e => e)).to.deep.eq([user1])
//          expect(await user.getFollowing(user2).then(e => e)).to.deep.eq([])
//
//          // check minting
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
//        })
//      })
//      describe('failure', () => {
//        it('can\'t double follow', async () => {
//          await user.follow(user1, user2, {from: user1})
//          await user.follow(user1, user2, {from: user1}).should.be.rejected
//        })
//        // creation
//        it('can\'t create double account', async () => {
//          await user.newAccount(user1, 'user_3', '@user_3', {from: user1}).should.be.rejected
//        })
//        it('can\'t create redundant user address', async () => {
//          await user.newAccount(user3, 'user_3', '@user_1', {from: user3}).should.be.rejected
//        })
//        it('can\'t create account for other address', async () => {
//          await user.newAccount(user3, 'user_3', '@user_3', {from: user2}).should.be.rejected
//        })
//        it('can\'t create user address without @', async () => {
//          await user.newAccount(user3, 'user_3', 'user_3', {from: user3}).should.be.rejected
//        })
//        // userAddress/userName change
//        it('can\'t change user address for other address', async () => {
//          await user.changeUserAddress(user3, '@user_3', {from: user2}).should.be.rejected
//        })
//        it('can\'t change user address to same user address', async () => {
//          await user.changeUserAddress(user2, '@user_2', {from: user2}).should.be.rejected
//        })
//        it('can\'t change username to same username', async () => {
//          await user.changeUserName(user2, 'user_2', {from: user2}).should.be.rejected
//        })
//        it('can\'t change username to same username', async () => {
//          await user.changeUserName(user2, 'user_2', {from: user2}).should.be.rejected
//        })
//        it('can\'t change user address without account', async () => {
//          await user.changeUserAddress(user3, '@user_2', {from: user3}).should.be.rejected
//        })
//        it('can\'t change username without account', async () => {
//          await user.changeUserName(user3, 'user_2', {from: user3}).should.be.rejected
//        })
//        it('can\'t change user address without @ at beginning', async () => {
//          await user.changeUserName(user3, 'user_3', {from: user3}).should.be.rejected
//        })
//      })
 //   })
  })
})
