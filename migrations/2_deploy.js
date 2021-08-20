var Timeline = artifacts.require("./Timeline.sol");
var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

module.exports = async function(deployer) {
  await deployer.deploy(UME)

  const umeToken = await UME.deployed()
  await deployer.deploy(We, UME.address)
  const we = await We.deployed()
  await deployer.deploy(Timeline, UME.address)
  const timeline = await Timeline.deployed()

  await umeToken.passMinterRole(we.address)
  await umeToken.passCallerRole(timeline.address)
}
