require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, MNEMONIC } = process.env;
module.exports = {
  networks: {
    goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
      network_id: '5',
      gas: 4465030
    }
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abi/',

  compilers: {
    solc: {
      version: "0.8.11",
       optimizer: {
         enabled: true,
         runs: 200
       },
       evmVersion: "petersburg"
    }
  },
};
