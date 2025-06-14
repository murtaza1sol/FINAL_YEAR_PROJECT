require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/P1EbFu1_oNxl1AYp2vkoX3t3YG-U7jDV',
      accounts: ['c47ae6afa79b4d4ba06b000e72ee838ba2c35a874d0d11a1f45ae9c1a1d8555b'],
    },
  },
};
