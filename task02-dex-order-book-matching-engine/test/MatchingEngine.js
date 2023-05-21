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
    it('should initialize bids correctly', async function () {
      const { hardhatMatchingEngineMock } = await loadFixture(
        deployMatchingEngineMockFixture
      );
      const bids = await hardhatMatchingEngineMock.bids(0);
      expect(bids.id, bids.prev, bids.next).to.equal(0, 0, 0);
    });

    it('should initialize asks correctly', async function () {
      const { hardhatMatchingEngineMock } = await loadFixture(
        deployMatchingEngineMockFixture
      );
      const asks = await hardhatMatchingEngineMock.asks(0);
      expect(asks.id, asks.prev, asks.next).to.equal(0, 0, 0);
    });
  });

  describe('On Contract Execution', function () {
    describe('Insert First Order --- _insertFirstOrder()', function () {
      it('should insert a bid order into the bids DLL correctly', async function () {
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

      it('should insert an ask order into the asks DLL correctly', async function () {
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

    describe('Cancels the order --- cancelOrder()', function () {
      describe('Cancels a bid order', function () {
        it('should delete an order and remove bid from DLL correctly', async function () {
          const { hardhatMatchingEngineMock } = await loadFixture(
            deployMatchingEngineMockFixture
          );
          await hardhatMatchingEngineMock.makerOrder(5, 1, 0, 0);
          await hardhatMatchingEngineMock.makerOrder(6, 1, 0, 0);

          await hardhatMatchingEngineMock.cancelOrder(2);

          const orderDetail = await hardhatMatchingEngineMock.orders(2);
          const bid = await hardhatMatchingEngineMock.bids(2);
          expect(orderDetail.priceRatio.toString()).to.equal('0');
          expect(
            bid.id.toString(),
            bid.prev.toString(),
            bid.next.toString()
          ).to.equal('0', '0', '0');
        });

        it('should delete an order and update bid in DLL correctly', async function () {
          const { hardhatMatchingEngineMock } = await loadFixture(
            deployMatchingEngineMockFixture
          );
          await hardhatMatchingEngineMock.makerOrder(5, 1, 0, 0);
          await hardhatMatchingEngineMock.makerOrder(6, 1, 0, 0);

          await hardhatMatchingEngineMock.cancelOrder(2);

          const orderDetail = await hardhatMatchingEngineMock.orders(2);
          const bid0 = await hardhatMatchingEngineMock.bids(0);
          const bid2 = await hardhatMatchingEngineMock.bids(2);
          const bid3 = await hardhatMatchingEngineMock.bids(3);

          expect(orderDetail.priceRatio.toString()).to.equal('0');
          expect(
            bid0.id.toString(),
            bid0.prev.toString(),
            bid0.next.toString()
          ).to.equal('0', '3', '3');
          expect(
            bid2.id.toString(),
            bid2.prev.toString(),
            bid2.next.toString()
          ).to.equal('0', '0', '0');
          expect(
            bid3.id.toString(),
            bid3.prev.toString(),
            bid3.next.toString()
          ).to.equal('3', '0', '0');
        });
      });

      describe('Cancels an ask order', function () {
        it('should delete an order and remove ask from DLL correctly', async function () {
          const { hardhatMatchingEngineMock } = await loadFixture(
            deployMatchingEngineMockFixture
          );
          await hardhatMatchingEngineMock.makerOrder(5, 1, 1, 0);
          await hardhatMatchingEngineMock.makerOrder(6, 1, 1, 0);

          await hardhatMatchingEngineMock.cancelOrder(2);

          const orderDetail = await hardhatMatchingEngineMock.orders(2);
          const ask = await hardhatMatchingEngineMock.asks(2);
          expect(orderDetail.priceRatio.toString()).to.equal('0');
          expect(
            ask.id.toString(),
            ask.prev.toString(),
            ask.next.toString()
          ).to.equal('0', '0', '0');
        });

        it('should delete an order and update ask in DLL correctly', async function () {
          const { hardhatMatchingEngineMock } = await loadFixture(
            deployMatchingEngineMockFixture
          );
          await hardhatMatchingEngineMock.makerOrder(5, 1, 1, 0);
          await hardhatMatchingEngineMock.makerOrder(6, 1, 1, 0);

          await hardhatMatchingEngineMock.cancelOrder(2);

          const orderDetail = await hardhatMatchingEngineMock.orders(2);
          const ask0 = await hardhatMatchingEngineMock.asks(0);
          const ask2 = await hardhatMatchingEngineMock.asks(2);
          const ask3 = await hardhatMatchingEngineMock.asks(3);

          expect(orderDetail.priceRatio.toString()).to.equal('0');
          expect(
            ask0.id.toString(),
            ask0.prev.toString(),
            ask0.next.toString()
          ).to.equal('0', '3', '3');
          expect(
            ask2.id.toString(),
            ask2.prev.toString(),
            ask2.next.toString()
          ).to.equal('0', '0', '0');
          expect(
            ask3.id.toString(),
            ask3.prev.toString(),
            ask3.next.toString()
          ).to.equal('3', '0', '0');
        });
      });
    });

    describe('Taker order --- take()', function () {
      describe('Selling Token 01', function () {
        describe('Only one bid with bidAmount greater than token amount', function () {
          it('should update bid order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            const detailsInitial = await hardhatMatchingEngineMock.orders(2);
            await hardhatMatchingEngineMock.take(2, 1);
            const detailsFinal = await hardhatMatchingEngineMock.orders(2);
            expect(detailsFinal.sellingTokenAmt).to.equal(
              detailsInitial.sellingTokenAmt - 2
            );
          });

          it('should not delete bid from dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(2, 1);
            const bid = await hardhatMatchingEngineMock.bids(2);
            expect(
              bid.id.toString(),
              bid.prev.toString(),
              bid.next.toString()
            ).to.not.equal('0', '0', '0');
          });

          it('should not update bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            const bidInital = await hardhatMatchingEngineMock.bids(2);
            await hardhatMatchingEngineMock.take(2, 1);
            const bidFinal = await hardhatMatchingEngineMock.bids(2);
            expect(...bidInital).to.equal(...bidFinal);
          });
        });

        describe('Only one bid with bidAmount equal to token amount', function () {
          it('should delete bid order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(10, 1);
            const details = await hardhatMatchingEngineMock.orders(2);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should update bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(10, 1);
            const bids = await hardhatMatchingEngineMock.bids(0);
            expect(
              bids.id.toString(),
              bids.prev.toString(),
              bids.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should delete from bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);

            await hardhatMatchingEngineMock.take(10, 1);

            const bids = await hardhatMatchingEngineMock.bids(2);
            expect(
              bids.id.toString(),
              bids.prev.toString(),
              bids.next.toString()
            ).to.equal('0', '0', '0');
          });
        });

        describe('Only one bid with bidAmount less than token amount', function () {
          it('should delete bid order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(25, 1);
            const details = await hardhatMatchingEngineMock.orders(2);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should update bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(25, 1);
            const bids = await hardhatMatchingEngineMock.bids(0);
            expect(
              bids.id.toString(),
              bids.prev.toString(),
              bids.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should delete from bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);

            await hardhatMatchingEngineMock.take(25, 1);

            const bids = await hardhatMatchingEngineMock.bids(2);
            expect(
              bids.id.toString(),
              bids.prev.toString(),
              bids.next.toString()
            ).to.equal('0', '0', '0');
          });
        });

        describe('Mutiple bids & order fullfiled by single bid (bidAmount == tokenAmount)', function () {
          it('should delete bid order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(13, 1);
            const details = await hardhatMatchingEngineMock.orders(2);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should not change other bid orders', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            const details1 = await hardhatMatchingEngineMock.orders(3);
            await hardhatMatchingEngineMock.take(13, 1);
            const details2 = await hardhatMatchingEngineMock.orders(3);
            expect(...details1).to.equal(...details2);
          });

          it('should delete bid from bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(13, 1);
            const bids = await hardhatMatchingEngineMock.bids(2);
            expect(
              bids.id.toString(),
              bids.prev.toString(),
              bids.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should update bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(13, 1);
            const bid0 = await hardhatMatchingEngineMock.bids(0);
            const bid3 = await hardhatMatchingEngineMock.bids(3);

            expect(
              bid0.id.toString(),
              bid0.prev.toString(),
              bid0.next.toString()
            ).to.equal('0', '3', '3');
            expect(
              bid3.id.toString(),
              bid3.prev.toString(),
              bid3.next.toString()
            ).to.equal('3', '0', '0');
          });
        });

        describe('Mutiple bids & order fullfiled by multiple bids', function () {
          it('should delete compltely filled bid order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(17, 1);
            const details = await hardhatMatchingEngineMock.orders(2);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should update partially filled bid orders', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            const details1 = await hardhatMatchingEngineMock.orders(3);
            await hardhatMatchingEngineMock.take(21, 1);
            const details2 = await hardhatMatchingEngineMock.orders(3);
            expect(details2.sellingTokenAmt).to.equal(
              details1.sellingTokenAmt - 8
            );
          });

          it('should delete bid from bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(21, 1);
            const bids = await hardhatMatchingEngineMock.bids(2);
            expect(
              bids.id.toString(),
              bids.prev.toString(),
              bids.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should update bid dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 0, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 0, 0);
            await hardhatMatchingEngineMock.take(21, 1);
            const bid0 = await hardhatMatchingEngineMock.bids(0);
            const bid3 = await hardhatMatchingEngineMock.bids(3);

            expect(
              bid0.id.toString(),
              bid0.prev.toString(),
              bid0.next.toString()
            ).to.equal('0', '3', '3');
            expect(
              bid3.id.toString(),
              bid3.prev.toString(),
              bid3.next.toString()
            ).to.equal('3', '0', '0');
          });
        });
      });

      describe('Selling Token 02', function () {
        describe('Only one ask with askAmount greater than token amount', function () {
          it('should update ask order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            const detailsInitial = await hardhatMatchingEngineMock.orders(2);
            await hardhatMatchingEngineMock.take(2, 0);
            const detailsFinal = await hardhatMatchingEngineMock.orders(2);
            expect(detailsFinal.sellingTokenAmt).to.equal(
              detailsInitial.sellingTokenAmt - 2
            );
          });

          it('should not delete ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(2, 0);
            const ask = await hardhatMatchingEngineMock.asks(2);
            expect(
              ask.id.toString(),
              ask.prev.toString(),
              ask.next.toString()
            ).to.not.equal('0', '0', '0');
          });

          it('should not update ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            const askInital = await hardhatMatchingEngineMock.asks(2);
            await hardhatMatchingEngineMock.take(2, 0);
            const askFinal = await hardhatMatchingEngineMock.asks(2);
            expect(...askInital).to.equal(...askFinal);
          });
        });

        describe('Only one ask with askAmount equal to token amount', function () {
          it('should delete ask order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(15, 0);
            const details = await hardhatMatchingEngineMock.orders(2);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should update ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(15, 0);
            const asks = await hardhatMatchingEngineMock.asks(0);
            expect(
              asks.id.toString(),
              asks.prev.toString(),
              asks.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should delete from ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);

            await hardhatMatchingEngineMock.take(15, 0);

            const asks = await hardhatMatchingEngineMock.asks(2);
            expect(
              asks.id.toString(),
              asks.prev.toString(),
              asks.next.toString()
            ).to.equal('0', '0', '0');
          });
        });

        describe('Only one ask with askAmount less than token amount', function () {
          it('should delete ask order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(25, 0);
            const details = await hardhatMatchingEngineMock.orders(2);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should update ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(25, 0);
            const asks = await hardhatMatchingEngineMock.asks(0);
            expect(
              asks.id.toString(),
              asks.prev.toString(),
              asks.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should delete from ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);

            await hardhatMatchingEngineMock.take(25, 0);

            const asks = await hardhatMatchingEngineMock.asks(2);
            expect(
              asks.id.toString(),
              asks.prev.toString(),
              asks.next.toString()
            ).to.equal('0', '0', '0');
          });
        });

        describe('Mutiple asks & order fullfiled by single ask (askAmount == tokenAmount)', function () {
          it('should delete ask order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(15, 0);
            const details = await hardhatMatchingEngineMock.orders(3);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should not change other ask orders', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            const details1 = await hardhatMatchingEngineMock.orders(2);
            await hardhatMatchingEngineMock.take(15, 0);
            const details2 = await hardhatMatchingEngineMock.orders(2);
            expect(...details1).to.equal(...details2);
          });

          it('should delete ask from ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(15, 0);
            const asks = await hardhatMatchingEngineMock.asks(3);
            expect(
              asks.id.toString(),
              asks.prev.toString(),
              asks.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should update ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(15, 0);
            const ask0 = await hardhatMatchingEngineMock.asks(0);
            const ask2 = await hardhatMatchingEngineMock.asks(2);
            expect(
              ask0.id.toString(),
              ask0.prev.toString(),
              ask0.next.toString()
            ).to.equal('0', '2', '2');
            expect(
              ask2.id.toString(),
              ask2.prev.toString(),
              ask2.next.toString()
            ).to.equal('2', '0', '0');
          });
        });

        describe('Mutiple asks & order fullfiled by multiple ask', function () {
          it('should delete compltely filled ask order', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(17, 0);
            const details = await hardhatMatchingEngineMock.orders(3);
            const detailsEmpty = await hardhatMatchingEngineMock.orders(0);
            expect(...details).to.equal(...detailsEmpty);
          });

          it('should update partially filled ask orders', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            const details1 = await hardhatMatchingEngineMock.orders(2);
            await hardhatMatchingEngineMock.take(19, 0);
            const details2 = await hardhatMatchingEngineMock.orders(2);
            expect(details2.sellingTokenAmt).to.equal(
              details1.sellingTokenAmt - 4
            );
          });

          it('should delete ask from ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(19, 0);
            const asks = await hardhatMatchingEngineMock.asks(3);
            expect(
              asks.id.toString(),
              asks.prev.toString(),
              asks.next.toString()
            ).to.equal('0', '0', '0');
          });

          it('should update ask dll', async function () {
            const { hardhatMatchingEngineMock } = await loadFixture(
              deployMatchingEngineMockFixture
            );
            await hardhatMatchingEngineMock.makerOrder(15, 13, 1, 0);
            await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
            await hardhatMatchingEngineMock.take(19, 0);
            const ask0 = await hardhatMatchingEngineMock.asks(0);
            const ask2 = await hardhatMatchingEngineMock.asks(2);
            expect(
              ask0.id.toString(),
              ask0.prev.toString(),
              ask0.next.toString()
            ).to.equal('0', '2', '2');
            expect(
              ask2.id.toString(),
              ask2.prev.toString(),
              ask2.next.toString()
            ).to.equal('2', '0', '0');
          });
        });
      });

      describe('Emits', function () {
        it('should emit TakerOrder event', async function () {
          const { hardhatMatchingEngineMock } = await loadFixture(
            deployMatchingEngineMockFixture
          );
          await hardhatMatchingEngineMock.makerOrder(15, 10, 1, 0);
          await expect(hardhatMatchingEngineMock.take(25, 0))
            .to.emit(hardhatMatchingEngineMock, 'TakerOrder')
            .withArgs(10, 0);
        });
      });
    });
  });
});

// for (let id = 0; id < 5; id++) {
//   const r = await hardhatMatchingEngineMock.asks(id);
//   console.log(r.id.toString(), r.prev.toString(), r.next.toString());
// }

// 0 2 3
// 0 0 0
// 2 3 0
// 3 0 2
// 0 0 0
// 0 3 3
// 0 0 0
// 0 0 0
// 3 0 0
// 0 0 0
