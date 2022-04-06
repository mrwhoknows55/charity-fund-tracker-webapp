module.exports = {
  networks: {
    development: {
    //  host: "127.0.0.1",
     host: "3.110.127.12",
     port: 8545,
     network_id: "*",
    },
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
