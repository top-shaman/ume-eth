require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')
//const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
//const privateKeys = process.env.PRIVATE_KEYS || ""

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    /*
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 42
    },
    main: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `https://main.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 1
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // Array of account private keys
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 5000000,
      gasPrice: 5000000000, // 5 gwei
      network_id: 4
    },
    */
    ropsten: {
      provider: () => {
        return new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.ROPSTEN_URL)
      },
      network_id: 3
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: ">=0.8.0 <0.9.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

