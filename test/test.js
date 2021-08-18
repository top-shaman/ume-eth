const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_REVERT = 'VM Exception while processing transaction: revert'

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
var Timeline = artifacts.require("./Timeline.sol");
var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('We', ([deployer, user1, user2]) => {
  let we, meToken, umeToken, user1MeToken
  const POST = 0
  const LIKE = 1
  const TAG = 2
  const FOLLOW = 3
  const RESPOND = 4
  const CURATE = 5
  const JURY = 6

  beforeEach(async () => {
    meToken = await ME.new()
    umeToken = await UME.new()
    we = await We.new(umeToken.address, meToken.address)
    await meToken.passMinterRole(we.address, {from: deployer})
    await umeToken.passMinterRole(we.address, {from: deployer})

    await meToken.mintPost(user1, '0x012345', 'hello world!', {from: user1}) // sample Post
    await meToken.mintLike(user1, user2, '0x012345', {from: user1}) // sample Like
    await meToken.mintTag(user1, user2, '0x012345', {from: user1}) // sample Tag
    await meToken.mintFollow(user1, user2, {from: user1}) // sample Follow
    await meToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: user1}) // sample Respond
    await meToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: user1}) // sample Curate
    await meToken.mintJury(user1, '0x012345', true, {from: user1}) // sample Jury consensus
    await meToken.mintJury(user2, '0x012345', false, {from: user2}) // sample Jury no consensus
  })
