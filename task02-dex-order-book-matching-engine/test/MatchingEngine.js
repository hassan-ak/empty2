const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('MatchingEngine contract', function () {
  async function deployMatchingEngineMockFixture() {
    const Token1 = await ethers.getContractFactory('ERC20Mock');
    const hardhatToken1 = await Token1.deploy('Token 01', 'hak');
    await hardhatToken1.deployed();

    const Token2 = await ethers.getContractFactory('ERC20Mock');
    const hardhatToken2 = await Token2.deploy('Token 02', 'art');
    await hardhatToken2.deployed();

    const feeAddr = '0x1234567890123456789012345678901234567890';
    const takerFee = 100; // 1% represented in BPS
    const makerFee = 50; // 0.5% represented in BPS

    const MatchingEngineMock = await ethers.getContractFactory(
      'MatchingEngineMock'
    );
    const hardhatMatchingEngineMock = await MatchingEngineMock.deploy(
      hardhatToken1.address,
      hardhatToken2.address,
      feeAddr,
      takerFee,
      makerFee
    );
    await hardhatMatchingEngineMock.deployed();

    const [owner, nonOwner] = await ethers.getSigners();
    await hardhatToken1.mintToken(owner.address, 1000_000_000);
    await hardhatToken1.approve(
      hardhatMatchingEngineMock.address,
      1000_000_000
    );
    await hardhatToken1
      .connect(nonOwner)
      .mintToken(nonOwner.address, 1000_000_000);
    await hardhatToken1
      .connect(nonOwner)
      .approve(hardhatMatchingEngineMock.address, 1000_000_000);
    await hardhatToken2.mintToken(owner.address, 1000_000_000);
    await hardhatToken2.approve(
      hardhatMatchingEngineMock.address,
      1000_000_000
    );
    await hardhatToken2
      .connect(nonOwner)
      .mintToken(nonOwner.address, 1000_000_000);
    await hardhatToken2
      .connect(nonOwner)
      .approve(hardhatMatchingEngineMock.address, 1000_000_000);

    return {
      hardhatToken1,
      hardhatToken2,
      hardhatMatchingEngineMock,
      owner,
      nonOwner,
      feeAddr,
      takerFee,
      makerFee,
    };
  }

  describe('On Contract Deployment', function () {
    it('===> should initialize bids correctly', async function () {
      const { hardhatMatchingEngineMock } = await loadFixture(
        deployMatchingEngineMockFixture
      );
      const bids = await hardhatMatchingEngineMock.bids(0);
      expect(bids.id, bids.prev, bids.next).to.equal(0, 0, 0);
    });

    it('===> should initialize asks correctly', async function () {
      const { hardhatMatchingEngineMock } = await loadFixture(
        deployMatchingEngineMockFixture
      );
      const asks = await hardhatMatchingEngineMock.asks(0);
      expect(asks.id, asks.prev, asks.next).to.equal(0, 0, 0);
    });
  });

  describe('On Contract Execution', function () {
    describe('Insert First Order --- _insertFirstOrder()', function () {
      it('===> should insert a bid order into the bids DLL correctly', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const orderId = 2;
        const orderType = 0; // Bid

        await hardhatMatchingEngineMock.insertFirstOrder(orderId, orderType);
        const bids_orderId = await hardhatMatchingEngineMock.bids(orderId);
        const bids_0 = await hardhatMatchingEngineMock.bids(0);

        expect(bids_0.id, bids_0.prev, bids_0.next).to.equal(0, 2, 2);
        expect(bids_orderId.id, bids_orderId.prev, bids_orderId.next).to.equal(
          2,
          0,
          0
        );
      });

      it('===> should insert a bid order into the bids DLL correctly', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const orderId = 5;
        const orderType = 1; // Bid

        await hardhatMatchingEngineMock.insertFirstOrder(orderId, orderType);
        const asks_orderId = await hardhatMatchingEngineMock.asks(orderId);
        const asks_0 = await hardhatMatchingEngineMock.asks(0);

        expect(asks_0.id, asks_0.prev, asks_0.next).to.equal(0, 5, 5);
        expect(asks_orderId.id, asks_orderId.prev, asks_orderId.next).to.equal(
          5,
          0,
          0
        );
      });
    });

    describe('Insert Order at a Position --- _insertOrderAtPosition()', function () {
      it('should insert a bid order into the bids DLL correctly at a position', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const token1Amt = 250;
        const sellingToken1 = 0;
        const dllPosition = 0;
        for (let token2Amt = 500; token2Amt < 525; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        // Here e have 5 orders added to bids
        // each one is uniqe
        // so new entry for each order
        // bids maping contain 7 data points 5 for orders one for initilization and one empty
        // now add another order with same specification as order 2 (token2 amount 510)
        await hardhatMatchingEngineMock.makerOrder(
          token1Amt,
          510,
          sellingToken1,
          dllPosition
        );
        // Now lets have look at the posotion at whihc this new order will be placed
        // it is obvious the order will be placed at postion 4
        // doing it manually to not chnage the contract in any capacity
        // Now we only need to analize bids with id 7,4,3
        const bids_3 = await hardhatMatchingEngineMock.bids(3);
        const bids_4 = await hardhatMatchingEngineMock.bids(4);
        const bids_7 = await hardhatMatchingEngineMock.bids(7);
        expect(bids_7.id, bids_7.prev, bids_7.next).to.equal(
          7,
          bids_4.id,
          bids_3.id
        );
        expect(bids_4.next).to.equal(bids_7.id);
        expect(bids_3.prev).to.equal(bids_7.id);
      });

      it('should insert a ask order into the bids DLL correctly at a position', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const token1Amt = 250;
        const sellingToken1 = 1;
        const dllPosition = 0;
        for (let token2Amt = 500; token2Amt < 525; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt,
          510,
          sellingToken1,
          dllPosition
        );

        const asks_4 = await hardhatMatchingEngineMock.asks(4);
        const asks_5 = await hardhatMatchingEngineMock.asks(5);
        const asks_7 = await hardhatMatchingEngineMock.asks(7);
        expect(asks_7.id, asks_7.prev, asks_7.next).to.equal(
          7,
          asks_4.id,
          asks_5.id
        );
        expect(asks_5.prev).to.equal(asks_7.id);
        expect(asks_4.next).to.equal(asks_7.id);
      });
    });

    describe('Find correct position --- _findInsertPosition()', function () {
      it('should calculate correctly  (bid - list empty)', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        await hardhatMatchingEngineMock.makerOrder(1, 60, 0, 0);

        let bid = await hardhatMatchingEngineMock.bids(2);
        expect(bid.next).to.equal(0);
      });

      it('should calculate correctly  (ask - list empty)', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        await hardhatMatchingEngineMock.makerOrder(1, 60, 0, 0);

        let ask = await hardhatMatchingEngineMock.asks(2);
        expect(ask.next).to.equal(0);
      });

      it('should calculate correctly  (bid - biggerToken : 1 and ratio : worst )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 0;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          13,
          sellingToken1,
          dllPosition
        );

        let bid = await hardhatMatchingEngineMock.bids(12);
        expect(bid.next).to.equal(7);
      });

      it('should calculate correctly  (bid - biggerToken : 1 and ratio : better )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 0;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          5,
          sellingToken1,
          dllPosition
        );

        let bid = await hardhatMatchingEngineMock.bids(12);
        expect(bid.next).to.equal(0);
      });

      it('should calculate correctly  (bid - biggerToken : 2 and ratio : worst )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 0;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt,
          350,
          sellingToken1,
          dllPosition
        );

        let bid = await hardhatMatchingEngineMock.bids(12);
        expect(bid.next).to.equal(0);
      });

      it('should calculate correctly  (bid - biggerToken : 2 and ratio : better )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 0;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          1,
          350,
          sellingToken1,
          dllPosition
        );

        let bid = await hardhatMatchingEngineMock.bids(12);
        expect(bid.next).to.equal(0);
      });

      it('should calculate correctly  (bid - biggerToken : 1 and no order with  biggerToken : 1)', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 0;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          1,
          sellingToken1,
          dllPosition
        );

        let bid = await hardhatMatchingEngineMock.bids(7);
        expect(bid.next).to.equal(0);
      });

      it('should calculate correctly  (bid - biggerToken : 2 and no order with  biggerToken : 2)', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const sellingToken1 = 0;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          500,
          sellingToken1,
          dllPosition
        );

        let bid = await hardhatMatchingEngineMock.bids(7);
        expect(bid.next).to.equal(0);
      });

      it('should calculate correctly  (ask - biggerToken : 1 and ratio : worst )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 1;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          13,
          sellingToken1,
          dllPosition
        );

        let ask = await hardhatMatchingEngineMock.asks(12);
        expect(ask.next).to.equal(2);
      });

      it('should calculate correctly  (ask - biggerToken : 1 and ratio : better )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 1;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          5,
          sellingToken1,
          dllPosition
        );

        let ask = await hardhatMatchingEngineMock.asks(12);
        expect(ask.next).to.equal(2);
      });

      it('should calculate correctly  (ask - biggerToken : 2 and ratio : worst )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 1;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt,
          350,
          sellingToken1,
          dllPosition
        );

        let ask = await hardhatMatchingEngineMock.asks(12);
        expect(ask.next).to.equal(4);
      });

      it('should calculate correctly  (ask - biggerToken : 2 and ratio : better )', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 1;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }
        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          1,
          420,
          sellingToken1,
          dllPosition
        );

        let ask = await hardhatMatchingEngineMock.asks(12);
        expect(ask.next).to.equal(5);
      });

      it('should calculate correctly  (ask - biggerToken : 1 and no order with  biggerToken : 1)', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const token1Amt = 1;
        const sellingToken1 = 1;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 200; token2Amt < 700; token2Amt += 100) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          1,
          sellingToken1,
          dllPosition
        );

        let ask = await hardhatMatchingEngineMock.asks(7);
        expect(ask.next).to.equal(0);
      });

      it('should calculate correctly  (ask - biggerToken : 2 and no order with  biggerToken : 2)', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );
        const sellingToken1 = 1;
        const dllPosition = 0;
        const token1Amt1 = 256;

        for (let token2Amt = 11; token2Amt < 35; token2Amt += 5) {
          await hardhatMatchingEngineMock.makerOrder(
            token1Amt1,
            token2Amt,
            sellingToken1,
            dllPosition
          );
        }

        await hardhatMatchingEngineMock.makerOrder(
          token1Amt1,
          500,
          sellingToken1,
          dllPosition
        );

        let ask = await hardhatMatchingEngineMock.asks(7);
        expect(ask.next).to.equal(0);
      });
    });

    it('should partially fill an ask order  (biggerToken : 1)', async function () {
      const { hardhatMatchingEngineMock } = await loadFixture(
        deployMatchingEngineMockFixture
      );
      // Place 2 bids
      await hardhatMatchingEngineMock.makerOrder(6, 1, 1, 0);
      await hardhatMatchingEngineMock.makerOrder(5, 1, 1, 0);
      await hardhatMatchingEngineMock.makerOrder(3, 1, 1, 0);

      // Place 1 ask order
      await hardhatMatchingEngineMock.makerOrder(4, 1, 0, 0);

      const order1 = await hardhatMatchingEngineMock.orders(2);
      const order2 = await hardhatMatchingEngineMock.orders(3);
      const order3 = await hardhatMatchingEngineMock.orders(4);
      const order5 = await hardhatMatchingEngineMock.orders(5);

      console.log(
        order1.sellingTokenAmt,
        order1.buyingTokenAmt,
        order1.priceRatio
      );
      console.log(
        order2.sellingTokenAmt,
        order2.buyingTokenAmt,
        order2.priceRatio
      );
      console.log(
        order3.sellingTokenAmt,
        order3.buyingTokenAmt,
        order3.priceRatio
      );
      console.log(
        order5.sellingTokenAmt,
        order5.buyingTokenAmt,
        order5.priceRatio
      );

      // console.log(order3.sellingTokenAmt);
    });
  });
});
