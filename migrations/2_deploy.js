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

module.exports = async function(deployer) {
  // deploy token
  await deployer.deploy(UME)
  const umeToken = await UME.deployed()
  // deploy fallback
  await deployer.deploy(We)
  // deploy storage
  await deployer.deploy(MemeStorage)
  const memeStorage = await MemeStorage.deployed()
  await deployer.deploy(UserStorage)
  const userStorage = await UserStorage.deployed()
  // deploy factories
  await deployer.deploy(MemeFactory, UME.address, MemeStorage.address, UserStorage.address)
  const memeFactory = await MemeFactory.deployed()
  await deployer.deploy(UserFactory, UserStorage.address)
  const userFactory = await UserFactory.deployed()

  // deploy interface functions
  await deployer.deploy(Post, UME.address, MemeFactory.address, MemeStorage.address)
  const post = await Post.deployed()
  await deployer.deploy(Like, UME.address, MemeStorage.address)
  const like = await Like.deployed()
  await deployer.deploy(Follow, UME.address, UserStorage.address)
  const follow = await Follow.deployed()
  await deployer.deploy(Boost, UME.address, MemeStorage.address) // to add more
  const boost = await Boost.deployed()

  // deploy interface
  await deployer.deploy(UserInterface, UME.address, MemeStorage.address, UserStorage.address, UserFactory.address, Post.address, Like.address, Follow.address, Boost.address)
  const userInterface = await UserInterface.deployed()

  // pass minter signing roles to post, like & follow
  await umeToken.passPostSignerRole(post.address)
  await umeToken.passMemeFactorySignerRole(memeFactory.address)
  await umeToken.passLikeSignerRole(like.address)
  await umeToken.passFollowSignerRole(follow.address)
  await umeToken.passBoostSignerRole(boost.address)
  // pass storage signer role -> factory
  await memeStorage.passFactorySigner(memeFactory.address)
  await userStorage.passMemeFactorySigner(memeFactory.address)
  await userStorage.passFactorySigner(userFactory.address)
  // pass meme storage signer role -> interface functions
  await memeStorage.passPostSigner(post.address)
  await memeStorage.passLikeSigner(like.address)
  await memeStorage.passBoostSigner(boost.address)
  // pass user storage signer role -> interface functions
  await userStorage.passLikeSigner(like.address)
  await userStorage.passFollowSigner(follow.address)

  // pass storage signer roles from -> user interface
  await memeStorage.passInterfaceSigner(userInterface.address)
  await userStorage.passInterfaceSigner(userInterface.address)
  // pass memeFactory signer role -> post function
  await memeFactory.passPostSigner(post.address)
  // pass userFactory signer role -> interface
  await userFactory.passInterfaceSigner(userInterface.address)
  // pass interface functions' signer roles -> interface
  await post.passInterfaceSigner(userInterface.address)
  await like.passInterfaceSigner(userInterface.address)
  await follow.passInterfaceSigner(userInterface.address)
  await boost.passInterfaceSigner(userInterface.address)
  await boost.passFactorySigner(memeFactory.address)
  await boost.passLikeSigner(like.address)
}
