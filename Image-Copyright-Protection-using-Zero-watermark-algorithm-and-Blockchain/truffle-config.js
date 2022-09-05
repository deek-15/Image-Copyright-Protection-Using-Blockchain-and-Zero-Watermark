const path = require("path");
// const HDWalletProvider = require("truffle-hdwallet-provider");
// const mnemonic = "indoor dish desk flag debris potato excuse depart ticket judge file exit";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    // goerli: {
    //   provider: () => {
    //     return new HDWalletProvider(mnemonic, 'https://goerli.infura.io/v3/' + "082dc4d236384838a50a522695e14e47")
    //   },
    //   network_id: '5', // eslint-disable-line camelcase
    //   gas: 4465030,
    //   gasPrice: 10000000000,
    // },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
