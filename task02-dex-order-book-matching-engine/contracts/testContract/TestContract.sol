// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../Orderbook.sol";

contract TestContract is OrderBook {
    uint256 public currentOrderId;
    uint256 public selectedToken;


    constructor(
        ERC20 _token1,
        ERC20 _token2,
        address _feeAddr,
        uint128 _takerFee,
        uint128 _makerFee
    ) OrderBook(_token1, _token2, _feeAddr, _takerFee, _makerFee) {}

    function cancelOrder(uint256 id) external returns (uint256) {
        uint256 result = _cancel(id); // Call the internal function
        selectedToken = result;
        return result;
    }

    function makeOrder(
        uint128 token1Amt,
        uint128 token2Amt,
        uint256 priceRatio,
        uint8 biggerToken,
        uint8 sellingToken1
    ) external returns (uint256) {
        uint256 result = _make(
            token1Amt,
            token2Amt,
            priceRatio,
            biggerToken,
            sellingToken1
        ); // Call the internal function
        currentOrderId = result;
        return result;
    }
}
