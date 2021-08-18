var ME = artifacts.require("./ME.sol");
var Timeline = artifacts.require("./Timeline.sol");
var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

module.exports = async function(deployer) {
  await deployer.deploy(ME)
  await deployer.deploy(UME)

  const meToken = await ME.deployed()
  const umeToken = await UME.deployed()
  await deployer.deploy(We, ME.address, UME.address)
  const we = await We.deployed()
  await meToken.passMinterRole(we.address)
  await umeToken.passMinterRole(we.address)
}
