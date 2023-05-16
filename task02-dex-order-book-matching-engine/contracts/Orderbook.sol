// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./events/EventfulOrderbook.sol";
import "./errors/OrderbookErrors.sol";
import "hardhat/console.sol";

/// @title A decentralized orderbook
/// @author Hassan Ali Khan
/// @notice This contract is based on OasisDex
contract OrderBook is EventfulOrderbook, OrderbookErrors, Ownable {
    ERC20 public token1;
    ERC20 public token2;
    address public feeAddr;
    uint128 public takerFee;
    uint128 public makerFee;

    uint256 private _next_id = 1; // Start at 1 so that this value is never 0 or 1

    mapping(uint256 => MakeOrder) public orders;
    mapping(uint256 => uint256) public activeOrders;

    /// @dev Custom type for orders
    struct MakeOrder {
        uint128 sellingTokenAmt;
        uint128 buyingTokenAmt;
        address owner;
        uint8 sellingToken1; // 1 for token1, 0 for token2
        uint8 biggerToken; // 1 for token1, 2 for token2
        uint256 priceRatio;
    }

    /// @dev Sets the token pair and initial maker/taker fees
    /// @dev Sets the address to which platform fees should be sent to
    constructor(
        ERC20 _token1,
        ERC20 _token2,
        address _feeAddr,
        uint128 _takerFee,
        uint128 _makerFee
    ) {
        token1 = _token1;
        token2 = _token2;

        // The address receiving fees
        feeAddr = _feeAddr;

        // Maker and taker fees in BPS
        // BPS is in terms of 0.01%
        takerFee = _takerFee;
        makerFee = _makerFee;
    }

    /// @notice Returns current taker fee in BPS (0.01%)
    function getTakerFee() external view returns (uint128) {
        return takerFee;
    }

    /// @notice Lets owner change takerFee in BPS (always <50%)
    /// @notice Owner should be a multisig/something controlled by a DAO to prevent abuse
    function setTakerFee(uint128 _takerFee) external onlyOwner {
        if (_takerFee > 5000) revert InvalidFeeValue(); // Taker fee must not be >50%
        takerFee = _takerFee;
    }

    /// @notice Returns current maker fee in BPS (0.01%)
    function getMakerFee() external view returns (uint128) {
        return makerFee;
    }

    /// @notice Lets owner change makerFee in BPS (always <50%)
    /// @notice Owner should be a multisig/something controlled by a DAO to prevent abuse
    function setMakerFee(uint128 _makerFee) external onlyOwner {
        if (_makerFee > 5000) revert InvalidFeeValue(); // Maker fee must not be >50%
        makerFee = _makerFee;
    }

    /// @notice Returns the two tokens traded in the Orderbook
    function getTokenPair() external view returns (ERC20, ERC20) {
        return (token1, token2);
    }

    /// @notice Creates a maker order, sends funds from maker to escrow
    /// @dev Adds created order to orders list
    /// @dev Returns id of created order
    function _make(
        uint128 token1Amt,
        uint128 token2Amt,
        uint256 priceRatio,
        uint8 biggerToken,
        uint8 sellingToken1
    ) internal returns (uint256 id) {
        if (sellingToken1 > 1) revert SellingTokenNotBool();
        if (token1Amt == 0 || token2Amt == 0) revert ZeroTokenAmount();

        MakeOrder memory orderInfo;

        if (sellingToken1 == 1) {
            // If token1 is the one being sold
            if (
                !token1.transferFrom(
                    msg.sender,
                    address(this),
                    uint256(token1Amt)
                )
            ) revert TransferToEscrowError();
            orderInfo.sellingTokenAmt = token1Amt;
            orderInfo.buyingTokenAmt = token2Amt;
        } else {
            // If token2 is the one being sold
            if (
                !token2.transferFrom(
                    msg.sender,
                    address(this),
                    uint256(token2Amt)
                )
            ) revert TransferToEscrowError();
            orderInfo.sellingTokenAmt = token2Amt;
            orderInfo.buyingTokenAmt = token1Amt;
        }

        orderInfo.owner = msg.sender;
        orderInfo.sellingToken1 = sellingToken1;
        orderInfo.priceRatio = priceRatio;
        orderInfo.biggerToken = biggerToken;
        id = ++_next_id; // Get new order id.
        orders[id] = orderInfo;
        activeOrders[id] = 1; // Set order to active

        emit OfferCreate(
            token1,
            token2,
            sellingToken1,
            token1Amt,
            token2Amt,
            id,
            msg.sender
        );
    }
}
