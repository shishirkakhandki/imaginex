const { ethers } = require("hardhat");
const fs = require("fs");

const deployNFTMarketplace = async function (hre) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying NFTMarketplace and transferring ownership...");

  // Deploy NFTMarketplace
  const NFTMarketplace = await deploy("NFTMarketplace", {
    from: deployer,
    args: [], // Add any constructor arguments here if required
    log: true,
    waitConfirmations: 1, // networkConfig[network.name].blockConfirmations || 1,
  });

  log(`NFTMarketplace deployed at ${NFTMarketplace.address}`);

  // Transfer ownership
  const nftMarketplaceContract = await ethers.getContractAt("NFTMarketplace", NFTMarketplace.address);
  const timeLock = await ethers.getContract("TimeLock"); // Assuming TimeLock contract is already deployed

  const transferTx = await nftMarketplaceContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);

  // Save contract information to JSON file
  const data = {
    address: NFTMarketplace.address,
    abi: NFTMarketplace.abi,
  };
  console.log("NFT Marketplace JSON", JSON.stringify(data, null, 2));
  fs.writeFileSync('./src/NFTMarketplace.json', JSON.stringify(data, null, 2));
};

module.exports = deployNFTMarketplace;
deployNFTMarketplace.tags = ["all", "nftMarketplace"];