/*
  describe ('testing basic ME minting functionality', () => {
    describe('success', () => {
      it('checking if Post mints', async () => {
        expect(await meToken.balanceOf(user1, POST).then(bal => bal.toString())).to.be.eq('1')
      })
      it('checking if Like mints', async () => {
        expect(await meToken.balanceOf(user1, LIKE).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user2, LIKE).then(bal => bal.toString())).to.be.eq('3')
      })
      it('checking if Tag mints', async () => {
        expect(await meToken.balanceOf(user1, TAG).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user2, TAG).then(bal => bal.toString())).to.be.eq('3')
      })
      it('checking if Follow mints', async () => {
        expect(await meToken.balanceOf(user1, FOLLOW).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user2, FOLLOW).then(bal => bal.toString())).to.be.eq('3')
      })
      it('checking if Respond mints', async () => {
        expect(await meToken.balanceOf(user1, RESPOND).then(bal => bal.toString())).to.be.eq('2')
        expect(await meToken.balanceOf(user2, RESPOND).then(bal => bal.toString())).to.be.eq('1')
      })
      it('checking if Curate mints', async () => {
        expect(await meToken.balanceOf(user1, CURATE).then(bal => bal.toString())).to.be.eq('4')
        expect(await meToken.balanceOf(user2, CURATE).then(bal => bal.toString())).to.be.eq('1')
      })
      it('checking if Jury mints', async () => {
        expect(await meToken.balanceOf(user1, JURY).then(bal => bal.toString())).to.be.eq('5')
        expect(await meToken.balanceOf(user2, JURY).then(bal => bal.toString())).to.be.eq('1')
      })
      it('checking group functionality', async () => {
        expect(await meToken.balanceOf(user1, POST).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user1, LIKE).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user2, LIKE).then(bal => bal.toString())).to.be.eq('3')
        expect(await meToken.balanceOf(user1, TAG).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user2, TAG).then(bal => bal.toString())).to.be.eq('3')
        expect(await meToken.balanceOf(user1, FOLLOW).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user2, FOLLOW).then(bal => bal.toString())).to.be.eq('3')
        expect(await meToken.balanceOf(user1, RESPOND).then(bal => bal.toString())).to.be.eq('2')
        expect(await meToken.balanceOf(user2, RESPOND).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user1, CURATE).then(bal => bal.toString())).to.be.eq('4')
        expect(await meToken.balanceOf(user2, CURATE).then(bal => bal.toString())).to.be.eq('1')
        expect(await meToken.balanceOf(user1, JURY).then(bal => bal.toString())).to.be.eq('5')
        expect(await meToken.balanceOf(user2, JURY).then(bal => bal.toString())).to.be.eq('1')
      })
      it('We should have the ME token minter role', async () => {
        expect(await meToken.minter()).to.be.eq(we.address)
      })
    })
    describe('failures', () => {
      it('checking for false minting, group', async () => {
        expect(await meToken.balanceOf(we.address, POST).then(bal => bal.toString())).to.be.eq('0')
        expect(await meToken.balanceOf(we.address, LIKE).then(bal => bal.toString())).to.be.eq('0')
        expect(await meToken.balanceOf(we.address, TAG).then(bal => bal.toString())).to.be.eq('0')
        expect(await meToken.balanceOf(we.address, FOLLOW).then(bal => bal.toString())).to.be.eq('0')
        expect(await meToken.balanceOf(we.address, RESPOND).then(bal => bal.toString())).to.be.eq('0')
        expect(await meToken.balanceOf(we.address, CURATE).then(bal => bal.toString())).to.be.eq('0')
        expect(await meToken.balanceOf(we.address, JURY).then(bal => bal.toString())).to.be.eq('0')
      })
      it('Deployer, user1, user2 shouldn\'t have token minter role', async () => {
        expect(await meToken.minter()).to.not.eq(deployer)
        expect(await meToken.minter()).to.not.eq(user1)
        expect(await meToken.minter()).to.not.eq(user2)
      })
      it('We shouldn\'t be able to mint ME', async () => {
        await meToken.mintPost(we.address, '0x012345', 'hello world!').should.be.rejectedWith(EVM_REVERT)
      })
      it('Incorrect addresses shouldn\'t be able to mint POST ME', async () => {
        await meToken.mintPost(user1, '0x012345', 'hello world!', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Post
        await meToken.mintPost(user1, '0x012345', 'hello world!', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Post
      })
      it('Incorrect addresses shouldn\'t be able to mint LIKE ME', async () => {
        await meToken.mintLike(user1, user2, '0x012345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Like
        await meToken.mintLike(user1, user2, '0x012345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Like
      })
      it('Incorrect addresses shouldn\'t be able to mint TAG ME', async () => {
        await meToken.mintTag(user1, user2, '0x012345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Tag
        await meToken.mintTag(user1, user2, '0x012345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Tag
      })
      it('Incorrect addresses shouldn\'t be able to mint FOLLOW ME', async () => {
        await meToken.mintFollow(user1, user2, {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Follow
        await meToken.mintFollow(user1, user2, {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Follow
      })
      it('Incorrect addresses shouldn\'t be able to mint RESPOND ME', async () => {
        await meToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Respond
        await meToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Respond
      })
      it('Incorrect addresses shouldn\'t be able to mint CURATE ME', async () => {
        await meToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Curate
        await meToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Curate
      })
      it('Incorrect addresses shouldn\'t be able to mint JURY ME', async () => {
        await meToken.mintJury(user1, '0x012345', true, {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Jury consensus
        await meToken.mintJury(user1, '0x012345', true, {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Jury consensus
      })
    })
  })
    */
  describe ('testing UME minting', () => {
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
      it('We should have UME token minter role', async () => {
        expect(await umeToken.minter()).to.be.eq(we.address)
      })
      it('POST in Cache executes', async () => {
        expect(await we.cache().then(elem => elem)).to.be.eq(true)
      })
    })

    describe('failure', () => {
      it('passing minter role should be rejected', async () => {
        await umeToken.passMinterRole(user1, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
      })

      it('minting role should not be able to be passed between users who don\'t have it', async () => {
        await umeToken.passMinterRole(user1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
      })
      it('non-minter token minting should be rejected', async () => {
        await umeToken.mint(user1, '1', {from: deployer}).should.be.rejectedWith(EVM_REVERT)
      })
    })
  })
})
