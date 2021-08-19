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
  let we, umeToken, user1MeToken

  beforeEach(async () => {
    umeToken = await UME.new()
    we = await We.new(umeToken.address)
    await umeToken.passMinterRole(we.address, {from: deployer})

  })
  describe ('testing basic UME minting functionality', () => {
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
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking if Tag mints', async () => {
        await umeToken.mintTag(user1, user2, '0x012345', {from: user1}) // sample Tag

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('2')
      })
      it('checking if Follow mints', async () => {
        await umeToken.mintFollow(user1, user2, {from: user1}) // sample Follow

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('1')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('6')
      })
      it('checking if Respond mints', async () => {
        await umeToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: user1}) // sample Respond

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking if Curate mints', async () => {
        await umeToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: user1}) // sample Curate

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('2')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking if Jury mints', async () => {
        await umeToken.mintJury(user1, '0x012345', true, {from: user1}) // sample Jury consensus
        await umeToken.mintJury(user2, '0x012345', false, {from: user2}) // sample Jury no consensus

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('24')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('4')
      })
      it('checking group functionality', async () => {
        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: user1}) // sample Post
        await umeToken.mintLike(user1, user2, '0x012345', {from: user1}) // sample Like
        await umeToken.mintTag(user1, user2, '0x012345', {from: user1}) // sample Tag
        await umeToken.mintFollow(user1, user2, {from: user1}) // sample Follow
        await umeToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: user1}) // sample Respond
        await umeToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: user1}) // sample Curate
        await umeToken.mintJury(user1, '0x012345', true, {from: user1}) // sample Jury consensus
        await umeToken.mintJury(user2, '0x012345', false, {from: user2}) // sample Jury no consensus

        expect(await umeToken.balanceOf(user1).then(bal => bal.toString())).to.be.eq('40')
        expect(await umeToken.balanceOf(user2).then(bal => bal.toString())).to.be.eq('24')
      })
      it('We should have the UME token minter role', async () => {
        expect(await umeToken.minter()).to.be.eq(we.address)
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
      it('Deployer, user1, user2 shouldn\'t have token minter role', async () => {
        expect(await umeToken.minter()).to.not.eq(deployer)
        expect(await umeToken.minter()).to.not.eq(user1)
        expect(await umeToken.minter()).to.not.eq(user2)
      })
      it('We shouldn\'t be able to call mint UME', async () => {
        await umeToken.mintPost(we.address, '0x012345', 'hello world!').should.be.rejectedWith(EVM_REVERT)
      })
      it('Incorrect addresses shouldn\'t be able to mint POST UME', async () => {
        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Post
        await umeToken.mintPost(user1, '0x012345', 'hello world!', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Post
      })
      it('Incorrect addresses shouldn\'t be able to mint LIKE UME', async () => {
        await umeToken.mintLike(user1, user2, '0x012345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Like
        await umeToken.mintLike(user1, user2, '0x012345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Like
      })
      it('Incorrect addresses shouldn\'t be able to mint TAG UME', async () => {
        await umeToken.mintTag(user1, user2, '0x012345', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Tag
        await umeToken.mintTag(user1, user2, '0x012345', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Tag
      })
      it('Incorrect addresses shouldn\'t be able to mint FOLLOW UME', async () => {
        await umeToken.mintFollow(user1, user2, {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Follow
        await umeToken.mintFollow(user1, user2, {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Follow
      })
      it('Incorrect addresses shouldn\'t be able to mint RESPOND UME', async () => {
        await umeToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Respond
        await umeToken.mintRespond(user1, user2, '0x12345', '0x0678919', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Respond
      })
      it('Incorrect addresses shouldn\'t be able to mint CURATE UME', async () => {
        await umeToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: user2})
          .should.be.rejectedWith(EVM_REVERT) // sample Curate
        await umeToken.mintCurate(user1, user2, '0x12345', '0x0678919', {from: deployer})
          .should.be.rejectedWith(EVM_REVERT) // sample Curate
      })
      it('Incorrect addresses shouldn\'t be able to mint JURY UME', async () => {
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
    })
  })
})
