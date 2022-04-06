const fundEth = artifacts.require("fundEth");

module.exports = async function(deployer) {
  await deployer.deploy(fundEth);
};
