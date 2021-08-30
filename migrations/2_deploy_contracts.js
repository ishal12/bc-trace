// const UserManager = artifacts.require("UserManager");
// const LivestockManager = artifacts.require("LivestockManager");
// const SlaugherManager = artifacts.require("SlaughterManager");
const SlaughterManager = artifacts.require("SlaughterManager");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(SlaughterManager);
};
