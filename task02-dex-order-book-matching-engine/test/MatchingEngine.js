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

        const orderId = 1;
        const orderType = 0; // Bid

        await hardhatMatchingEngineMock.insertFirstOrder(orderId, orderType);
        const bids_orderId = await hardhatMatchingEngineMock.bids(orderId);
        const bids_0 = await hardhatMatchingEngineMock.bids(0);
        expect(bids_orderId.id).to.equal(orderId);
        expect(bids_0.next).to.equal(orderId);
        expect(bids_orderId.prev).to.equal(0);
      });

      it('should insert a ask order into the bids DLL correctly', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const orderId = 1;
        const orderType = 1; // Bid

        await hardhatMatchingEngineMock.insertFirstOrder(orderId, orderType);
        const asks_orderId = await hardhatMatchingEngineMock.asks(orderId);
        const asks_0 = await hardhatMatchingEngineMock.asks(0);
        expect(asks_orderId.id).to.equal(orderId);
        expect(asks_0.next).to.equal(orderId);
        expect(asks_orderId.prev).to.equal(0);
      });

      it('should handle multiple bid orders correctly', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const orderId1 = 1;
        const orderId2 = 2;
        const orderType = 0; // Bid

        await hardhatMatchingEngineMock.insertFirstOrder(orderId1, orderType);
        await hardhatMatchingEngineMock.insertFirstOrder(orderId2, orderType);
        const bids_orderId = await hardhatMatchingEngineMock.bids(orderId2);
        const bids_0 = await hardhatMatchingEngineMock.bids(0);
        expect(bids_orderId.id).to.equal(orderId2);
        expect(bids_0.next).to.equal(orderId2);
        expect(bids_orderId.prev).to.equal(0);
      });
      
      it('should handle multiple ask orders correctly', async function () {
        const { hardhatMatchingEngineMock } = await loadFixture(
          deployMatchingEngineMockFixture
        );

        const orderId1 = 1;
        const orderId2 = 2;
        const orderType = 1; // Bid

        await hardhatMatchingEngineMock.insertFirstOrder(orderId1, orderType);
        await hardhatMatchingEngineMock.insertFirstOrder(orderId2, orderType);
        const asks_orderId = await hardhatMatchingEngineMock.asks(orderId2);
        const asks_0 = await hardhatMatchingEngineMock.asks(0);
        expect(asks_orderId.id).to.equal(orderId2);
        expect(asks_0.next).to.equal(orderId2);
        expect(asks_orderId.prev).to.equal(0);
      });
    });
  });
});
