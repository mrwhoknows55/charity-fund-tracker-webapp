module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
    //  host: "ganache.avdhut.live",
     port: 7545,
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
