// import { ethers } from "hardhat";

const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('OrderBook contract', function () {
  async function deployTokenFixture() {
    const Token1 = await ethers.getContractFactory('ERC20');
    const hardhatToken1 = await Token1.deploy('Token 01', 'hak');
    await hardhatToken1.deployed();

    const Token2 = await ethers.getContractFactory('ERC20');
    const hardhatToken2 = await Token2.deploy('Token 02', 'art');
    await hardhatToken2.deployed();

    const feeAddr = '0x1234567890123456789012345678901234567890';
    const takerFee = 100; // 1% represented in BPS
    const makerFee = 50; // 0.5% represented in BPS

    const OrderBook = await ethers.getContractFactory('OrderBook');
    const hardhatOrderBook = await OrderBook.deploy(
      hardhatToken1.address,
      hardhatToken2.address,
      feeAddr,
      takerFee,
      makerFee
    );
    await hardhatOrderBook.deployed();
    return {
      hardhatToken1,
      hardhatToken2,
      hardhatOrderBook,
      feeAddr,
      takerFee,
      makerFee,
    };
  }

  describe('Deployment', function () {
    it('should assign correct ERC20 instance as token1', async function () {
      const { hardhatOrderBook, hardhatToken1 } = await loadFixture(
        deployTokenFixture
      );
      expect(await hardhatOrderBook.token1()).to.equal(hardhatToken1.address);
    });
    it('should assign correct ERC20 instance as token2', async function () {
      const { hardhatOrderBook, hardhatToken2 } = await loadFixture(
        deployTokenFixture
      );
      expect(await hardhatOrderBook.token2()).to.equal(hardhatToken2.address);
    });
    it('should assign correct feeAddr', async function () {
      const { hardhatOrderBook, feeAddr } = await loadFixture(
        deployTokenFixture
      );
      expect(await hardhatOrderBook.feeAddr()).to.equal(feeAddr);
    });
    it('should assign correct takerFee', async function () {
      const { hardhatOrderBook, takerFee } = await loadFixture(
        deployTokenFixture
      );
      expect(await hardhatOrderBook.takerFee()).to.equal(takerFee);
    });
    it('should assign correct makerFee', async function () {
      const { hardhatOrderBook, makerFee } = await loadFixture(
        deployTokenFixture
      );
      expect(await hardhatOrderBook.makerFee()).to.equal(makerFee);
    });
  });
});
