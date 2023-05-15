require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.18',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: true, // Add this line to enable the --via-ir flag
  },
};