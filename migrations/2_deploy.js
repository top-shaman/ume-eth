var Post = artifacts.require("./Post.sol");
var UME = artifacts.require("./UME.sol");
var User = artifacts.require("./User.sol");
var We = artifacts.require("./We.sol");

module.exports = async function(deployer) {
  await deployer.deploy(UME)

  const umeToken = await UME.deployed()
  await deployer.deploy(We, UME.address)
  const we = await We.deployed()
  await deployer.deploy(Post, UME.address)
  const post = await Post.deployed()
  await deployer.deploy(User, UME.address, Post.address)
  const user = await User.deployed()

  await umeToken.passMinterRole(we.address)
  await umeToken.passPostCallerRole(post.address)
  await umeToken.passUserCallerRole(user.address)
  await post.passPostRole(user.address)
}
