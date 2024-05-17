const { ethers } = require("hardhat");
const {verify} =  require("../helper-functions");

const deployGovernanceToken = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("----------------------------------------------------");
  console.log("Deploying GovernanceToken and waiting for confirmations...");

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  console.log(`GovernanceToken at ${governanceToken.address}`);

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(governanceToken.address, []);
  }

  console.log(`Delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer);
  console.log("Delegated!");
};

const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const transactionResponse = await governanceToken.delegate(delegatedAccount);
  await transactionResponse.wait(1);
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);
};

deployGovernanceToken.tags = ["all", "governor"];

module.exports = deployGovernanceToken;
