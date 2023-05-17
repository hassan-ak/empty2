// import { ethers } from "hardhat";

const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('OrderBook contract', function () {
  async function deployOrderBookFixture() {
    const Token1 = await ethers.getContractFactory('ERC20Mock');
    const hardhatToken1 = await Token1.deploy('Token 01', 'hak');
    await hardhatToken1.deployed();

    const Token2 = await ethers.getContractFactory('ERC20Mock');
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
    const [owner, nonOwner] = await ethers.getSigners();

    const OrderbookMock = await ethers.getContractFactory('OrderbookMock');
    const hardhatOrderbookMock = await OrderbookMock.deploy(
      hardhatToken1.address,
      hardhatToken2.address,
      feeAddr,
      takerFee,
      makerFee
    );
    await hardhatOrderbookMock.deployed();

    return {
      hardhatToken1,
      hardhatToken2,
      hardhatOrderBook,
      feeAddr,
      takerFee,
      makerFee,
      owner,
      nonOwner,
      hardhatOrderbookMock,
    };
  }

  async function makeOrderToken1Big1Fixture() {
    const [sender_11] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
      deployOrderBookFixture
    );
    await hardhatToken1.mintToken(sender_11.address, 1000);
    await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    const token1Amt_11 = 10;
    const token2Amt_11 = 1;
    const priceRatio_11 = 1000;
    const biggerToken_11 = 1;
    const sellingToken1_11 = 1;

    await hardhatOrderbookMock
      .connect(sender_11)
      .makeOrder(
        token1Amt_11,
        token2Amt_11,
        priceRatio_11,
        biggerToken_11,
        sellingToken1_11
      );

    const orderId_11 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_11 = await hardhatOrderbookMock.orders(
      orderId_11.toString()
    );

    return {
      hardhatOrderbookMock,
      token1Amt_11,
      token2Amt_11,
      priceRatio_11,
      biggerToken_11,
      sellingToken1_11,
      orderId_11,
      orderDetail_11,
      sender_11,
    };
  }

  async function makeOrderToken1Multiple() {
    const [sender_1_multiple] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
      deployOrderBookFixture
    );
    await hardhatToken1.mintToken(sender_1_multiple.address, 1000);
    await hardhatToken1.approve(hardhatOrderbookMock.address, 200);

    const token1Amt_1_multiple_1 = 10;
    const token2Amt_1_multiple_1 = 1;
    const priceRatio_1_multiple_1 = 1000;
    const biggerToken_1_multiple_1 = 1;
    const sellingToken1_1_multiple_1 = 1;
    await hardhatOrderbookMock
      .connect(sender_1_multiple)
      .makeOrder(
        token1Amt_1_multiple_1,
        token2Amt_1_multiple_1,
        priceRatio_1_multiple_1,
        biggerToken_1_multiple_1,
        sellingToken1_1_multiple_1
      );
    const orderId_1_multiple_1 = await hardhatOrderbookMock.currentOrderId();
    const orderDetail_1_multiple_1 = await hardhatOrderbookMock.orders(
      orderId_1_multiple_1.toString()
    );

    const token1Amt_1_multiple_2 = 10;
    const token2Amt_1_multiple_2 = 1;
    const priceRatio_1_multiple_2 = 1000;
    const biggerToken_1_multiple_2 = 2;
    const sellingToken1_1_multiple_2 = 1;

    await hardhatOrderbookMock
      .connect(sender_1_multiple)
      .makeOrder(
        token1Amt_1_multiple_2,
        token2Amt_1_multiple_2,
        priceRatio_1_multiple_2,
        biggerToken_1_multiple_2,
        sellingToken1_1_multiple_2
      );

    const orderId_1_multiple_2 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_1_multiple_2 = await hardhatOrderbookMock.orders(
      orderId_1_multiple_2.toString()
    );

    return {
      token1Amt_1_multiple_1,
      token2Amt_1_multiple_1,
      priceRatio_1_multiple_1,
      biggerToken_1_multiple_1,
      sellingToken1_1_multiple_1,
      orderId_1_multiple_1,
      orderDetail_1_multiple_1,
      sender_1_multiple,
      token1Amt_1_multiple_2,
      token2Amt_1_multiple_2,
      priceRatio_1_multiple_2,
      biggerToken_1_multiple_2,
      sellingToken1_1_multiple_2,
      orderId_1_multiple_2,
      orderDetail_1_multiple_2,
    };
  }

  async function makeOrderToken2Big1Fixture() {
    const [sender_21] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
      deployOrderBookFixture
    );
    await hardhatToken2.mintToken(sender_21.address, 1000);
    await hardhatToken2.approve(hardhatOrderbookMock.address, 10);
    const token1Amt_21 = 10;
    const token2Amt_21 = 1;
    const priceRatio_21 = 1000;
    const biggerToken_21 = 1;
    const sellingToken1_21 = 0;

    await hardhatOrderbookMock
      .connect(sender_21)
      .makeOrder(
        token1Amt_21,
        token2Amt_21,
        priceRatio_21,
        biggerToken_21,
        sellingToken1_21
      );

    const orderId_21 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_21 = await hardhatOrderbookMock.orders(
      orderId_21.toString()
    );

    return {
      token1Amt_21,
      token2Amt_21,
      priceRatio_21,
      biggerToken_21,
      sellingToken1_21,
      orderId_21,
      orderDetail_21,
      sender_21,
    };
  }

  async function makeOrderToken1Big2Fixture() {
    const [sender_12] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
      deployOrderBookFixture
    );
    await hardhatToken1.mintToken(sender_12.address, 1000);
    await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    const token1Amt_12 = 10;
    const token2Amt_12 = 1;
    const priceRatio_12 = 1000;
    const biggerToken_12 = 2;
    const sellingToken1_12 = 1;

    await hardhatOrderbookMock
      .connect(sender_12)
      .makeOrder(
        token1Amt_12,
        token2Amt_12,
        priceRatio_12,
        biggerToken_12,
        sellingToken1_12
      );

    const orderId_12 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_12 = await hardhatOrderbookMock.orders(
      orderId_12.toString()
    );

    return {
      token1Amt_12,
      token2Amt_12,
      priceRatio_12,
      biggerToken_12,
      sellingToken1_12,
      orderId_12,
      orderDetail_12,
      sender_12,
    };
  }

  async function makeOrderToken2Multiple() {
    const [sender_2_multiple] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
      deployOrderBookFixture
    );
    await hardhatToken2.mintToken(sender_2_multiple.address, 1000);
    await hardhatToken2.approve(hardhatOrderbookMock.address, 200);

    const token1Amt_2_multiple_1 = 10;
    const token2Amt_2_multiple_1 = 1;
    const priceRatio_2_multiple_1 = 1000;
    const biggerToken_2_multiple_1 = 1;
    const sellingToken1_2_multiple_1 = 0;
    await hardhatOrderbookMock
      .connect(sender_2_multiple)
      .makeOrder(
        token1Amt_2_multiple_1,
        token2Amt_2_multiple_1,
        priceRatio_2_multiple_1,
        biggerToken_2_multiple_1,
        sellingToken1_2_multiple_1
      );
    const orderId_2_multiple_1 = await hardhatOrderbookMock.currentOrderId();
    const orderDetail_2_multiple_1 = await hardhatOrderbookMock.orders(
      orderId_2_multiple_1.toString()
    );

    const token1Amt_2_multiple_2 = 21;
    const token2Amt_2_multiple_2 = 77;
    const priceRatio_2_multiple_2 = 1000;
    const biggerToken_2_multiple_2 = 2;
    const sellingToken1_2_multiple_2 = 0;

    await hardhatOrderbookMock
      .connect(sender_2_multiple)
      .makeOrder(
        token1Amt_2_multiple_2,
        token2Amt_2_multiple_2,
        priceRatio_2_multiple_2,
        biggerToken_2_multiple_2,
        sellingToken1_2_multiple_2
      );

    const orderId_2_multiple_2 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_2_multiple_2 = await hardhatOrderbookMock.orders(
      orderId_2_multiple_2.toString()
    );

    return {
      token1Amt_2_multiple_1,
      token2Amt_2_multiple_1,
      priceRatio_2_multiple_1,
      biggerToken_2_multiple_1,
      sellingToken1_2_multiple_1,
      orderId_2_multiple_1,
      orderDetail_2_multiple_1,
      sender_2_multiple,
      token1Amt_2_multiple_2,
      token2Amt_2_multiple_2,
      priceRatio_2_multiple_2,
      biggerToken_2_multiple_2,
      sellingToken1_2_multiple_2,
      orderId_2_multiple_2,
      orderDetail_2_multiple_2,
    };
  }

  async function makeOrderToken2Big2Fixture() {
    const [sender_22] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
      deployOrderBookFixture
    );
    await hardhatToken2.mintToken(sender_22.address, 1000);
    await hardhatToken2.approve(hardhatOrderbookMock.address, 10);
    const token1Amt_22 = 10;
    const token2Amt_22 = 1;
    const priceRatio_22 = 1000;
    const biggerToken_22 = 2;
    const sellingToken1_22 = 0;

    await hardhatOrderbookMock
      .connect(sender_22)
      .makeOrder(
        token1Amt_22,
        token2Amt_22,
        priceRatio_22,
        biggerToken_22,
        sellingToken1_22
      );

    const orderId_22 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_22 = await hardhatOrderbookMock.orders(
      orderId_22.toString()
    );

    return {
      token1Amt_22,
      token2Amt_22,
      priceRatio_22,
      biggerToken_22,
      sellingToken1_22,
      orderId_22,
      orderDetail_22,
      sender_22,
    };
  }

  async function makeOrderToken12Multiple() {
    const [sender_1_2_multiple] = await ethers.getSigners();
    const { hardhatOrderbookMock, hardhatToken2, hardhatToken1 } =
      await loadFixture(deployOrderBookFixture);
    await hardhatToken1.mintToken(sender_1_2_multiple.address, 1000);
    await hardhatToken1.approve(hardhatOrderbookMock.address, 200);
    await hardhatToken2.mintToken(sender_1_2_multiple.address, 1000);
    await hardhatToken2.approve(hardhatOrderbookMock.address, 200);

    const token1Amt_1_2_multiple_1 = 10;
    const token2Amt_1_2_multiple_1 = 1;
    const priceRatio_1_2_multiple_1 = 1000;
    const biggerToken_1_2_multiple_1 = 1;
    const sellingToken1_1_2_multiple_1 = 1;
    await hardhatOrderbookMock
      .connect(sender_1_2_multiple)
      .makeOrder(
        token1Amt_1_2_multiple_1,
        token2Amt_1_2_multiple_1,
        priceRatio_1_2_multiple_1,
        biggerToken_1_2_multiple_1,
        sellingToken1_1_2_multiple_1
      );
    const orderId_1_2_multiple_1 = await hardhatOrderbookMock.currentOrderId();
    const orderDetail_1_2_multiple_1 = await hardhatOrderbookMock.orders(
      orderId_1_2_multiple_1.toString()
    );

    const token1Amt_1_2_multiple_2 = 21;
    const token2Amt_1_2_multiple_2 = 77;
    const priceRatio_1_2_multiple_2 = 1000;
    const biggerToken_1_2_multiple_2 = 2;
    const sellingToken1_1_2_multiple_2 = 0;

    await hardhatOrderbookMock
      .connect(sender_1_2_multiple)
      .makeOrder(
        token1Amt_1_2_multiple_2,
        token2Amt_1_2_multiple_2,
        priceRatio_1_2_multiple_2,
        biggerToken_1_2_multiple_2,
        sellingToken1_1_2_multiple_2
      );

    const orderId_1_2_multiple_2 = await hardhatOrderbookMock.currentOrderId();

    const orderDetail_1_2_multiple_2 = await hardhatOrderbookMock.orders(
      orderId_1_2_multiple_2.toString()
    );

    return {
      token1Amt_1_2_multiple_1,
      token2Amt_1_2_multiple_1,
      priceRatio_1_2_multiple_1,
      biggerToken_1_2_multiple_1,
      sellingToken1_1_2_multiple_1,
      orderId_1_2_multiple_1,
      orderDetail_1_2_multiple_1,
      sender_1_2_multiple,
      token1Amt_1_2_multiple_2,
      token2Amt_1_2_multiple_2,
      priceRatio_1_2_multiple_2,
      biggerToken_1_2_multiple_2,
      sellingToken1_1_2_multiple_2,
      orderId_1_2_multiple_2,
      orderDetail_1_2_multiple_2,
    };
  }

  async function buyOrderToken1Fixture() {
    const {
      hardhatOrderbookMock,
      hardhatToken1,
      hardhatToken2,
      owner,
      nonOwner,
      takerFee,
      makerFee,
    } = await loadFixture(deployOrderBookFixture);

    const buyingTokenAmt = 25000;
    const sellingTokenAmt = 36000;

    const quantity = 14500;

    await hardhatToken1.mintToken(owner.address, 100_000);
    await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
    await hardhatToken2.mintToken(owner.address, 100_000);
    await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
    await hardhatToken1.mintToken(nonOwner.address, 100_000);
    await hardhatToken1
      .connect(nonOwner)
      .approve(hardhatOrderbookMock.address, 75_0000);
    await hardhatToken2.mintToken(nonOwner.address, 100_000);
    await hardhatToken2
      .connect(nonOwner)
      .approve(hardhatOrderbookMock.address, 75_0000);

    await hardhatOrderbookMock
      .connect(owner)
      .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);

    const orderId = await hardhatOrderbookMock.currentOrderId();
    const orderDetails = await hardhatOrderbookMock.orders(orderId.toString());

    const cost = parseInt((buyingTokenAmt * quantity) / sellingTokenAmt);
    const _takerFee = parseInt((cost * takerFee) / 10_000);
    const _makerFee = parseInt((cost * makerFee) / 10_000);

    return {
      hardhatOrderbookMock,
      orderId,
      nonOwner,
      quantity,
      cost,
      sellingTokenAmt,
      buyingTokenAmt,
      orderDetails,
      hardhatToken1,
      hardhatToken2,
      _makerFee,
      _takerFee,
    };
  }

  // describe('On Contract Deployment', function () {
  //   it('should assign correct ERC20 instance as token1', async function () {
  //     const { hardhatOrderBook, hardhatToken1 } = await loadFixture(
  //       deployOrderBookFixture
  //     );
  //     expect(await hardhatOrderBook.token1()).to.equal(hardhatToken1.address);
  //   });
  //   it('should assign correct ERC20 instance as token2', async function () {
  //     const { hardhatOrderBook, hardhatToken2 } = await loadFixture(
  //       deployOrderBookFixture
  //     );
  //     expect(await hardhatOrderBook.token2()).to.equal(hardhatToken2.address);
  //   });
  //   it('should assign correct feeAddr', async function () {
  //     const { hardhatOrderBook, feeAddr } = await loadFixture(
  //       deployOrderBookFixture
  //     );
  //     expect(await hardhatOrderBook.feeAddr()).to.equal(feeAddr);
  //   });
  //   it('should assign correct takerFee', async function () {
  //     const { hardhatOrderBook, takerFee } = await loadFixture(
  //       deployOrderBookFixture
  //     );
  //     expect(await hardhatOrderBook.takerFee()).to.equal(takerFee);
  //   });
  //   it('should assign correct makerFee', async function () {
  //     const { hardhatOrderBook, makerFee } = await loadFixture(
  //       deployOrderBookFixture
  //     );
  //     expect(await hardhatOrderBook.makerFee()).to.equal(makerFee);
  //   });
  // });

  describe('On Contract Execution', function () {
    // describe('Get Taker Fee --- getTakerFee()', function () {
    //   it('should return the expected taker fee value (initial)', async function () {
    //     const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
    //     const actualTakerFee = await hardhatOrderBook.getTakerFee();
    //     expect(actualTakerFee).to.equal(100);
    //   });
    //   it('should return the expected taker fee value (after updated)', async function () {
    //     const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
    //     const expectedTakerFee = 500;
    //     await hardhatOrderBook.setTakerFee(expectedTakerFee);
    //     const actualTakerFee = await hardhatOrderBook.getTakerFee();
    //     expect(actualTakerFee).to.equal(expectedTakerFee);
    //   });
    //   it('should be callable by an external account without modifying the state', async function () {
    //     const { hardhatOrderBook, nonOwner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const actualTakerFee = await hardhatOrderBook
    //       .connect(nonOwner)
    //       .getTakerFee();
    //     expect(actualTakerFee).to.equal(100);
    //     const currentTakerFee = await hardhatOrderBook.getTakerFee();
    //     expect(currentTakerFee).to.equal(100);
    //   });
    // });

    // describe('Set Taker Fee --- setTakerFee()', function () {
    //   it('should revert when called by a non-owner account', async function () {
    //     const { hardhatOrderBook, nonOwner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(hardhatOrderBook.connect(nonOwner).setTakerFee(1000)).to.be
    //       .reverted;
    //   });
    //   it("should not revert when called by the contract owner's account", async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(hardhatOrderBook.connect(owner).setTakerFee(2000)).to.not
    //       .be.reverted;
    //   });
    //   it('should revert with a correct custom error "InvalidFeeValue" when fee set to > 50%', async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(
    //       hardhatOrderBook.connect(owner).setTakerFee(6000)
    //     ).to.be.revertedWithCustomError(hardhatOrderBook, 'InvalidFeeValue');
    //   });
    //   it('should not revert when fee set to < 50%', async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(hardhatOrderBook.connect(owner).setTakerFee(4900)).to.be
    //       .not.reverted;
    //   });
    //   it('should update takerFee when correct (in-range) value provided', async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatOrderBook.connect(owner).setTakerFee(4900);
    //     expect(await hardhatOrderBook.connect(owner).getTakerFee()).to.be.equal(
    //       4900
    //     );
    //   });
    // });

    // describe('Get Maker Fee --- getMakerFee()', function () {
    //   it('should return the expected maker fee value (initial)', async function () {
    //     const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
    //     const actualMakerFee = await hardhatOrderBook.getMakerFee();
    //     expect(actualMakerFee).to.equal(50);
    //   });
    //   it('should return the expected maker fee value (after updated)', async function () {
    //     const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
    //     const expectedMakerFee = 500;
    //     await hardhatOrderBook.setMakerFee(expectedMakerFee);
    //     const actualMakerFee = await hardhatOrderBook.getMakerFee();
    //     expect(actualMakerFee).to.equal(expectedMakerFee);
    //   });
    //   it('should be callable by an external account without modifying the state', async function () {
    //     const { hardhatOrderBook, nonOwner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const actualMakerFee = await hardhatOrderBook
    //       .connect(nonOwner)
    //       .getMakerFee();
    //     expect(actualMakerFee).to.equal(50);
    //     const currentMakerFee = await hardhatOrderBook.getMakerFee();
    //     expect(currentMakerFee).to.equal(50);
    //   });
    // });

    // describe('Set Maker Fee --- setMakerFee()', function () {
    //   it('should revert when called by a non-owner account', async function () {
    //     const { hardhatOrderBook, nonOwner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(hardhatOrderBook.connect(nonOwner).setMakerFee(1000)).to.be
    //       .reverted;
    //   });
    //   it("should not revert when called by the contract owner's account", async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(hardhatOrderBook.connect(owner).setMakerFee(2000)).to.not
    //       .be.reverted;
    //   });
    //   it('should revert with a correct custom error "InvalidFeeValue" when fee set to > 50%', async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(
    //       hardhatOrderBook.connect(owner).setMakerFee(6000)
    //     ).to.be.revertedWithCustomError(hardhatOrderBook, 'InvalidFeeValue');
    //   });
    //   it('should not revert when fee set to < 50%', async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(hardhatOrderBook.connect(owner).setMakerFee(4900)).to.be
    //       .not.reverted;
    //   });
    //   it('should update makerFee when correct (in-range) value provided', async function () {
    //     const { hardhatOrderBook, owner } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatOrderBook.connect(owner).setMakerFee(4900);
    //     expect(await hardhatOrderBook.connect(owner).getMakerFee()).to.be.equal(
    //       4900
    //     );
    //   });
    // });

    // describe('Get Token Pair --- getTokenPair()', function () {
    //   it('should return the correct token pair', async function () {
    //     const { hardhatOrderBook, hardhatToken1, hardhatToken2 } =
    //       await loadFixture(deployOrderBookFixture);
    //     const [token1, token2] = await hardhatOrderBook.getTokenPair();
    //     expect(token1).to.equal(hardhatToken1.address);
    //     expect(token2).to.equal(hardhatToken2.address);
    //   });
    //   it('should be callable by an external account without modifying the state', async function () {
    //     const { hardhatOrderBook, hardhatToken1, hardhatToken2, nonOwner } =
    //       await loadFixture(deployOrderBookFixture);
    //     const [token1External, token2External] = await hardhatOrderBook
    //       .connect(nonOwner)
    //       .getTokenPair();
    //     expect(token1External).to.equal(hardhatToken1.address);
    //     expect(token2External).to.equal(hardhatToken2.address);
    //     const [token1, token2] = await hardhatOrderBook.getTokenPair();
    //     expect(token1).to.equal(hardhatToken1.address);
    //     expect(token2).to.equal(hardhatToken2.address);
    //   });
    // });

    // describe('View offers --- viewOffer()', function () {
    //   it('should revert with custom error "InactiveOrder" when no active order with given id', async function () {
    //     const { hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(
    //       hardhatOrderbookMock.viewOffer('100')
    //     ).to.be.revertedWithCustomError(hardhatOrderbookMock, 'InactiveOrder');
    //   });
    //   it('should not revert when order is active', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     const orderDetail = await hardhatOrderbookMock.activeOrders(
    //       orderId.toString()
    //     );
    //     await expect(hardhatOrderbookMock.viewOffer(orderId.toString())).to.not
    //       .be.reverted;
    //   });
    //   it('should return offer details', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     const orderDetail = await hardhatOrderbookMock.orders(
    //       orderId.toString()
    //     );
    //     const [amt1, amt2, addr, selling] =
    //       await hardhatOrderbookMock.viewOffer(orderId.toString());
    //     expect(amt1, amt2, addr, selling).to.equal(
    //       orderDetail.sellingTokenAmt,
    //       orderDetail.buyingTokenAmt,
    //       orderDetail.owner,
    //       orderDetail.sellingToken1
    //     );
    //   });
    // });

    // describe('Maker Order --- _make()', function () {
    //   it('should revert with a correct custom error "InvalidFeeValue" when sellingToken1 > 1', async function () {
    //     const { hardhatOrderBook, hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const { token1Amt_11, token2Amt_11, priceRatio_11, biggerToken_11 } =
    //       await loadFixture(makeOrderToken1Big1Fixture);
    //     const sellingToken1 = 2;
    //     await expect(
    //       hardhatOrderbookMock.makeOrder(
    //         token1Amt_11,
    //         token2Amt_11,
    //         priceRatio_11,
    //         biggerToken_11,
    //         sellingToken1
    //       )
    //     ).to.be.revertedWithCustomError(
    //       hardhatOrderBook,
    //       'SellingTokenNotBool'
    //     );
    //   });
    //   it('should not revert when sellingToken1 is 0 or 1', async function () {
    //     const {
    //       sender_11,
    //       token1Amt_11,
    //       token2Amt_11,
    //       priceRatio_11,
    //       biggerToken_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
    //       await loadFixture(deployOrderBookFixture);
    //     await hardhatToken2.mintToken(sender_11.address, 1000);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 200);
    //     await hardhatToken1.mintToken(sender_11.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 200);
    //     const sellingToken1_11 = 1;
    //     const sellingToken1_21 = 0;
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_11)
    //         .makeOrder(
    //           token1Amt_11,
    //           token2Amt_11,
    //           priceRatio_11,
    //           biggerToken_11,
    //           sellingToken1_21
    //         )
    //     ).to.not.be.reverted;
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_11)
    //         .makeOrder(
    //           token1Amt_11,
    //           token2Amt_11,
    //           priceRatio_11,
    //           biggerToken_11,
    //           sellingToken1_11
    //         )
    //     ).to.not.be.reverted;
    //   });
    //   it('should revert with a correct custom error "ZeroTokenAmount" when token1Amt == 0', async function () {
    //     const { hardhatOrderBook, hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const {
    //       token2Amt_11,
    //       priceRatio_11,
    //       biggerToken_11,
    //       sellingToken1_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     const token1Amt = 0;
    //     await expect(
    //       hardhatOrderbookMock.makeOrder(
    //         token1Amt,
    //         token2Amt_11,
    //         priceRatio_11,
    //         biggerToken_11,
    //         sellingToken1_11
    //       )
    //     ).to.be.revertedWithCustomError(hardhatOrderBook, 'ZeroTokenAmount');
    //   });
    //   it('should revert with a correct custom error "ZeroTokenAmount" when token2Amt == 0', async function () {
    //     const { hardhatOrderBook, hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const {
    //       token1Amt_11,
    //       priceRatio_11,
    //       biggerToken_11,
    //       sellingToken1_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     const token2Amt = 0;
    //     await expect(
    //       hardhatOrderbookMock.makeOrder(
    //         token1Amt_11,
    //         token2Amt,
    //         priceRatio_11,
    //         biggerToken_11,
    //         sellingToken1_11
    //       )
    //     ).to.be.revertedWithCustomError(hardhatOrderBook, 'ZeroTokenAmount');
    //   });
    //   it('should not revert when both token1Amt, token2Amt are not 0', async function () {
    //     const {
    //       sender_11,
    //       token1Amt_11,
    //       token2Amt_11,
    //       priceRatio_11,
    //       biggerToken_11,
    //       sellingToken1_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(sender_11.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_11)
    //         .makeOrder(
    //           token1Amt_11,
    //           token2Amt_11,
    //           priceRatio_11,
    //           biggerToken_11,
    //           sellingToken1_11
    //         )
    //     ).to.not.be.reverted;
    //   });
    //   it('should revert when sellingToken1 is true and transferFrom fails', async function () {
    //     const {
    //       sender_11,
    //       token2Amt_11,
    //       priceRatio_11,
    //       biggerToken_11,
    //       sellingToken1_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(sender_11.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     // Call the _make function with sellingToken1 = 1
    //     const token1Amt = 20;
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_11)
    //         .makeOrder(
    //           token1Amt,
    //           token2Amt_11,
    //           priceRatio_11,
    //           biggerToken_11,
    //           sellingToken1_11
    //         )
    //     ).to.be.reverted;
    //   });
    //   it('should not revert when sellingToken1 is true and transferFrom do not fails', async function () {
    //     const {
    //       sender_11,
    //       token1Amt_11,
    //       token2Amt_11,
    //       priceRatio_11,
    //       biggerToken_11,
    //       sellingToken1_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(sender_11.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_11)
    //         .makeOrder(
    //           token1Amt_11,
    //           token2Amt_11,
    //           priceRatio_11,
    //           biggerToken_11,
    //           sellingToken1_11
    //         )
    //     ).to.not.be.reverted;
    //   });
    //   it('should revert when sellingToken1 is false and transferFrom fails', async function () {
    //     const {
    //       sender_21,
    //       token1Amt_21,
    //       priceRatio_21,
    //       biggerToken_21,
    //       sellingToken1_21,
    //     } = await loadFixture(makeOrderToken2Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const token2Amt = 20;
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_21)
    //         .makeOrder(
    //           token1Amt_21,
    //           token2Amt,
    //           priceRatio_21,
    //           biggerToken_21,
    //           sellingToken1_21
    //         )
    //     ).to.be.reverted;
    //   });
    //   it('should not revert when sellingToken1 is false and transferFrom do not fails', async function () {
    //     const {
    //       sender_21,
    //       token1Amt_21,
    //       token2Amt_21,
    //       priceRatio_21,
    //       biggerToken_21,
    //       sellingToken1_21,
    //     } = await loadFixture(makeOrderToken2Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken2.mintToken(sender_21.address, 1000);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 10);
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_21)
    //         .makeOrder(
    //           token1Amt_21,
    //           token2Amt_21,
    //           priceRatio_21,
    //           biggerToken_21,
    //           sellingToken1_21
    //         )
    //     ).to.not.be.reverted;
    //   });
    //   it('should assign correct orderId when sellingToken1 is true', async function () {
    //     const { orderId_11 } = await loadFixture(makeOrderToken1Big1Fixture);
    //     expect(orderId_11.toString()).to.equal('2');
    //   });
    //   it('should assign correct orderId when sellingToken1 is false', async function () {
    //     const { orderId_21 } = await loadFixture(makeOrderToken2Big1Fixture);
    //     expect(orderId_21.toString()).to.equal('2');
    //   });
    //   it('should assign correct orderDetails when sellingToken1 is true', async function () {
    //     const {
    //       orderDetail_11,
    //       token1Amt_11,
    //       token2Amt_11,
    //       sender_11,
    //       sellingToken1_11,
    //       biggerToken_11,
    //       priceRatio_11,
    //     } = await loadFixture(makeOrderToken1Big1Fixture);
    //     expect(orderDetail_11.sellingTokenAmt.toString()).to.equal(
    //       token1Amt_11.toString()
    //     );
    //     expect(orderDetail_11.buyingTokenAmt.toString()).to.equal(
    //       token2Amt_11.toString()
    //     );
    //     expect(orderDetail_11.owner).to.equal(sender_11.address);
    //     expect(orderDetail_11.sellingToken1).to.equal(sellingToken1_11);
    //     expect(orderDetail_11.biggerToken).to.equal(biggerToken_11);
    //     expect(orderDetail_11.priceRatio).to.equal(priceRatio_11);
    //   });
    //   it('should assign correct orderDetails when sellingToken1 is true (Multiple Orders)', async function () {
    //     const {
    //       token1Amt_1_multiple_1,
    //       token2Amt_1_multiple_1,
    //       priceRatio_1_multiple_1,
    //       biggerToken_1_multiple_1,
    //       sellingToken1_1_multiple_1,
    //       orderDetail_1_multiple_1,
    //       sender_1_multiple,
    //       token1Amt_1_multiple_2,
    //       token2Amt_1_multiple_2,
    //       priceRatio_1_multiple_2,
    //       biggerToken_1_multiple_2,
    //       sellingToken1_1_multiple_2,
    //       orderDetail_1_multiple_2,
    //     } = await loadFixture(makeOrderToken1Multiple);
    //     expect(orderDetail_1_multiple_1.sellingTokenAmt.toString()).to.equal(
    //       token1Amt_1_multiple_1.toString()
    //     );
    //     expect(orderDetail_1_multiple_1.buyingTokenAmt.toString()).to.equal(
    //       token2Amt_1_multiple_1.toString()
    //     );
    //     expect(orderDetail_1_multiple_1.owner).to.equal(
    //       sender_1_multiple.address
    //     );
    //     expect(orderDetail_1_multiple_1.sellingToken1).to.equal(
    //       sellingToken1_1_multiple_1
    //     );
    //     expect(orderDetail_1_multiple_1.biggerToken).to.equal(
    //       biggerToken_1_multiple_1
    //     );
    //     expect(orderDetail_1_multiple_1.priceRatio).to.equal(
    //       priceRatio_1_multiple_1
    //     );
    //     expect(orderDetail_1_multiple_2.sellingTokenAmt.toString()).to.equal(
    //       token1Amt_1_multiple_2.toString()
    //     );
    //     expect(orderDetail_1_multiple_2.buyingTokenAmt.toString()).to.equal(
    //       token2Amt_1_multiple_2.toString()
    //     );
    //     expect(orderDetail_1_multiple_2.owner).to.equal(
    //       sender_1_multiple.address
    //     );
    //     expect(orderDetail_1_multiple_2.sellingToken1).to.equal(
    //       sellingToken1_1_multiple_2
    //     );
    //     expect(orderDetail_1_multiple_2.biggerToken).to.equal(
    //       biggerToken_1_multiple_2
    //     );
    //     expect(orderDetail_1_multiple_2.priceRatio).to.equal(
    //       priceRatio_1_multiple_2
    //     );
    //   });
    //   it('should assign correct orderDetails when sellingToken1 is false', async function () {
    //     const {
    //       orderDetail_21,
    //       token1Amt_21,
    //       token2Amt_21,
    //       sender_21,
    //       sellingToken1_21,
    //       biggerToken_21,
    //       priceRatio_21,
    //     } = await loadFixture(makeOrderToken2Big1Fixture);
    //     expect(orderDetail_21.sellingTokenAmt.toString()).to.equal(
    //       token2Amt_21.toString()
    //     );
    //     expect(orderDetail_21.buyingTokenAmt.toString()).to.equal(
    //       token1Amt_21.toString()
    //     );
    //     expect(orderDetail_21.owner).to.equal(sender_21.address);
    //     expect(orderDetail_21.sellingToken1).to.equal(sellingToken1_21);
    //     expect(orderDetail_21.biggerToken).to.equal(biggerToken_21);
    //     expect(orderDetail_21.priceRatio).to.equal(priceRatio_21);
    //   });
    //   it('should assign correct orderDetails when sellingToken1 is false (Multiple Orders)', async function () {
    //     const {
    //       token1Amt_2_multiple_1,
    //       token2Amt_2_multiple_1,
    //       priceRatio_2_multiple_1,
    //       biggerToken_2_multiple_1,
    //       sellingToken1_2_multiple_1,
    //       orderDetail_2_multiple_1,
    //       sender_2_multiple,
    //       token1Amt_2_multiple_2,
    //       token2Amt_2_multiple_2,
    //       priceRatio_2_multiple_2,
    //       biggerToken_2_multiple_2,
    //       sellingToken1_2_multiple_2,
    //       orderDetail_2_multiple_2,
    //     } = await loadFixture(makeOrderToken2Multiple);
    //     expect(orderDetail_2_multiple_1.sellingTokenAmt.toString()).to.equal(
    //       token2Amt_2_multiple_1.toString()
    //     );
    //     expect(orderDetail_2_multiple_1.buyingTokenAmt.toString()).to.equal(
    //       token1Amt_2_multiple_1.toString()
    //     );
    //     expect(orderDetail_2_multiple_1.owner).to.equal(
    //       sender_2_multiple.address
    //     );
    //     expect(orderDetail_2_multiple_1.sellingToken1).to.equal(
    //       sellingToken1_2_multiple_1
    //     );
    //     expect(orderDetail_2_multiple_1.biggerToken).to.equal(
    //       biggerToken_2_multiple_1
    //     );
    //     expect(orderDetail_2_multiple_1.priceRatio).to.equal(
    //       priceRatio_2_multiple_1
    //     );
    //     expect(orderDetail_2_multiple_2.sellingTokenAmt.toString()).to.equal(
    //       token2Amt_2_multiple_2.toString()
    //     );
    //     expect(orderDetail_2_multiple_2.buyingTokenAmt.toString()).to.equal(
    //       token1Amt_2_multiple_2.toString()
    //     );
    //     expect(orderDetail_2_multiple_2.owner).to.equal(
    //       sender_2_multiple.address
    //     );
    //     expect(orderDetail_2_multiple_2.sellingToken1).to.equal(
    //       sellingToken1_2_multiple_2
    //     );
    //     expect(orderDetail_2_multiple_2.biggerToken).to.equal(
    //       biggerToken_2_multiple_2
    //     );
    //     expect(orderDetail_2_multiple_2.priceRatio).to.equal(
    //       priceRatio_2_multiple_2
    //     );
    //   });
    //   it('should assign correct orderDetails when sellingToken1 is true or false (Both Cases)', async function () {
    //     const {
    //       token1Amt_1_2_multiple_1,
    //       token2Amt_1_2_multiple_1,
    //       priceRatio_1_2_multiple_1,
    //       biggerToken_1_2_multiple_1,
    //       sellingToken1_1_2_multiple_1,
    //       orderDetail_1_2_multiple_1,
    //       sender_1_2_multiple,
    //       token1Amt_1_2_multiple_2,
    //       token2Amt_1_2_multiple_2,
    //       priceRatio_1_2_multiple_2,
    //       biggerToken_1_2_multiple_2,
    //       sellingToken1_1_2_multiple_2,
    //       orderDetail_1_2_multiple_2,
    //     } = await loadFixture(makeOrderToken12Multiple);
    //     expect(orderDetail_1_2_multiple_1.sellingTokenAmt.toString()).to.equal(
    //       token1Amt_1_2_multiple_1.toString()
    //     );
    //     expect(orderDetail_1_2_multiple_1.buyingTokenAmt.toString()).to.equal(
    //       token2Amt_1_2_multiple_1.toString()
    //     );
    //     expect(orderDetail_1_2_multiple_1.owner).to.equal(
    //       sender_1_2_multiple.address
    //     );
    //     expect(orderDetail_1_2_multiple_1.sellingToken1).to.equal(
    //       sellingToken1_1_2_multiple_1
    //     );
    //     expect(orderDetail_1_2_multiple_1.biggerToken).to.equal(
    //       biggerToken_1_2_multiple_1
    //     );
    //     expect(orderDetail_1_2_multiple_1.priceRatio).to.equal(
    //       priceRatio_1_2_multiple_1
    //     );
    //     expect(orderDetail_1_2_multiple_2.sellingTokenAmt.toString()).to.equal(
    //       token2Amt_1_2_multiple_2.toString()
    //     );
    //     expect(orderDetail_1_2_multiple_2.buyingTokenAmt.toString()).to.equal(
    //       token1Amt_1_2_multiple_2.toString()
    //     );
    //     expect(orderDetail_1_2_multiple_2.owner).to.equal(
    //       sender_1_2_multiple.address
    //     );
    //     expect(orderDetail_1_2_multiple_2.sellingToken1).to.equal(
    //       sellingToken1_1_2_multiple_2
    //     );
    //     expect(orderDetail_1_2_multiple_2.biggerToken).to.equal(
    //       biggerToken_1_2_multiple_2
    //     );
    //     expect(orderDetail_1_2_multiple_2.priceRatio).to.equal(
    //       priceRatio_1_2_multiple_2
    //     );
    //   });
    //   it('should assign current order as active order', async function () {
    //     const { hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const { orderId_21 } = await loadFixture(makeOrderToken2Big1Fixture);
    //     const orderAciveDetail = await hardhatOrderbookMock.activeOrders(
    //       orderId_21.toString()
    //     );
    //     expect(orderAciveDetail.toString()).to.equal('1');
    //   });
    //   it('should assign current order as active order (multiple orders)', async function () {
    //     const { hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     const { orderId_1_2_multiple_1, orderId_1_2_multiple_2 } =
    //       await loadFixture(makeOrderToken12Multiple);
    //     const orderAciveDetail_11 = await hardhatOrderbookMock.activeOrders(
    //       orderId_1_2_multiple_1.toString()
    //     );
    //     expect(orderAciveDetail_11.toString()).to.equal('1');
    //     const orderAciveDetail = await hardhatOrderbookMock.activeOrders(
    //       orderId_1_2_multiple_2.toString()
    //     );
    //     expect(orderAciveDetail.toString()).to.equal('1');
    //   });
    //   it('should emit OfferCreate event', async function () {
    //     const {
    //       sender_21,
    //       token1Amt_21,
    //       token2Amt_21,
    //       priceRatio_21,
    //       biggerToken_21,
    //       sellingToken1_21,
    //     } = await loadFixture(makeOrderToken2Big1Fixture);
    //     const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
    //       await loadFixture(deployOrderBookFixture);
    //     await hardhatToken2.mintToken(sender_21.address, 1000);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 10);
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_21)
    //         .makeOrder(
    //           token1Amt_21,
    //           token2Amt_21,
    //           priceRatio_21,
    //           biggerToken_21,
    //           sellingToken1_21
    //         )
    //     )
    //       .to.emit(hardhatOrderbookMock, 'OfferCreate')
    //       .withArgs(
    //         hardhatToken1.address,
    //         hardhatToken2.address,
    //         sellingToken1_21,
    //         token1Amt_21,
    //         token2Amt_21,
    //         2,
    //         sender_21.address
    //       );
    //   });
    //   it('should emit OfferCreate event (multiple orders)', async function () {
    //     const {
    //       sender_1_2_multiple,
    //       token1Amt_1_2_multiple_1,
    //       token2Amt_1_2_multiple_1,
    //       priceRatio_1_2_multiple_1,
    //       biggerToken_1_2_multiple_1,
    //       sellingToken1_1_2_multiple_1,
    //       token1Amt_1_2_multiple_2,
    //       token2Amt_1_2_multiple_2,
    //       priceRatio_1_2_multiple_2,
    //       biggerToken_1_2_multiple_2,
    //       sellingToken1_1_2_multiple_2,
    //     } = await loadFixture(makeOrderToken12Multiple);
    //     const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
    //       await loadFixture(deployOrderBookFixture);
    //     await hardhatToken1.mintToken(sender_1_2_multiple.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 750);
    //     await hardhatToken2.mintToken(sender_1_2_multiple.address, 1000);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 750);
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_1_2_multiple)
    //         .makeOrder(
    //           token1Amt_1_2_multiple_1,
    //           token2Amt_1_2_multiple_1,
    //           priceRatio_1_2_multiple_1,
    //           biggerToken_1_2_multiple_1,
    //           sellingToken1_1_2_multiple_1
    //         )
    //     )
    //       .to.emit(hardhatOrderbookMock, 'OfferCreate')
    //       .withArgs(
    //         hardhatToken1.address,
    //         hardhatToken2.address,
    //         sellingToken1_1_2_multiple_1,
    //         token1Amt_1_2_multiple_1,
    //         token2Amt_1_2_multiple_1,
    //         2,
    //         sender_1_2_multiple.address
    //       );
    //     await expect(
    //       hardhatOrderbookMock
    //         .connect(sender_1_2_multiple)
    //         .makeOrder(
    //           token1Amt_1_2_multiple_2,
    //           token2Amt_1_2_multiple_2,
    //           priceRatio_1_2_multiple_2,
    //           biggerToken_1_2_multiple_2,
    //           sellingToken1_1_2_multiple_2
    //         )
    //     )
    //       .to.emit(hardhatOrderbookMock, 'OfferCreate')
    //       .withArgs(
    //         hardhatToken1.address,
    //         hardhatToken2.address,
    //         sellingToken1_1_2_multiple_2,
    //         token1Amt_1_2_multiple_2,
    //         token2Amt_1_2_multiple_2,
    //         3,
    //         sender_1_2_multiple.address
    //       );
    //   });
    // });

    // describe('Cancel Order --- _cancel()', function () {
    //   it('should revert with custom error "InactiveOrder" when no active order with given id', async function () {
    //     const { hardhatOrderbookMock } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await expect(
    //       hardhatOrderbookMock.cancelOrder('100')
    //     ).to.be.revertedWithCustomError(hardhatOrderbookMock, 'InactiveOrder');
    //   });
    //   it('should not revert when order is active', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     const orderDetail = await hardhatOrderbookMock.activeOrders(
    //       orderId.toString()
    //     );
    //     await expect(hardhatOrderbookMock.cancelOrder(orderId.toString())).to
    //       .not.be.reverted;
    //   });
    //   it('should revert with custom error "NonOwnerCantCancelOrder" when called by non-woner', async function () {
    //     const [owner, nonOwner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     const orderDetail = await hardhatOrderbookMock.activeOrders(
    //       orderId.toString()
    //     );
    //     await expect(
    //       hardhatOrderbookMock.connect(nonOwner).cancelOrder(orderId.toString())
    //     ).to.be.revertedWithCustomError(
    //       hardhatOrderbookMock,
    //       'NonOwnerCantCancelOrder'
    //     );
    //   });
    //   it('should not revert when called by owoner', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     const orderDetail = await hardhatOrderbookMock.activeOrders(
    //       orderId.toString()
    //     );
    //     await expect(
    //       hardhatOrderbookMock.connect(owner).cancelOrder(orderId.toString())
    //     ).to.not.be.reverted;
    //   });
    //   it('should select correct sellingToken1 when token1 is selling value, (1)', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .cancelOrder(orderId.toString());
    //     expect(
    //       (await hardhatOrderbookMock.selectedToken()).toString()
    //     ).to.equal('1');
    //   });
    //   it('should select correct sellingToken1 when token1 is selling value, (0)', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken2.mintToken(owner.address, 1000);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 10);
    //     await hardhatOrderbookMock.connect(owner).makeOrder(10, 1, 1000, 1, 0);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .cancelOrder(orderId.toString());
    //     expect(
    //       (await hardhatOrderbookMock.selectedToken()).toString()
    //     ).to.equal('0');
    //   });
    //   it('should select the correct escrowed token when token for sell is 1 and deposit tokens in owner account', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken1.mintToken(owner.address, 1000);
    //     await hardhatToken1.approve(hardhatOrderbookMock.address, 100);
    //     const sellingToken1 = 1;
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .makeOrder(25, 1, 1000, 1, sellingToken1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .cancelOrder(orderId.toString());
    //     const balance = await hardhatToken1.balanceOf(owner.address);
    //     expect(balance).to.equal(1000);
    //   });
    //   it('should select the correct escrowed token when token for sell is 2 and deposit tokens in owner account', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken2.mintToken(owner.address, 275);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 100);
    //     const sellingToken1 = 0;
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .makeOrder(10, 17, 1000, 1, sellingToken1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .cancelOrder(orderId.toString());
    //     const balance = await hardhatToken2.balanceOf(owner.address);
    //     expect(balance).to.equal(275);
    //   });
    //   it('should delete order from "orders" when successful', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken2.mintToken(owner.address, 275);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 100);
    //     const sellingToken1 = 0;
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .makeOrder(10, 17, 1000, 1, sellingToken1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .cancelOrder(orderId.toString());
    //     const orderDetails = await hardhatOrderbookMock.orders(
    //       orderId.toString()
    //     );
    //     expect(orderDetails.sellingTokenAmt.toString()).to.equal('0');
    //     expect(orderDetails.buyingTokenAmt.toString()).to.equal('0');
    //     expect(orderDetails.owner).to.equal(
    //       '0x0000000000000000000000000000000000000000'
    //     );
    //     expect(orderDetails.sellingToken1).to.equal(0);
    //     expect(orderDetails.biggerToken).to.equal(0);
    //     expect(orderDetails.priceRatio).to.equal(0);
    //   });
    //   it('should change status to 0 in activeorders mapping', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken2 } = await loadFixture(
    //       deployOrderBookFixture
    //     );
    //     await hardhatToken2.mintToken(owner.address, 275);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 100);
    //     const sellingToken1 = 0;
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .makeOrder(10, 17, 1000, 1, sellingToken1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .cancelOrder(orderId.toString());
    //     expect(
    //       await hardhatOrderbookMock.activeOrders(orderId.toString())
    //     ).to.equal('0');
    //   });
    //   it('should emit OrderCancelled event', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
    //       await loadFixture(deployOrderBookFixture);
    //     await hardhatToken2.mintToken(owner.address, 275);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 100);
    //     const sellingToken1 = 0;
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .makeOrder(10, 17, 1000, 1, sellingToken1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await expect(
    //       hardhatOrderbookMock.connect(owner).cancelOrder(orderId.toString())
    //     )
    //       .to.emit(hardhatOrderbookMock, 'OrderCancelled')
    //       .withArgs(
    //         orderId.toString(),
    //         owner.address,
    //         hardhatToken1.address,
    //         hardhatToken2.address
    //       );
    //   });
    //   it('should emit DeleteOffer event', async function () {
    //     const [owner] = await ethers.getSigners();
    //     const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
    //       await loadFixture(deployOrderBookFixture);
    //     await hardhatToken2.mintToken(owner.address, 275);
    //     await hardhatToken2.approve(hardhatOrderbookMock.address, 100);
    //     const sellingToken1 = 0;
    //     await hardhatOrderbookMock
    //       .connect(owner)
    //       .makeOrder(10, 17, 1000, 1, sellingToken1);
    //     const orderId = await hardhatOrderbookMock.currentOrderId();
    //     await expect(
    //       hardhatOrderbookMock.connect(owner).cancelOrder(orderId.toString())
    //     )
    //       .to.emit(hardhatOrderbookMock, 'DeleteOffer')
    //       .withArgs(
    //         orderId.toString(),
    //         owner.address,
    //         hardhatToken1.address,
    //         hardhatToken2.address
    //       );
    //   });
    // });

    describe('Buy Order --- _buy()', function () {
      it('should revert with custom error "InactiveOrder" when no active order with given id', async function () {
        const { hardhatOrderbookMock } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(
          hardhatOrderbookMock.buyOrder('100', 100)
        ).to.be.revertedWithCustomError(hardhatOrderbookMock, 'InactiveOrder');
      });

      it('should not revert when order is active', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock.connect(owner).makeOrder(75, 25, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(hardhatOrderbookMock.buyOrder(orderId.toString(), 12)).to
          .not.be.reverted;
      });

      it('should revert with custom error "ZeroBuyQuantity" when quantity to buy is zero', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatToken1.mintToken(owner.address, 1000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 250);
        await hardhatOrderbookMock.connect(owner).makeOrder(75, 25, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(
          hardhatOrderbookMock.buyOrder(orderId.toString(), 0)
        ).to.be.revertedWithCustomError(
          hardhatOrderbookMock,
          'ZeroBuyQuantity'
        );
      });

      it('should not revert when quantity to buy is > 0', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock.connect(owner).makeOrder(75, 25, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(hardhatOrderbookMock.buyOrder(orderId.toString(), 10)).to
          .not.be.reverted;
      });

      it('should select correct order from list based on id', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock.connect(owner).makeOrder(75, 25, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        // If correct order selected should not revert if amount less than amount in order detail
        await expect(hardhatOrderbookMock.buyOrder(orderId.toString(), 10)).to
          .not.be.reverted;
        // If correct order selected should not revert if amount less than amount in order detail
        await expect(hardhatOrderbookMock.buyOrder(orderId.toString(), 100)).to
          .be.reverted;
      });

      it('should revert with custom error "QuantityExceedsOrderAmount" when amount to buy > amount in order', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatToken1.mintToken(owner.address, 1000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 250);
        await hardhatOrderbookMock.connect(owner).makeOrder(75, 25, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        // If correct order selected should not revert if amount less than amount in order detail
        await expect(
          hardhatOrderbookMock.buyOrder(orderId.toString(), 100)
        ).to.be.revertedWithCustomError(
          hardhatOrderbookMock,
          'QuantityExceedsOrderAmount'
        );
      });

      it('should not revert when amount to buy <= amount in order', async function () {
        const [owner] = await ethers.getSigners();
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
        } = await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 10000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 7500);
        await hardhatToken2.mintToken(owner.address, 10000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 7500);

        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(500, 400, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(hardhatOrderbookMock.buyOrder(orderId.toString(), 500)).to
          .not.be.reverted;
      });

      it('should revert when buyer lacks fund for Fee', async function () {
        const [owner, nonOwner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatToken1.mintToken(owner.address, 1000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 750);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(500, 400, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(
          hardhatOrderbookMock
            .connect(nonOwner)
            .buyOrder(orderId.toString(), 150)
        ).to.be.reverted;
      });

      it('should not revert when buyer have funds for Fee', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 1000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 750);
        await hardhatToken2.mintToken(owner.address, 1000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 750);

        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(500, 400, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(
          hardhatOrderbookMock.connect(owner).buyOrder(orderId.toString(), 150)
        ).to.not.be.reverted;
      });

      it('should calculate correct taker and maker fee', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = (buyingTokenAmt * quantity) / sellingTokenAmt;
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance = await hardhatToken2.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken2.balanceOf(owner.address);
        const balanceDiff = initialBalance - finalBalance;
        const correctBalanceDeducted = balanceDiff >= _takerFee + _makerFee;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should select correct buyerPay token when token to sell is token 1', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = (buyingTokenAmt * quantity) / sellingTokenAmt;
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance2 = await hardhatToken2.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance2 = await hardhatToken2.balanceOf(owner.address);
        const balanceDiff2 = initialBalance2 - finalBalance2;
        const correctBalanceDeducted2 = balanceDiff2 >= _takerFee + _makerFee;
        expect(correctBalanceDeducted2).to.be.true;
      });

      it('should select correct buyerPay token when token to sell is token 2', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 0);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = (buyingTokenAmt * quantity) / sellingTokenAmt;
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance1 = await hardhatToken1.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance1 = await hardhatToken1.balanceOf(owner.address);
        const balanceDiff1 = initialBalance1 - finalBalance1;
        const correctBalanceDeducted1 = balanceDiff1 >= _takerFee + _makerFee;
        expect(correctBalanceDeducted1).to.be.true;
      });

      it('should deduct fee from buyer account', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = (buyingTokenAmt * quantity) / sellingTokenAmt;
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance = await hardhatToken2.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken2.balanceOf(owner.address);
        const balanceDiff = initialBalance - finalBalance;
        const correctBalanceDeducted = balanceDiff >= _takerFee + _makerFee;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should revert when buyer lacks fund for transfer', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_000);
        await hardhatToken2.mintToken(owner.address, 1000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 500);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(36000, 25000, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(
          hardhatOrderbookMock
            .connect(owner)
            .buyOrder(orderId.toString(), 14500)
        ).to.be.reverted;
      });

      it('should revert when buyer lacks fund for transfer', async function () {
        const [owner] = await ethers.getSigners();
        const { hardhatOrderbookMock, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 50_000);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(36000, 25000, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await expect(
          hardhatOrderbookMock
            .connect(owner)
            .buyOrder(orderId.toString(), 14500)
        ).to.not.be.reverted;
      });

      it('should calculate correct cost', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
          nonOwner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(nonOwner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = (buyingTokenAmt * quantity) / sellingTokenAmt;
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance = await hardhatToken2.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken2.balanceOf(owner.address);
        const balanceDiff = initialBalance - finalBalance;
        const correctBalanceDeducted = balanceDiff >= cost - _makerFee;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should deduct cost from buyer account', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
          nonOwner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(nonOwner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = parseInt((buyingTokenAmt * quantity) / sellingTokenAmt);
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance = await hardhatToken2.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken2.balanceOf(owner.address);
        const balanceDiff = initialBalance - finalBalance;
        const deductions = cost + _makerFee - _makerFee + _takerFee;
        const correctBalanceDeducted = balanceDiff == deductions;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should deposit cost to seller account', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          takerFee,
          makerFee,
          owner,
          nonOwner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(nonOwner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = parseInt((buyingTokenAmt * quantity) / sellingTokenAmt);
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        const initialBalance = await hardhatToken2.balanceOf(nonOwner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken2.balanceOf(nonOwner.address);
        const balanceDiff = initialBalance - finalBalance;
        const deposit = cost - _makerFee;
        const correctBalanceDeducted = balanceDiff == -deposit;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should deposit correct recieve-able amount (Token 01) to buyer account', async function () {
        const {
          hardhatToken1,
          hardhatOrderbookMock,
          orderId,
          nonOwner,
          quantity,
        } = await loadFixture(buyOrderToken1Fixture);

        const initialBalance = await hardhatToken1.balanceOf(nonOwner.address);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken1.balanceOf(nonOwner.address);
        const balanceDiff = initialBalance - finalBalance;
        const correctBalanceDeducted = balanceDiff == -quantity;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should deposit correct recieve-able amount (Token 02) to buyer account', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          owner,
          nonOwner,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 14500;
        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);

        await hardhatOrderbookMock
          .connect(nonOwner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 0);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const cost = parseInt((buyingTokenAmt * quantity) / sellingTokenAmt);
        const initialBalance = await hardhatToken2.balanceOf(owner.address);
        await hardhatOrderbookMock
          .connect(owner)
          .buyOrder(orderId.toString(), quantity);
        const finalBalance = await hardhatToken2.balanceOf(owner.address);
        const balanceDiff = initialBalance - finalBalance;
        const correctBalanceDeducted = balanceDiff == -quantity;
        expect(correctBalanceDeducted).to.be.true;
      });

      it('should update open order details by reducing sellingTokenAmt by quantity', async function () {
        const {
          hardhatOrderbookMock,
          orderId,
          nonOwner,
          quantity,
          orderDetails,
        } = await loadFixture(buyOrderToken1Fixture);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        const orderDetailsFinal = await hardhatOrderbookMock.orders(
          orderId.toString()
        );
        const diff =
          orderDetails.sellingTokenAmt - orderDetailsFinal.sellingTokenAmt;
        const isDiffCorrect = diff == quantity;
        expect(isDiffCorrect).to.be.true;
      });

      it('should update open order details by reducing buyingTokenAmt by cost', async function () {
        const {
          hardhatOrderbookMock,
          orderId,
          nonOwner,
          quantity,
          orderDetails,
          cost,
        } = await loadFixture(buyOrderToken1Fixture);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        const orderDetailsFinal = await hardhatOrderbookMock.orders(
          orderId.toString()
        );
        const diff =
          orderDetails.buyingTokenAmt - orderDetailsFinal.buyingTokenAmt;
        const isDiffCorrect = diff == cost;
        expect(isDiffCorrect).to.be.true;
      });

      it('should emit TakerFeePaid event', async function () {
        const {
          hardhatOrderbookMock,
          orderId,
          nonOwner,
          quantity,
          hardhatToken2,
          _takerFee,
        } = await loadFixture(buyOrderToken1Fixture);
        await expect(
          hardhatOrderbookMock
            .connect(nonOwner)
            .buyOrder(orderId.toString(), quantity)
        )
          .to.emit(hardhatOrderbookMock, 'TakerFeePaid')
          .withArgs(
            orderId.toString(),
            nonOwner.address,
            hardhatToken2.address,
            _takerFee
          );
      });

      it('should emit MakerFeePaid event', async function () {
        const {
          hardhatOrderbookMock,
          orderId,
          nonOwner,
          quantity,
          orderDetails,
          hardhatToken2,
          _makerFee,
        } = await loadFixture(buyOrderToken1Fixture);
        await expect(
          hardhatOrderbookMock
            .connect(nonOwner)
            .buyOrder(orderId.toString(), quantity)
        )
          .to.emit(hardhatOrderbookMock, 'MakerFeePaid')
          .withArgs(
            orderId.toString(),
            orderDetails.owner,
            hardhatToken2.address,
            _makerFee
          );
      });

      it('should emit OfferUpdate event', async function () {
        const {
          hardhatOrderbookMock,
          orderId,
          nonOwner,
          quantity,
          sellingTokenAmt,
          buyingTokenAmt,
          cost,
        } = await loadFixture(buyOrderToken1Fixture);
        const sellingTokenAmtFinal = sellingTokenAmt - quantity;
        const buyingTokenAmtFinal = buyingTokenAmt - cost;

        await expect(
          hardhatOrderbookMock
            .connect(nonOwner)
            .buyOrder(orderId.toString(), quantity)
        )
          .to.emit(hardhatOrderbookMock, 'OfferUpdate')
          .withArgs(
            orderId.toString(),
            sellingTokenAmtFinal,
            buyingTokenAmtFinal
          );
      });

      it('should delete order from orders list if all tokens are sold', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          owner,
          nonOwner,
          takerFee,
          makerFee,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 36000;

        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        const orderDetails = await hardhatOrderbookMock.orders(
          orderId.toString()
        );
        expect(orderDetails.sellingTokenAmt.toString()).to.equal('0');
        expect(orderDetails.buyingTokenAmt.toString()).to.equal('0');
        expect(orderDetails.owner).to.equal(
          '0x0000000000000000000000000000000000000000'
        );
        expect(orderDetails.sellingToken1).to.equal(0);
        expect(orderDetails.biggerToken).to.equal(0);
        expect(orderDetails.priceRatio).to.equal(0);
      });

      it('should not delete order from orders list if all tokens are not sold', async function () {
        const { hardhatOrderbookMock, orderId, nonOwner, quantity } =
          await loadFixture(buyOrderToken1Fixture);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        const orderDetails = await hardhatOrderbookMock.orders(
          orderId.toString()
        );
        expect(orderDetails.sellingTokenAmt.toString()).to.not.equal('0');
        expect(orderDetails.buyingTokenAmt.toString()).to.not.equal('0');
        expect(orderDetails.owner).to.not.equal(
          '0x0000000000000000000000000000000000000000'
        );
        expect(orderDetails.sellingToken1).to.not.equal(0);
        expect(orderDetails.biggerToken).to.not.equal(0);
        expect(orderDetails.priceRatio).to.not.equal(0);
      });

      it('should change status to 0 in activeorders mapping if all tokens are sold', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          owner,
          nonOwner,
          takerFee,
          makerFee,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 36000;

        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        expect(
          await hardhatOrderbookMock.activeOrders(orderId.toString())
        ).to.equal('0');
      });

      it('should not change status to 0 in activeorders mapping if all tokens are not sold', async function () {
        const { hardhatOrderbookMock, orderId, nonOwner, quantity } =
          await loadFixture(buyOrderToken1Fixture);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        expect(
          await hardhatOrderbookMock.activeOrders(orderId.toString())
        ).to.equal('1');
      });

      it('should emit DeleteOffer event if all tokens are sold', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          owner,
          nonOwner,
          takerFee,
          makerFee,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 36000;

        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const orderDetails = await hardhatOrderbookMock.orders(
          orderId.toString()
        );
        const cost = parseInt((buyingTokenAmt * quantity) / sellingTokenAmt);
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        await expect(
          hardhatOrderbookMock
            .connect(nonOwner)
            .buyOrder(orderId.toString(), quantity)
        )
          .to.emit(hardhatOrderbookMock, 'DeleteOffer')
          .withArgs(
            orderId.toString(),
            orderDetails.owner,
            hardhatToken1.address,
            hardhatToken2.address
          );
      });

      it('should return true if all tokens are sold', async function () {
        const {
          hardhatOrderbookMock,
          hardhatToken1,
          hardhatToken2,
          owner,
          nonOwner,
          takerFee,
          makerFee,
        } = await loadFixture(deployOrderBookFixture);
        const buyingTokenAmt = 25000;
        const sellingTokenAmt = 36000;
        const quantity = 36000;

        await hardhatToken1.mintToken(owner.address, 100_000);
        await hardhatToken1.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(owner.address, 100_000);
        await hardhatToken2.approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken1.mintToken(nonOwner.address, 100_000);
        await hardhatToken1
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatToken2.mintToken(nonOwner.address, 100_000);
        await hardhatToken2
          .connect(nonOwner)
          .approve(hardhatOrderbookMock.address, 75_0000);
        await hardhatOrderbookMock
          .connect(owner)
          .makeOrder(sellingTokenAmt, buyingTokenAmt, 800, 1, 1);
        const orderId = await hardhatOrderbookMock.currentOrderId();
        const orderDetails = await hardhatOrderbookMock.orders(
          orderId.toString()
        );
        const cost = parseInt((buyingTokenAmt * quantity) / sellingTokenAmt);
        const _takerFee = parseInt((cost * takerFee) / 10_000);
        const _makerFee = parseInt((cost * makerFee) / 10_000);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        expect(await hardhatOrderbookMock.orderDeleted()).to.equal(true);
      });

      it('should return false if all tokens are not sold', async function () {
        const { hardhatOrderbookMock, orderId, nonOwner, quantity } =
          await loadFixture(buyOrderToken1Fixture);
        await hardhatOrderbookMock
          .connect(nonOwner)
          .buyOrder(orderId.toString(), quantity);
        expect(await hardhatOrderbookMock.orderDeleted()).to.equal(false);
      });
    });
  });
});
