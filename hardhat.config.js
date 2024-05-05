require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const fs = require('fs');

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [ process.env.REACT_APP_PRIVATE_KEY ]
    }, 
    sepolia: {
      url: "https://ethereum-sepolia.rpc.subquery.network/public",
      accounts: [ process.env.REACT_APP_PRIVATE_KEY ]
    }, 
    zkSepolia: {
      url: "https://zksync-era-sepolia.blockpi.network/v1/rpc/public",
      accounts: [ process.env.REACT_APP_PRIVATE_KEY ]
    },
    arbitrumSepolia: {
      url: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
      accounts: [ process.env.REACT_APP_PRIVATE_KEY ]
    }
    // https://zksync-era-sepolia.blockpi.network/v1/rpc/public	
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};