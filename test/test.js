const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'
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
var Like = artifacts.require("./Like.sol");
var Follow = artifacts.require("./Follow.sol");
var Boost = artifacts.require("./Boost.sol");

var MemeFactory = artifacts.require("./MemeFactory.sol");
var MemeStorage = artifacts.require("./MemeStorage.sol");

var UserInterface = artifacts.require("./UserInterface.sol");
var UserFactory = artifacts.require("./UserFactory.sol");
var UserStorage = artifacts.require("./UserStorage.sol");

var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()
var Web3 = require('web3')
var Web3 = new Web3(Web3.givenProvider)

const toBytes = async s => await web3.utils.fromAscii(s)
const fromBytes = async b => await web3.utils.toAscii(b)

contract('UME', ([deployer, user1, user2, user3, user4]) => {
  let post, like, follow, memeFactory, memeStorage, interface, userFactory, userStorage, we, umeToken

  beforeEach(async () => {
    umeToken = await UME.new()
    we = await We.new(umeToken.address)

    memeStorage = await MemeStorage.new()
    userStorage = await UserStorage.new()
    memeFactory = await MemeFactory.new(umeToken.address, memeStorage.address, userStorage.address)
    userFactory = await UserFactory.new(userStorage.address)

    post = await Post.new(umeToken.address, memeFactory.address, memeStorage.address)
    like = await Like.new(umeToken.address, memeStorage.address)
    follow = await Follow.new(umeToken.address, userStorage.address)
    boost = await Boost.new(umeToken.address, memeStorage.address) // to add more

    interface = await UserInterface.new(umeToken.address, memeStorage.address, userStorage.address, userFactory.address, post.address, like.address, follow.address, boost.address)

    await umeToken.passMinterRole(we.address, {from: deployer})
    await umeToken.passPostSignerRole(post.address, {from: deployer})
    await umeToken.passMemeFactorySignerRole(memeFactory.address, {from: deployer})
    await umeToken.passLikeSignerRole(like.address, {from: deployer})
    await umeToken.passFollowSignerRole(follow.address, {from: deployer})
    await umeToken.passBoostSignerRole(boost.address, {from: deployer})

    await memeStorage.passFactorySigner(memeFactory.address, {from: deployer})
    await userStorage.passMemeFactorySigner(memeFactory.address, {from: deployer})
    await userStorage.passFactorySigner(userFactory.address, {from: deployer})

    await memeStorage.passPostSigner(post.address)
    await memeStorage.passLikeSigner(like.address)
    await memeStorage.passBoostSigner(boost.address)

    await userStorage.passLikeSigner(like.address)
    await userStorage.passFollowSigner(follow.address)

    await memeStorage.passInterfaceSigner(interface.address)
    await userStorage.passInterfaceSigner(interface.address)

    await memeFactory.passPostSigner(post.address)

    await userFactory.passInterfaceSigner(interface.address)

    await post.passInterfaceSigner(interface.address)
    await like.passInterfaceSigner(interface.address)
    await follow.passInterfaceSigner(interface.address)
    await boost.passInterfaceSigner(interface.address)

  })
//  describe ('testing basic UME minting functionality', () => { // made with previous build
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
  describe('testing new structure functionality', () => {
    beforeEach(async () => {
      let un1 = web3.utils.fromAscii('user_1')
      let un2 = web3.utils.fromAscii('user_2')
      let dn = web3.utils.fromAscii('deployer')
      let ua1 = web3.utils.fromAscii('@user_1')
      let ua2 = web3.utils.fromAscii('@user_2')
      let da = web3.utils.fromAscii('@deployer')

      await interface.newUser(user1, un1, ua1, {from: user1})
      await interface.newUser(user2, un2, ua2, {from: user2})
      await interface.newUser(deployer, dn, da, {from: deployer})

      let account1 = await userStorage.getUser(user1)
      let account2 = await userStorage.getUser(user2)
    })
//    describe('User functionality', () => {
//      describe('success', () => {
//        it('3 accounts created from before statement', async () => {
//          expect(await userStorage.userCount().then(elem => elem.toString())).to.be.eq('3')
//        })
//        it('account #1 and account #2 have different names', async () => {
//          account1 = await userStorage.getUser(user1)
//          account2 = await userStorage.getUser(user2)
//
//          const id1 = account1.id;
//          const id2 = account2.id;
//          assert.equal(await account1.id, id1, 'id is correct')
//          assert.equal(await account2.id, id2, 'id is correct')
//          await account1.id.should.not.eq(id2)
//          await account2.id.should.not.eq(id1)
//        })
//        it('follow functionality', async () => {
//          await interface.followUser(user1, user2, {from: user1})
//
//          account1 = await userStorage.users(user1)
//          account2 = await userStorage.users(user2)
//
//          // check follower/following list
//          expect(await userStorage.getFollowers(user1).then(e => e)).to.deep.eq([])
//          expect(await userStorage.getFollowing(user1).then(e => e)).to.deep.eq([user2])
//          expect(await userStorage.getFollowers(user2).then(e => e)).to.deep.eq([user1])
//          expect(await userStorage.getFollowing(user2).then(e => e)).to.deep.eq([])
//
//          // check minting
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
//        })
//        it('unfollow functionality', async () => {
//          await interface.followUser(user1, user2, {from: user1})
//          await interface.followUser(user1, user2, {from: user1})
//
//          // check follower/following list
//          expect(await userStorage.getFollowers(user1).then(e => e)).to.deep.eq([])
//          expect(await userStorage.getFollowing(user1).then(e => e)).to.deep.eq([])
//          expect(await userStorage.getFollowers(user2).then(e => e)).to.deep.eq([])
//          expect(await userStorage.getFollowing(user2).then(e => e)).to.deep.eq([])
//
//          // check minting
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
//        })
//      })
//      describe('failure', () => {
        // creation
//        it('can\'t create double account', async () => {
//          await interface.newUser(user1, toBytes('user_3'), toBytes('@user_3'), {from: user1}).should.be.rejected
//        })
//        it('can\'t create redundant user address', async () => {
//          await interface.newUser(user3, toBytes('user_3'), toBytes('@user_1'), {from: user3}).should.be.rejected
//        })
//        it('can\'t create account for other address', async () => {
//          await interface.newUser(user3, toBytes('user_3'), toBytes('@user_3'), {from: user2}).should.be.rejected
//        })
//        it('can\'t create user address without @', async () => {
//          await interface.newUser(user3, toBytes('user_3'), toBytes('user_3'), {from: user3}).should.be.rejected
//        })
//        // userAddress/userName change
//        it('can\'t change user address for other address', async () => {
//          await interface.changeUserAddress(user3, toBytes('@user_3'), {from: user2}).should.be.rejected
//        })
//        it('can\'t change userAddress to same user address', async () => {
//          await interface.changeUserAddress(user2, toBytes('@user_2'), {from: user2}).should.be.rejected
//        })
//        it('can\'t change userName to same username', async () => {
//          await interface.changeUserName(user2, toBytes('user_2'), {from: user2}).should.be.rejected
//        })
//        it('can\'t change userName to same username', async () => {
//          await interface.changeUserName(user2, toBytes('user_2'), {from: user2}).should.be.rejected
//        })
//        it('can\'t change userAddress without account', async () => {
//          await interface.changeUserAddress(user3, toBytes('@user_2'), {from: user3}).should.be.rejected
//        })
//        it('can\'t change userName without account', async () => {
//          await interface.changeUserName(user3, toBytes('user_2'), {from: user3}).should.be.rejected
//        })
//        it('can\'t change userAddress without @ at beginning', async () => {
//          await interface.changeUserName(user3, toBytes('user_3'), {from: user3}).should.be.rejected
//        })
//        // follow function
//        it('can\'t follow account that doesn\'t exist, or follow account from one that doesn\'t exist', async () => {
//          await interface.followUser(user1, user4, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//          await interface.followUser(user4, user1, {from: user4}).should.be.rejectedWith(EVM_REVERT)
//        })
//
//      })
//    })
//    describe('Posting meme', () => {
//      describe('success', () => {
//        it('post meme', async () => {
//          await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user1})
//          const id = await interface.encode(1);
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//          expect(await memeStorage.memeCount().then(bal => bal.toString())).to.be.eq('1')
//
//          expect(await memeStorage.getEncodeId(1)).to.be.eq(id)
//        })
//        it('post multiple memes', async () => {
//          await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user1})
//          await interface.newMeme(user2, 'hello world!', [], '0x0', '0x0', {from: user2})
//          await interface.newMeme(deployer, 'hello world!', [], '0x0', '0x0', {from: deployer})
//          const id1 = await interface.encode(1);
//          const id2 = await interface.encode(2);
//          const id3 = await interface.encode(3);
//
//          expect(await memeStorage.memeCount().then(bal => bal.toString())).to.be.eq('3')
//
//          expect(await memeStorage.getEncodeId(1)).to.be.eq(id1)
//          expect(await memeStorage.getEncodeId(2)).to.be.eq(id2)
//          expect(await memeStorage.getEncodeId(3)).to.be.eq(id3)
//        })
//        it('post meme with tags', async () => {
//          await interface.newMeme(user1, 'hello world!', [user2, deployer], BYTES32, BYTES32, {from: user1})
//          expect(await memeStorage.getEncodeTags(1)).to.deep.eq([user2, deployer])
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('10')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('3')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('3')
//        })
//        it('no excess UME minted upon "dry" post', async () => { // with empty tag list & 0 for parentId and originId, no excess
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('0')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('0')
//        })
//        it('no UME minted from tagging self', async () => {
//          await interface.newMeme(user1, 'hello world!', [user1], BYTES32, BYTES32, {from: user1})
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
//        })
//        it('respond works when parentId & originId are the same', async () => {
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1})
//          let id1 = await interface.encode(1).valueOf()
//          await interface.newMeme(user2, 'what up?', [], id1, id1, {from: user2})
//          let id2 = await interface.encode(2).valueOf()
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('12')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('10')
//        })
//        it('respond & curate work when parentId & originId are different', async () => {
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
//          let id1 = await interface.encode(1)
//          await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
//          let id2 = await interface.encode(2)
//          await interface.newMeme(deployer, 'what?', [], id2, id1, {from: deployer}) // deployer responds to user2
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('16')
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('14')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('12')
//        })
//        it('post gets added to User', async () => {
//          await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user1})
//          let id1 = await interface.encode(1)
//          expect(await userStorage.getPosts(user1)).to.deep.eq([id1])
//        })
//        it('user post count works', async () => {
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
//          let id1 = await interface.encode(1)
//          await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
//          let id2 = await interface.encode(2)
//          await interface.newMeme(deployer, 'what?', [], id2, id2, {from: deployer}) // deployer responds to user2
//          let id3 = await interface.encode(3)
//          await interface.newMeme(user1, 'you heard me!', [], id3, id1, {from: user1}) // user1 post
//          let id4 = await interface.encode(4)
//
//          expect(await userStorage.getPosts(user1)).to.deep.eq([id1, id4])
//          expect(await userStorage.getPosts(user2)).to.deep.eq([id2])
//          expect(await userStorage.getPosts(deployer)).to.deep.eq([id3])
//        })
//        it('delete meme works', async () => {
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
//          const id1 = await interface.encode(1)
//          await interface.deleteMeme(user1, id1, {from: user1})
//
//          const meme1 = await memeStorage.memes(id1);
//          expect(await meme1.id).to.be.eq(BYTES32)
//          expect(await meme1.time.toNumber()).to.be.eq(0)
//          expect(await meme1.text).to.be.eq('')
//          expect(await meme1.parentId).to.be.eq(BYTES32)
//          expect(await meme1.originId).to.be.eq(BYTES32)
//          expect(await meme1.author).to.be.eq(ETHER_ADDRESS)
//          expect(await meme1.isVisible).to.be.eq(false)
//
//          expect(await memeStorage.getEncodeLikers(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await memeStorage.getEncodeUnlikers(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await memeStorage.getEncodeTags(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await memeStorage.getEncodeResponses(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//
//        })
//        it('memeStorage.meme tallies responses', async () => {
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
//          const id1 = await interface.encode(1)
//          await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
//          const id2 = await interface.encode(2)
//          await interface.newMeme(deployer, 'what?', [], id2, id1, {from: deployer}) // deployer responds to user.
//          const id3 = await interface.encode(3)
//          await interface.newMeme(user1, 'you heard me!', [], id3, id1, {from: user1}) // user1 post
//          const id4 = await interface.encode(4)
//          await interface.newMeme(deployer, 'wait what?', [], id1, id1, {from: deployer}) // deployer responds to user.
//          const id5 = await interface.encode(5)
//
//          expect(await memeStorage.getEncodeResponses(1).then(elem => elem)).to.deep.eq([id2, id5])
//          expect(await memeStorage.getEncodeResponses(2).then(elem => elem)).to.deep.eq([id3])
//          expect(await memeStorage.getEncodeResponses(3).then(elem => elem)).to.deep.eq([id4])
//          expect(await memeStorage.getEncodeResponses(4).then(elem => elem)).to.deep.eq([])
//        })
//        it('delete meme deletes response in parent', async () => {
//          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
//          const id1 = await interface.encode(1)
//          await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
//          const id2 = await interface.encode(2)
//          await interface.newMeme(deployer, 'what?', [], id2, id1, {from: deployer}) // deployer responds to user.
//          const id3 = await interface.encode(3)
//          await interface.newMeme(user1, 'you heard me!', [], id3, id1, {from: user1}) // user1 post
//          const id4 = await interface.encode(4)
//          await interface.newMeme(deployer, 'wait what?', [], id1, id1, {from: deployer}) // deployer responds to user.
//          const id5 = await interface.encode(5)
//
//          await interface.deleteMeme(user2, id2, {from: user2})
//          await interface.deleteMeme(deployer, id3, {from: deployer})
//          await interface.deleteMeme(deployer, id5, {from: deployer})
//
//          expect(await memeStorage.getEncodeResponses(1).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await memeStorage.getEncodeResponses(2).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await memeStorage.getEncodeResponses(3).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//          expect(await memeStorage.getEncodeResponses(4).then(elem => elem.map(e => e.toString()))).to.deep.eq([])
//        })
//      })
//      describe('failure', () => {
//        it('doesn\'t post meme with wrong users', async () => {
//          await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t bypass to mint (ume)', async () => {
//          await umeToken.mintPost(user1, 'hello world!', {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await umeToken.mintPost(user2, 'hello world!', {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t bypass to mint (post)', async () => {
//          await post.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await post.newMeme(user2, 'hello world!', [], '0x0', '0x0', {from: deployer}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('doesn\'t post meme with empty message', async () => {
//          await interface.newMeme(user1, '', [], '0x0', '0x0', {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('other user can\'t delete user\'s meme', async () => {
//          await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user1})
//          const id1 = await interface.encode(1)
//          await interface.deleteMeme(user1, id1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t create meme with parentId that doesn\'t exist', async () => {
//          const id1 = await interface.encode(3)
//          await interface.newMeme(user1, 'hello world!', [], id1, '0x0', {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t post meme from account that hasn\'t been created yet', async () => {
//          await interface.newMeme(user3, 'hello world!', [], '0x0', '0x0', {from: user3}).should.be.rejectedWith(EVM_REVERT)
//        })
//      })
//    })
//    describe('ReMeme functionality', () => {
//      beforeEach(async () => {
//        await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
//        const id1 = await interface.encode(1)
//        await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
//        const id2 = await interface.encode(2)
//        await interface.newMeme(deployer, 'what?', [], id2, id1, {from: deployer}) // deployer responds to user.
//        const id3 = await interface.encode(3)
//        await interface.newMeme(user1, 'you heard me!', [], id3, id1, {from: user1}) // user1 post
//        await interface.newMeme(deployer, 'wait what?', [], id1, id1, {from: deployer}) // deployer responds to user.
//      })
//      describe('success', () => {
//        it('rememe works', async () => {
//          const id1 = await interface.encode(1)
//          const id6 = await interface.encode(6)
//
//          await interface.rememe(deployer, id1, {from: deployer})
//
//          expect(await memeStorage.memeCount().then(e => e.toNumber())).to.be.eq(6)
//          expect(await memeStorage.getText(id6).then(e => e.toString())).to.be.eq('')
//          expect(await memeStorage.getRepostId(id6)).to.be.eq(id1)
//          expect(await memeStorage.getReposts(id1)).to.deep.eq([id6])
//        })
//        it('quoteMeme works', async () => {
//          const id1 = await interface.encode(1)
//          const id6 = await interface.encode(6)
//
//          await interface.quoteMeme(deployer, 'this is so on point', [], '0x0', '0x0', id1, {from: deployer})
//
//          expect(await memeStorage.memeCount().then(e => e.toNumber())).to.be.eq(6)
//          expect(await memeStorage.getText(id6).then(e => e.toString())).to.be.eq('this is so on point')
//          expect(await memeStorage.getRepostId(id6)).to.be.eq(id1)
//          expect(await memeStorage.getQuotePosts(id1)).to.deep.eq([id6])
//        })
//      })
//      describe('failure', () => {
//        it('can\'t rememe with account that doesn\'t exist', async () => {
//          const id = await interface.encode(1)
//          await interface.rememe(user4, id, {from: user4}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t quoteMeme with account that doesn\'t exist', async () => {
//          const id = await interface.encode(1)
//          await interface.quoteMeme(user4, 'so true', [], '0x0', '0x0', id, {from: user4}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t rememe meme that doesn\'t exist', async () => {
//          const id = await interface.encode(7)
//          await interface.rememe(user1, id, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('can\'t quoteMeme that doesn\'t exist', async () => {
//          const id = await interface.encode(7)
//          await interface.quoteMeme(user1, 'so true', [], '0x0', '0x0', id, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//      })
//    })
//    describe('Liking meme', () => {
//      beforeEach(async () => {
//        //await user.newAccount(user1, 'user_1', '@user_1', {from: user1})
//        //await user.newAccount(user2, 'user_2', '@user_2', {from: user2})
//        //await user.newAccount(deployer, 'deployer', '@deployer', {from: deployer})
//        const id1 = await interface.encode(1)
//        const id2 = await interface.encode(2)
//
//        await interface.newMeme(user1, 'hello world!', [], '0x0', '0x0', {from: user1}) // user1 post
//        await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
//        await interface.newMeme(deployer, 'what?', [user1, user2], id2, id1, {from: deployer}) // deployer responds to user2, tags user1 & user2
//      })
//      describe('success', () => {
//        it('like functionality', async () => {
//          const id1 = await interface.encode(1)
//          const id2 = await interface.encode(2)
//          await interface.likeMeme(user2, id1, {from: user2}) //user2 likes meme id1
//          // checks likers
//          expect(await memeStorage.getEncodeLikers(1).then(elem => elem)).to.deep.eq([user2])
//          // checks taggs of third post
//          expect(await memeStorage.getEncodeTags(3).then(elem => elem)).to.deep.eq([user1, user2])
//          // checks number of likes in first & 2nd post
//          expect(await memeStorage.getEncodeLikeCount(1).then(e => e.toNumber())).to.be.eq(1)
//          expect(await memeStorage.getEncodeLikeCount(2).then(e => e.toNumber())).to.be.eq(0)
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
//          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('14')
//        })
//        it('unlike functionality', async () => {
//          const id1 = await interface.encode(1)
//          const id2 = await interface.encode(2)
//          await interface.likeMeme(user2, id1, {from: user2}) //user2 likes meme id1
//          await interface.likeMeme(user2, id1, {from: user2}) //user2 should unlike meme id1
//
//          // likers list should have a deleted element
//          expect(await memeStorage.getEncodeLikers(1).then(elem => elem)).to.deep.eq([])
//          // unlikers list should have increased
//          expect(await memeStorage.getEncodeUnlikers(1).then(elem => elem)).to.deep.eq([user2])
//          // likes should decrement
//          expect(await memeStorage.getEncodeLikeCount(1).then(elem => elem.toNumber())).to.be.eq(0)
//          // balance should remain unchanged
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
//        })
//        it('like, unlike, like functionality', async () => {
//          const id1 = await interface.encode(1)
//          const id2 = await interface.encode(2)
//          await interface.likeMeme(user2, id1, {from: user2}) //user2 likes meme id1
//          await interface.likeMeme(user2, id1, {from: user2}) //user2 should unlike meme id1
//          await interface.likeMeme(user2, id1, {from: user2}) //user2 should unlike meme id1
//
//          expect(await memeStorage.getEncodeLikers(1).then(elem => elem)).to.deep.eq([user2])
//          expect(await memeStorage.getEncodeUnlikers(1).then(elem => elem)).to.deep.eq([])
//          // checks taggs of third post
//          expect(await memeStorage.getEncodeTags(3).then(elem => elem)).to.deep.eq([user1, user2])
//          // checks number of likes in first & 2nd post
//          expect(await memeStorage.getEncodeLikeCount(1).then(elem => elem.toNumber())).to.be.eq(1)
//
//          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
//          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
//        })
//      })
//      describe('failure', () => {
//        it('wrong account shouldn\'t be able to like', async () => {
//          const id1 = await interface.encode(1)
//          const id2 = await interface.encode(2)
//          await interface.likeMeme(user1, id1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//          await interface.likeMeme(deployer, id1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('user shouldn\'t be able to call interface.likeMeme', async () => {
//          const id1 = await interface.encode(1)
//          await interface.likeMeme(user1, id1, {from: user1}).should.be.rejected
//        })
//        it('post shouldn\'t be able to call interface.likeMeme', async () => {
//          const id1 = await interface.encode(1)
//          await interface.likeMeme(user1, id1, {from: post.address}).should.be.rejected
//        })
//        it('user shouldn\'t be able to like memes that don\'t exist', async () => {
//          const id1 = await interface.encode(4)
//          await interface.likeMeme(user1, id1, {from: user1}).should.be.rejectedWith(EVM_REVERT)
//        })
//        it('only registered user can like meme', async () => {
//          const id1 = await interface.encode(1)
//          await interface.likeMeme(user4, id1, {from: user4}).should.be.rejectedWith(EVM_REVERT)
//        })
//      })
//    })
    describe('Boost', () => {
      describe('success', () => {
        it('liking memes boosts', async () => {
          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
          const id1 = await interface.encode(1)
          await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
          const id2 = await interface.encode(2)
          await interface.newMeme(deployer, 'what?', [], id2, id1, {from: deployer}) // deployer responds to user.
          const id3 = await interface.encode(3)
          await interface.newMeme(user1, 'you heard me!', [], id3, id1, {from: user1}) // user1 post
          const id4 = await interface.encode(4)
          await interface.newMeme(deployer, 'wait what?', [], id1, id1, {from: deployer}) // deployer responds to user.
          const id5 = await interface.encode(5)

          await interface.likeMeme(user1, id3, {from: user1})
          await interface.likeMeme(deployer, id4, {from: deployer})
          await interface.likeMeme(user1, id5, {from: user1})
          await interface.likeMeme(deployer, id5, {from: deployer})

          expect(await memeStorage.getBoost(id1).then(e => e.toNumber())).to.be.eq(16)
          expect(await memeStorage.getBoost(id2).then(e => e.toNumber())).to.be.eq(4)
          expect(await memeStorage.getBoost(id3).then(e => e.toNumber())).to.be.eq(9)
          expect(await memeStorage.getBoost(id4).then(e => e.toNumber())).to.be.eq(5)
          expect(await memeStorage.getBoost(id5).then(e => e.toNumber())).to.be.eq(5)
        })
        it('boost & unBoost works', async () => {
          await interface.newMeme(user1, 'hello world!', [], BYTES32, BYTES32, {from: user1}) // user1 post
          const id1 = await interface.encode(1)
          await interface.newMeme(user2, 'what\'s up?', [], id1, id1, {from: user2}) // user2 responds to user1
          const id2 = await interface.encode(2)
          await interface.newMeme(deployer, 'what?', [], id2, id1, {from: deployer}) // deployer responds to user.
          const id3 = await interface.encode(3)
          await interface.newMeme(user1, 'you heard me!', [], id3, id1, {from: user1}) // user1 post
          const id4 = await interface.encode(4)
          await interface.newMeme(deployer, 'wait what?', [], id1, id1, {from: deployer}) // deployer responds to user.
          const id5 = await interface.encode(5)

          await interface.likeMeme(user1, id3, {from: user1})
          await interface.likeMeme(deployer, id4, {from: deployer})
          await interface.likeMeme(user1, id5, {from: user1})
          await interface.likeMeme(deployer, id5, {from: deployer})

          await umeToken.balanceOf(user1).then(e => console.log(e.toNumber()))

          await interface.boostMeme(user1, id2, 5, {from: user1})
          await interface.unBoostMeme(user1, id4, 5, {from: user1})
          await interface.unBoostMeme(user1, id5, 5,  {from: user1})

          await umeToken.balanceOf(user1).then(e => console.log(e.toNumber()))

          expect(await memeStorage.getBoost(id1).then(e => e.toNumber())).to.be.eq(16)
          expect(await memeStorage.getBoost(id2).then(e => e.toNumber())).to.be.eq(9)
          expect(await memeStorage.getBoost(id3).then(e => e.toNumber())).to.be.eq(9)
          expect(await memeStorage.getBoost(id4).then(e => e.toNumber())).to.be.eq(0)
          expect(await memeStorage.getBoost(id5).then(e => e.toNumber())).to.be.eq(0)

        })
      })
      describe('failure', () => {
      })
    })
//    describe('Scaling', () => {
//      describe('Posting', () => {
//        describe('Success', () => {
//          it('can post one thousand memes', async () => {
//            let id;
//            for (let i = 0; i < 1000; i++) {
//              id = interface.encode(i)
//              await interface.newMeme(user1, 'test' + i, [], '0x0', '0x0', {from: user1})
//            }
//            expect(await memeStorage.memeCount().then(e => e.toNumber())).to.be.eq(10000)
//            expect(await umeStorage.balanceOf(user1).then(e => e.toNumber())).to.be.eq(80000)
//          })
//        })
//      })
//    })
  })
})

