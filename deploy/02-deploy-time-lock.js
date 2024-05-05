const verify = require("../helper-functions");
const { networkConfig, developmentChains, MIN_DELAY } = require("../helper-hardhat-config");

const deployTimeLock = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying TimeLock and waiting for confirmations...");

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], [], deployer],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  log(`TimeLock at ${timeLock.address}`);

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(timeLock.address, []);
  }
};

deployTimeLock.tags = ["all", "timelock"];

module.exports = deployTimeLock;
