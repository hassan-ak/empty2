// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../MatchingEngine.sol";

contract MatchingEngineMock is MatchingEngine {
    uint256 public currentOrderId;
    uint256 public selectedToken;
    bool public orderDeleted;

    constructor(
        ERC20 _token1,
        ERC20 _token2,
        address _feeAddr,
        uint128 _takerFee,
        uint128 _makerFee
    ) MatchingEngine(_token1, _token2, _feeAddr, _takerFee, _makerFee) {}

    function insertFirstOrder(uint256 id, uint8 orderType) external {
        _insertFirstOrder(id, orderType);
    }
}
