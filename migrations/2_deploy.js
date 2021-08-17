var ME = artifacts.require("./ME.sol");
var Timeline = artifacts.require("./Timeline.sol");
var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

module.exports = function(deployer) {
  deployer.deploy(ME);
  deployer.deploy(Timeline);
  deployer.deploy(UME);
  deployer.deploy(We);
}
