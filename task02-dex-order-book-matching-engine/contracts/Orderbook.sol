// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A decentralized orderbook
/// @author Hassan Ali Khan
/// @notice This contract is based on OasisDex
contract OrderBook {
    ERC20 public token1;
    ERC20 public token2;
    address public feeAddr;
    uint128 public takerFee;
    uint128 public makerFee;

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
}
