// import { ethers } from "hardhat";

const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('OrderBook contract', function () {
  async function deployOrderBookFixture() {
    const Token1 = await ethers.getContractFactory('TestErc');
    const hardhatToken1 = await Token1.deploy('Token 01', 'hak');
    await hardhatToken1.deployed();

    const Token2 = await ethers.getContractFactory('TestErc');
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

    const TestContract = await ethers.getContractFactory('TestContract');
    const hardhatTestContract = await TestContract.deploy(
      hardhatToken1.address,
      hardhatToken2.address,
      feeAddr,
      takerFee,
      makerFee
    );
    await hardhatTestContract.deployed();

    return {
      hardhatToken1,
      hardhatToken2,
      hardhatOrderBook,
      feeAddr,
      takerFee,
      makerFee,
      owner,
      nonOwner,
      hardhatTestContract,
    };
  }

  describe('On Contract Deployment', function () {
    it('should assign correct ERC20 instance as token1', async function () {
      const { hardhatOrderBook, hardhatToken1 } = await loadFixture(
        deployOrderBookFixture
      );
      expect(await hardhatOrderBook.token1()).to.equal(hardhatToken1.address);
    });

    it('should assign correct ERC20 instance as token2', async function () {
      const { hardhatOrderBook, hardhatToken2 } = await loadFixture(
        deployOrderBookFixture
      );
      expect(await hardhatOrderBook.token2()).to.equal(hardhatToken2.address);
    });

    it('should assign correct feeAddr', async function () {
      const { hardhatOrderBook, feeAddr } = await loadFixture(
        deployOrderBookFixture
      );
      expect(await hardhatOrderBook.feeAddr()).to.equal(feeAddr);
    });

    it('should assign correct takerFee', async function () {
      const { hardhatOrderBook, takerFee } = await loadFixture(
        deployOrderBookFixture
      );
      expect(await hardhatOrderBook.takerFee()).to.equal(takerFee);
    });

    it('should assign correct makerFee', async function () {
      const { hardhatOrderBook, makerFee } = await loadFixture(
        deployOrderBookFixture
      );
      expect(await hardhatOrderBook.makerFee()).to.equal(makerFee);
    });
  });

  describe('On Contract Execution', function () {
    describe('Get Taker Fee --- getTakerFee()', function () {
      it('should return the expected taker fee value (initial)', async function () {
        const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
        const actualTakerFee = await hardhatOrderBook.getTakerFee();
        expect(actualTakerFee).to.equal(100);
      });

      it('should return the expected taker fee value (after updated)', async function () {
        const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
        const expectedTakerFee = 500;
        await hardhatOrderBook.setTakerFee(expectedTakerFee);
        const actualTakerFee = await hardhatOrderBook.getTakerFee();
        expect(actualTakerFee).to.equal(expectedTakerFee);
      });

      it('should be callable by an external account without modifying the state', async function () {
        const { hardhatOrderBook, nonOwner } = await loadFixture(
          deployOrderBookFixture
        );

        const actualTakerFee = await hardhatOrderBook
          .connect(nonOwner)
          .getTakerFee();
        expect(actualTakerFee).to.equal(100);
        const currentTakerFee = await hardhatOrderBook.getTakerFee();
        expect(currentTakerFee).to.equal(100);
      });
    });

    describe('Set Taker Fee --- setTakerFee()', function () {
      it('should revert when called by a non-owner account', async function () {
        const { hardhatOrderBook, nonOwner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(hardhatOrderBook.connect(nonOwner).setTakerFee(1000)).to.be
          .reverted;
      });

      it("should not revert when called by the contract owner's account", async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(hardhatOrderBook.connect(owner).setTakerFee(2000)).to.not
          .be.reverted;
      });

      it('should revert with a correct custom error "InvalidFeeValue" when fee set to > 50%', async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(
          hardhatOrderBook.connect(owner).setTakerFee(6000)
        ).to.be.revertedWithCustomError(hardhatOrderBook, 'InvalidFeeValue');
      });

      it('should not revert when fee set to < 50%', async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(hardhatOrderBook.connect(owner).setTakerFee(4900)).to.be
          .not.reverted;
      });

      it('should update takerFee when correct (in-range) value provided', async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatOrderBook.connect(owner).setTakerFee(4900);
        expect(await hardhatOrderBook.connect(owner).getTakerFee()).to.be.equal(
          4900
        );
      });
    });

    describe('Get Maker Fee --- getMakerFee()', function () {
      it('should return the expected maker fee value (initial)', async function () {
        const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
        const actualMakerFee = await hardhatOrderBook.getMakerFee();
        expect(actualMakerFee).to.equal(50);
      });

      it('should return the expected maker fee value (after updated)', async function () {
        const { hardhatOrderBook } = await loadFixture(deployOrderBookFixture);
        const expectedMakerFee = 500;
        await hardhatOrderBook.setMakerFee(expectedMakerFee);
        const actualMakerFee = await hardhatOrderBook.getMakerFee();
        expect(actualMakerFee).to.equal(expectedMakerFee);
      });

      it('should be callable by an external account without modifying the state', async function () {
        const { hardhatOrderBook, nonOwner } = await loadFixture(
          deployOrderBookFixture
        );

        const actualMakerFee = await hardhatOrderBook
          .connect(nonOwner)
          .getMakerFee();
        expect(actualMakerFee).to.equal(50);
        const currentMakerFee = await hardhatOrderBook.getMakerFee();
        expect(currentMakerFee).to.equal(50);
      });
    });

    describe('Set Maker Fee --- setMakerFee()', function () {
      it('should revert when called by a non-owner account', async function () {
        const { hardhatOrderBook, nonOwner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(hardhatOrderBook.connect(nonOwner).setMakerFee(1000)).to.be
          .reverted;
      });

      it("should not revert when called by the contract owner's account", async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(hardhatOrderBook.connect(owner).setMakerFee(2000)).to.not
          .be.reverted;
      });

      it('should revert with a correct custom error "InvalidFeeValue" when fee set to > 50%', async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(
          hardhatOrderBook.connect(owner).setMakerFee(6000)
        ).to.be.revertedWithCustomError(hardhatOrderBook, 'InvalidFeeValue');
      });

      it('should not revert when fee set to < 50%', async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await expect(hardhatOrderBook.connect(owner).setMakerFee(4900)).to.be
          .not.reverted;
      });

      it('should update makerFee when correct (in-range) value provided', async function () {
        const { hardhatOrderBook, owner } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatOrderBook.connect(owner).setMakerFee(4900);
        expect(await hardhatOrderBook.connect(owner).getMakerFee()).to.be.equal(
          4900
        );
      });
    });

    describe('Get Token Pair --- getTokenPair()', function () {
      it('should return the correct token pair', async function () {
        const { hardhatOrderBook, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);
        const [token1, token2] = await hardhatOrderBook.getTokenPair();
        expect(token1).to.equal(hardhatToken1.address);
        expect(token2).to.equal(hardhatToken2.address);
      });

      it('should be callable by an external account without modifying the state', async function () {
        const { hardhatOrderBook, hardhatToken1, hardhatToken2, nonOwner } =
          await loadFixture(deployOrderBookFixture);
        const [token1External, token2External] = await hardhatOrderBook
          .connect(nonOwner)
          .getTokenPair();
        expect(token1External).to.equal(hardhatToken1.address);
        expect(token2External).to.equal(hardhatToken2.address);
        const [token1, token2] = await hardhatOrderBook.getTokenPair();
        expect(token1).to.equal(hardhatToken1.address);
        expect(token2).to.equal(hardhatToken2.address);
      });
    });

    describe('Maker Order --- _make()', function () {
      it('should revert with a correct custom error "InvalidFeeValue" when sellingToken1 > 1', async function () {
        const { hardhatOrderBook, hardhatTestContract } = await loadFixture(
          deployOrderBookFixture
        );
        const token1Amt = 100;
        const token2Amt = 200;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 2;

        await expect(
          hardhatTestContract.makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          )
        ).to.be.revertedWithCustomError(
          hardhatOrderBook,
          'SellingTokenNotBool'
        );
      });

      it('should not revert when sellingToken1 is 0 or 1', async function () {
        const [sender] = await ethers.getSigners();

        const { hardhatTestContract, hardhatToken1, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);

        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 200);

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 200);

        const token1Amt = 10;
        const token2Amt = 10;
        const priceRatio = 1000;
        const biggerToken = 1;
        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(token1Amt, token2Amt, priceRatio, biggerToken, 0)
        ).to.not.be.reverted;
        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(token1Amt, token2Amt, priceRatio, biggerToken, 1)
        ).to.not.be.reverted;
      });

      it('should revert with a correct custom error "ZeroTokenAmount" when token1Amt == 0', async function () {
        const { hardhatOrderBook, hardhatTestContract } = await loadFixture(
          deployOrderBookFixture
        );
        const token1Amt = 0;
        const token2Amt = 200;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;

        await expect(
          hardhatTestContract.makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          )
        ).to.be.revertedWithCustomError(hardhatOrderBook, 'ZeroTokenAmount');
      });

      it('should revert with a correct custom error "ZeroTokenAmount" when token2Amt == 0', async function () {
        const { hardhatOrderBook, hardhatTestContract } = await loadFixture(
          deployOrderBookFixture
        );
        const token1Amt = 100;
        const token2Amt = 0;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;

        await expect(
          hardhatTestContract.makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          )
        ).to.be.revertedWithCustomError(hardhatOrderBook, 'ZeroTokenAmount');
      });

      it('should not revert when both token1Amt, token2Amt are not 0', async function () {
        const [sender] = await ethers.getSigners();

        const { hardhatTestContract, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 10);

        const token1Amt = 10;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;
        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(
              token1Amt,
              token2Amt,
              priceRatio,
              biggerToken,
              sellingToken1
            )
        ).to.not.be.reverted;
      });

      it('should revert when sellingToken1 is true and transferFrom fails', async function () {
        const [sender] = await ethers.getSigners();

        const { hardhatOrderBook, hardhatTestContract, hardhatToken1 } =
          await loadFixture(deployOrderBookFixture);

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 10);

        // Call the _make function with sellingToken1 = 1
        const token1Amt = 20;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;

        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(
              token1Amt,
              token2Amt,
              priceRatio,
              biggerToken,
              sellingToken1
            )
        ).to.be.reverted;
      });

      it('should not revert when sellingToken1 is true and transferFrom do not fails', async function () {
        const [sender] = await ethers.getSigners();

        const { hardhatTestContract, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 10);

        const token1Amt = 10;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;
        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(
              token1Amt,
              token2Amt,
              priceRatio,
              biggerToken,
              sellingToken1
            )
        ).to.not.be.reverted;
      });

      it('should revert when sellingToken1 is false and transferFrom fails', async function () {
        const [sender] = await ethers.getSigners();

        const { hardhatOrderBook, hardhatTestContract, hardhatToken2 } =
          await loadFixture(deployOrderBookFixture);

        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 10);

        // Call the _make function with sellingToken1 = 0
        const token1Amt = 20;
        const token2Amt = 20;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 0;

        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(
              token1Amt,
              token2Amt,
              priceRatio,
              biggerToken,
              sellingToken1
            )
        ).to.be.reverted;
      });

      it('should not revert when sellingToken1 is false and transferFrom do not fails', async function () {
        const [sender] = await ethers.getSigners();

        const { hardhatTestContract, hardhatToken2 } = await loadFixture(
          deployOrderBookFixture
        );

        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 10);

        const token1Amt = 10;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 0;
        await expect(
          hardhatTestContract
            .connect(sender)
            .makeOrder(
              token1Amt,
              token2Amt,
              priceRatio,
              biggerToken,
              sellingToken1
            )
        ).to.not.be.reverted;
      });

      it('should assign correct orderId when sellingToken1 is true', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 10);
        const token1Amt = 10;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;

        await hardhatTestContract
          .connect(sender)
          .makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          );
        const orderId = await hardhatTestContract.currentOrderId();
        expect(orderId.toString()).to.equal('2');
      });

      it('should assign correct orderId when sellingToken1 is false', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken2 } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 10);
        const token1Amt = 10;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 0;

        await hardhatTestContract
          .connect(sender)
          .makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          );
        const orderId = await hardhatTestContract.currentOrderId();
        expect(orderId.toString()).to.equal('2');
      });

      it('should assign correct orderDetails when sellingToken1 is true', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken1, hardhatOrderBook } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 10);
        const token1Amt = 10;
        const token2Amt = 1;
        const priceRatio = 1000;
        const biggerToken = 1;
        const sellingToken1 = 1;

        await hardhatTestContract
          .connect(sender)
          .makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          );
        const orderId = await hardhatTestContract.currentOrderId();
        const orderDetail = await hardhatTestContract.orders(
          orderId.toString()
        );
        expect(orderDetail.sellingTokenAmt.toString()).to.equal(
          token1Amt.toString()
        );
        expect(orderDetail.buyingTokenAmt.toString()).to.equal(
          token2Amt.toString()
        );
        expect(orderDetail.owner).to.equal(sender.address);
        expect(orderDetail.sellingToken1).to.equal(sellingToken1);
        expect(orderDetail.biggerToken).to.equal(biggerToken);
        expect(orderDetail.priceRatio).to.equal(priceRatio);
      });

      it('should assign correct orderDetails when sellingToken1 is true (Multiple Orders)', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken1, hardhatOrderBook } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 100);

        await hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 1, 1);
        const orderId1 = await hardhatTestContract.currentOrderId();
        const orderDetail1 = await hardhatTestContract.orders(
          orderId1.toString()
        );
        expect(orderDetail1.sellingTokenAmt.toString()).to.equal('75');
        expect(orderDetail1.buyingTokenAmt.toString()).to.equal('20');
        expect(orderDetail1.owner).to.equal(sender.address);
        expect(orderDetail1.sellingToken1).to.equal(1);
        expect(orderDetail1.biggerToken).to.equal(1);
        expect(orderDetail1.priceRatio).to.equal(800);

        await hardhatTestContract.connect(sender).makeOrder(25, 11, 1800, 2, 1);
        const orderId2 = await hardhatTestContract.currentOrderId();
        const orderDetail2 = await hardhatTestContract.orders(
          orderId2.toString()
        );
        expect(orderDetail2.sellingTokenAmt.toString()).to.equal('25');
        expect(orderDetail2.buyingTokenAmt.toString()).to.equal('11');
        expect(orderDetail2.owner).to.equal(sender.address);
        expect(orderDetail2.sellingToken1).to.equal(1);
        expect(orderDetail2.biggerToken).to.equal(2);
        expect(orderDetail2.priceRatio).to.equal(1800);
      });

      it('should assign correct orderDetails when sellingToken1 is false', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken2, hardhatOrderBook } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 500);
        const token1Amt = 10;
        const token2Amt = 150;
        const priceRatio = 750;
        const biggerToken = 1;
        const sellingToken1 = 0;

        await hardhatTestContract
          .connect(sender)
          .makeOrder(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
          );
        const orderId = await hardhatTestContract.currentOrderId();
        const orderDetail = await hardhatTestContract.orders(
          orderId.toString()
        );
        expect(orderDetail.sellingTokenAmt.toString()).to.equal(
          token2Amt.toString()
        );
        expect(orderDetail.buyingTokenAmt.toString()).to.equal(
          token1Amt.toString()
        );
        expect(orderDetail.owner).to.equal(sender.address);
        expect(orderDetail.sellingToken1).to.equal(sellingToken1);
        expect(orderDetail.biggerToken).to.equal(biggerToken);
        expect(orderDetail.priceRatio).to.equal(priceRatio);
      });

      it('should assign correct orderDetails when sellingToken1 is false (Multiple Orders)', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken2, hardhatOrderBook } =
          await loadFixture(deployOrderBookFixture);
        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 750);

        await hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 1, 0);
        const orderId1 = await hardhatTestContract.currentOrderId();
        const orderDetail1 = await hardhatTestContract.orders(
          orderId1.toString()
        );
        expect(orderDetail1.sellingTokenAmt.toString()).to.equal('20');
        expect(orderDetail1.buyingTokenAmt.toString()).to.equal('75');
        expect(orderDetail1.owner).to.equal(sender.address);
        expect(orderDetail1.sellingToken1).to.equal(0);
        expect(orderDetail1.biggerToken).to.equal(1);
        expect(orderDetail1.priceRatio).to.equal(800);

        await hardhatTestContract.connect(sender).makeOrder(25, 11, 1800, 2, 0);
        const orderId2 = await hardhatTestContract.currentOrderId();
        const orderDetail2 = await hardhatTestContract.orders(
          orderId2.toString()
        );
        expect(orderDetail2.sellingTokenAmt.toString()).to.equal('11');
        expect(orderDetail2.buyingTokenAmt.toString()).to.equal('25');
        expect(orderDetail2.owner).to.equal(sender.address);
        expect(orderDetail2.sellingToken1).to.equal(0);
        expect(orderDetail2.biggerToken).to.equal(2);
        expect(orderDetail2.priceRatio).to.equal(1800);
      });

      it('should assign correct orderDetails when sellingToken1 is true or false (Both Cases)', async function () {
        const [sender] = await ethers.getSigners();
        const {
          hardhatTestContract,
          hardhatToken1,
          hardhatToken2,
          hardhatOrderBook,
        } = await loadFixture(deployOrderBookFixture);
        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 750);

        await hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 1, 0);
        const orderId1 = await hardhatTestContract.currentOrderId();
        const orderDetail1 = await hardhatTestContract.orders(
          orderId1.toString()
        );
        expect(orderDetail1.sellingTokenAmt.toString()).to.equal('20');
        expect(orderDetail1.buyingTokenAmt.toString()).to.equal('75');
        expect(orderDetail1.owner).to.equal(sender.address);
        expect(orderDetail1.sellingToken1).to.equal(0);
        expect(orderDetail1.biggerToken).to.equal(1);
        expect(orderDetail1.priceRatio).to.equal(800);

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 750);
        await hardhatTestContract.connect(sender).makeOrder(25, 11, 1800, 1, 1);
        const orderId2 = await hardhatTestContract.currentOrderId();
        const orderDetail2 = await hardhatTestContract.orders(
          orderId2.toString()
        );
        expect(orderDetail2.sellingTokenAmt.toString()).to.equal('25');
        expect(orderDetail2.buyingTokenAmt.toString()).to.equal('11');
        expect(orderDetail2.owner).to.equal(sender.address);
        expect(orderDetail2.sellingToken1).to.equal(1);
        expect(orderDetail2.biggerToken).to.equal(1);
        expect(orderDetail2.priceRatio).to.equal(1800);
      });

      it('should assign current order as active order', async function () {
        const [sender] = await ethers.getSigners();
        const { hardhatTestContract, hardhatToken1 } = await loadFixture(
          deployOrderBookFixture
        );
        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 10);

        await hardhatTestContract.connect(sender).makeOrder(10, 1, 1000, 1, 1);
        const orderId = await hardhatTestContract.currentOrderId();
        const orderAciveDetail = await hardhatTestContract.activeOrders(
          orderId.toString()
        );
        expect(orderAciveDetail.toString()).to.equal('1');
      });

      it('should assign current order as active order (multiple orders)', async function () {
        const [sender] = await ethers.getSigners();
        const {
          hardhatTestContract,
          hardhatToken1,
          hardhatToken2,
          hardhatOrderBook,
        } = await loadFixture(deployOrderBookFixture);

        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 750);
        await hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 1, 0);
        const orderId1 = await hardhatTestContract.currentOrderId();
        const orderActiveDetail1 = await hardhatTestContract.activeOrders(
          orderId1.toString()
        );
        expect(orderActiveDetail1.toString()).to.equal('1');

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 750);
        await hardhatTestContract.connect(sender).makeOrder(25, 11, 1800, 1, 1);
        const orderId2 = await hardhatTestContract.currentOrderId();
        const orderActiveDetail2 = await hardhatTestContract.activeOrders(
          orderId2.toString()
        );
        expect(orderActiveDetail2.toString()).to.equal('1');
      });

      it('should emit OfferCreate event', async function () {
        const [sender] = await ethers.getSigners();
        const {
          hardhatTestContract,
          hardhatToken1,
          hardhatToken2,
          hardhatOrderBook,
        } = await loadFixture(deployOrderBookFixture);

        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 750);
        await expect(
          hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 1, 0)
        )
          .to.emit(hardhatTestContract, 'OfferCreate')
          .withArgs(
            hardhatToken1.address,
            hardhatToken2.address,
            0,
            75,
            20,
            2,
            sender.address
          );
      });

      it('should emit OfferCreate event (multiple orders)', async function () {
        const [sender] = await ethers.getSigners();
        const {
          hardhatTestContract,
          hardhatToken1,
          hardhatToken2,
          hardhatOrderBook,
        } = await loadFixture(deployOrderBookFixture);

        await hardhatToken2.mintToken(sender.address, 1000);
        await hardhatToken2.approve(hardhatTestContract.address, 750);
        await expect(
          hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 1, 0)
        )
          .to.emit(hardhatTestContract, 'OfferCreate')
          .withArgs(
            hardhatToken1.address,
            hardhatToken2.address,
            0,
            75,
            20,
            2,
            sender.address
          );

        await hardhatToken1.mintToken(sender.address, 1000);
        await hardhatToken1.approve(hardhatTestContract.address, 750);
        await expect(
          hardhatTestContract.connect(sender).makeOrder(75, 20, 800, 2, 1)
        )
          .to.emit(hardhatTestContract, 'OfferCreate')
          .withArgs(
            hardhatToken1.address,
            hardhatToken2.address,
            1,
            75,
            20,
            3,
            sender.address
          );
      });
    });
  });
});
