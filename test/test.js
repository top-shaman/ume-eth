const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const WE_ERROR = 'Error: "we" cannot call mint.'

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

var ME = artifacts.require("./ME.sol");
var Backend = artifacts.require("./Backend.sol");
var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Backend', ([deployer, user1, user2]) => {
  let we, umeToken, backend

  beforeEach(async () => {
    umeToken = await UME.new()
    we = await We.new(umeToken.address)
    backend = await Backend.new(umeToken.address)
    await umeToken.passMinterRole(we.address, {from: deployer})

  }) /*
  describe ('testing basic UME minting functionality', () => {
    beforeEach(async () => {
      await umeToken.passCallerRole(user1, {from: deployer}) // for the sake of testing basic functionality, assign caller to user1
    })
    describe('success', () => {
      it('checking UME token name', async () => {
        expect(await umeToken.name()).to.be.eq('uMe token')
      })
      it('checking UME token symbol', async () => {
        expect(await umeToken.symbol()).to.be.eq('UME')
      })
      it('checking initial token supply for UME token', async () => {
        expect(await umeToken.totalSupply().then(supply => supply.toString())).to.be.eq('0')
      })
      it('checking if Post mints', async () => {
        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: user1}) // sample Post

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
      })
      it('checking if Like mints', async () => {
        await umeToken.mintLike(user1, user2, '0x012345', {from: user1}) // sample Like

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('5')
      })
      it('checking if Tag mints', async () => {
        await umeToken.mintTag(user1, user2, '0x012345', {from: user1}) // sample Tag

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('3')
      })
      it('checking if Follow mints', async () => {
        await umeToken.mintFollow(user1, user2, {from: user1}) // sample Follow

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
      })
      it('checking if Respond mints', async () => {
        await umeToken.mintRespond(user1, user2, '0x12345', {from: user1}) // sample Respond

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking if Curate mints', async () => {
        await umeToken.mintCurate(user1, user2, '0x12345', {from: user1}) // sample Curate

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking if Jury mints', async () => {
        await umeToken.mintJury(user1, '0x012345', true, {from: user1}) // sample Jury consensus

        await umeToken.passCallerRole(user2, {from: user1})
        await umeToken.mintJury(user2, '0x012345', false, {from: user2}) // sample Jury no consensus

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking group functionality', async () => {
        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: user1}) // sample Post
        await umeToken.mintLike(user1, user2, '0x012345', {from: user1}) // sample Like
        await umeToken.mintTag(user1, user2, '0x012345', {from: user1}) // sample Tag
        await umeToken.mintFollow(user1, user2, {from: user1}) // sample Follow
        await umeToken.mintRespond(user1, user2, '0x12345', {from: user1}) // sample Respond
        await umeToken.mintCurate(user1, user2, '0x12345', {from: user1}) // sample Curate
        await umeToken.mintJury(user1, '0x012345', true, {from: user1}) // sample Jury consensus

        await umeToken.passCallerRole(user2, {from: user1})
        await umeToken.mintJury(user2, '0x012345', false, {from: user2}) // sample Jury no consensus

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('40')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('26')
      })
      it('We should have the UME token minter role', async () => {
        expect(await umeToken.minter()).to.be.eq(we.address)
      })
      it('For the sake of these tests, user1 should have caller role', async () => {
        expect(await umeToken.caller()).to.be.eq(user1)
      })
      it('Deployer, user1, user2 shouldn\'t have token minter role', async () => {
        expect(await umeToken.minter()).to.not.eq(deployer)
        expect(await umeToken.minter()).to.not.eq(user1)
        expect(await umeToken.minter()).to.not.eq(user2)
      })
      it('Once transfered, deployer, user1, user2 shouldn\'t have caller role', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        expect(await umeToken.caller()).to.not.eq(deployer)
        expect(await umeToken.caller()).to.not.eq(user1)
        expect(await umeToken.caller()).to.not.eq(user2)
      })
    })
    describe('failures', () => {
      it('checking for false minting, group', async () => {
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
        expect(await umeToken.balanceOf(we.address).then(bal => bal.toString())).to.be.eq('0')
      })
      it('We shouldn\'t be able to post and therefore cannot mint UME', async () => {
        await umeToken.passCallerRole(we.address, {from: user1})
        await umeToken.mintPost(we.address, '0x012345', 'hello world!', {from: we.address}).should.be.rejectedWith(WE_ERROR)
      })
      it('Incorrect addresses shouldn\'t be able to mint POST UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Post
        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Post
      })
      it('Incorrect addresses shouldn\'t be able to mint LIKE UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintLike(user1, user2, '0x012345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample
        await umeToken.mintLike(user1, user2, '0x012345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Like
      })
      it('Incorrect addresses shouldn\'t be able to mint TAG UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintTag(user1, user2, '0x012345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Tag
        await umeToken.mintTag(user1, user2, '0x012345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Tag
      })
      it('Incorrect addresses shouldn\'t be able to mint FOLLOW UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintFollow(user1, user2, {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Follow
        await umeToken.mintFollow(user1, user2, {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Follow
      })
      it('Incorrect addresses shouldn\'t be able to mint RESPOND UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintRespond(user1, user2, '0x12345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Respond
        await umeToken.mintRespond(user1, user2, '0x12345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Respond
      })
      it('Incorrect addresses shouldn\'t be able to mint CURATE UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintCurate(user1, user2, '0x12345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Curate
        await umeToken.mintCurate(user1, user2, '0x12345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Curate
      })
      it('Incorrect addresses shouldn\'t be able to mint JURY UME if they are not caller', async () => {
        await umeToken.passCallerRole(backend.address, {from: user1})

        await umeToken.mintJury(user1, '0x012345', true, {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Jury consensus
        await umeToken.mintJury(user1, '0x012345', true, {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Jury consensus
      })
      it('passing minter role should be rejected', async () => {
        await umeToken.passMinterRole(user1, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
      })
      it('minting role should not be able to be passed between users who don\'t have it', async () => {
        await umeToken.passMinterRole(user1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
      })
      it('passing caller role should be rejected', async () => {
        await umeToken.passCallerRole(user2, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
      })
      it('caller role should not be able to be passed between users who don\'t have it', async () => {
        await umeToken.passCallerRole(deployer, {from: user2}).should.be.rejectedWith(EVM_REVERT)
      })
    })
  }) */
  describe('testing Backend functionality', () => {
    beforeEach(async () => {
      await umeToken.passCallerRole(backend.address, {from: deployer})
      await backend.newAccount(user1, 'user_1', '@user_1', {from: user1})
      await backend.newAccount(user2, 'user_2', '@user_2', {from: user2})
    })
    /*
    describe('Posting meme', () => {
      describe('success', () => {
        it('post meme', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user1})

          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
          expect(await backend.memeCount().then(bal => bal.toString())).to.be.eq('1')
          expect(await backend.usersByMeme(1)).to.be.eq(user1)
        })
        it('post meme with tags', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [user2, deployer], 0, 0, {from: user1})

          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('10')
          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('3')
          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('3')
        })
        it('no excess UME minted upon "dry" post', async () => { // with empty tag list & 0 for parentId and originId, no excess
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user1})

          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('0')
          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('0')
        })
        it('no UME minted from tagging self', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [user1], 0, 0, {from: user1})

          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('8')
        })
        it('respond works when parentId & originId are the same', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user1})
          await backend.newMeme(user2, '0x67891011', 'what\'s up?', [], 1, 1, {from: user2})

          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('12')
          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('10')
        })
        it('respond & curate work when parentId & originId are different', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user1}) // user1 posts
          await backend.newMeme(user2, '0x67891011', 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
          await backend.newMeme(deployer, '0x67891011', 'what?', [], 2, 1, {from: deployer}) // deployer responds to user2

          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('16')
          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('14')
          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('12')
        })
        it('user post count works', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user1}) // user1 posts
          await backend.newMeme(user2, '0x67891011', 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
          await backend.newMeme(deployer, '0x5363635735', 'what?', [], 2, 1, {from: deployer}) // deployer responds to user2
          await backend.newMeme(user1, '0x064536476', 'you heard me!', [], 3, 1, {from: user1}) // user1 posts

          expect(await backend.getPosts(user1).then(elem => elem.map(e => e.toString()))).to.deep.eq(['1','4'])
          expect(await backend.getPosts(user2).then(elem => elem.map(e => e.toString()))).to.deep.eq(['2'])
          expect(await backend.getPosts(deployer).then(elem => elem.map(e => e.toString()))).to.deep.eq(['3'])
        })
      })
      describe('failure', () => {
        it('doesn\'t post meme with wrong users', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user2}).should.be.rejectedWith(EVM_REVERT)
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
        })
        it('doesn\'t post meme with empty message', async () => {
          await backend.newMeme(user1, '0x012345', '', [], 0, 0, {from: user1}).should.be.rejectedWith(EVM_REVERT)
        })
      })
    })
    describe('Liking meme', () => {
      describe('success', () => {
        it('like functionality', async () => {
          await backend.newMeme(user1, '0x012345', 'hello world!', [], 0, 0, {from: user1}) // user1 posts
          await backend.newMeme(user2, '0x67891011', 'what\'s up?', [], 1, 1, {from: user2}) // user2 responds to user1
          await backend.newMeme(deployer, '0x67891011', 'what?', [user1, user2], 2, 1, {from: deployer}) // deployer responds to user2, tags user1 & user2
          await backend.likeMeme(user2, 1, {from: user2}) //user2 likes meme id1

          const meme1 = await backend.memes(1)
          const meme2 = await backend.memes(2)
          const meme3 = await backend.memes(3)
          // checks resulting struct data
          expect(await backend.getLikers(1).then(elem => elem)).to.deep.eq([user2])
          expect(await backend.getTags(3).then(elem => elem)).to.deep.eq([user1, user2])
          // checks resulting balances
          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24') // 1 post + 2 f.responses, + 1 t.curate + 1 t.like + 1 t.tag
          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('19')
          expect(await umeToken.balanceOf(deployer).then(bal => bal.toString())).to.be.eq('14')
        })
      })
      describe('failure', () => {
      })
    })
      */
    describe('User functionality', () => {
      describe('success', () => {
        it('2 accounts created from before statement', async () => {
          expect(await backend.userCount().then(elem => elem.toString())).to.be.eq('2')
        })
        it('account #1 has id #1 and account #2 has name #2', async () => {
          expect(await backend.getId(user1).then(elem => elem.toString())).to.be.eq('1')
          expect(await backend.getId(user2).then(elem => elem.toString())).to.be.eq('2')
        })
        it('follow functionality', async () => {
          await backend.follow(user1, user2, {from: user1})

          //check follower/following counts
          expect(await backend.getFollowerCount(user1).then(elem => elem.toString())).to.be.eq('0')
          expect(await backend.getFollowingCount(user1).then(elem => elem.toString())).to.be.eq('1')
          expect(await backend.getFollowerCount(user2).then(elem => elem.toString())).to.be.eq('1')
          expect(await backend.getFollowingCount(user2).then(elem => elem.toString())).to.be.eq('0')

          // check follower/following list
          expect(await backend.getFollowers(user1).then(elem => elem)).to.deep.eq([])
          expect(await backend.getFollowing(user1).then(elem => elem)).to.deep.eq([user2])
          expect(await backend.getFollowers(user2).then(elem => elem)).to.deep.eq([user1])
          expect(await backend.getFollowing(user2).then(elem => elem)).to.deep.eq([])

          // check minting
          expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
          expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
        })
      })
      describe('failure', () => {
      })
    })
  })
})
