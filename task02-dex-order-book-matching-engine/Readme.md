# OrderBook

1. When deployed need to provide ERC20 token1, token2, feeAddr, taker and maker fee
2. getTakerFee returns taker fee percentage and can be callable by any one, don't change state of the contract
3. setTakerFee let owner change taker fee but should be less than 50%
4. getMakerFee returns maker fee percentage and can be callable by any one, don't change state of the contract
5. setMakrFee let owner change maker fee but should be less than 50%
6. \_make let user to add new order to the order book
   1. require amount of both token, price ratio and bigger token along with sellingToken
   2. if selling token specified other than token pair revert with error
   3. if amount for any token is 0 revert with error
   4. if unable to send to esscrow revert with error
   5. Save order details
   6. Set order as active
   7. emit evemts
7. \_cancel let user to cancel order from order book
   1. require order id
   2. working only when order is active else reverts
   3. working only when called by owner else reverts
   4. return escrowed token else reverts
   5. emit events
   6. Delete order from orders
   7. mark as in active
8. viewOffer let user check details of an offer
   1. require order id
   2. working only when order is active else reverts
   3. return offer details
9. _buyOrder
   1. orderid and token amount as arguments
## Questions regarding OrerBook

1. Why using onchain, who is going to pay for the gass fee
2. For each order why need to tell which token is bigger and why set price ratio as it changes every second, how it is going to be updated
3. Why both price ratio and bigger token required, it might change any time
4. Why send to esscrow (how to bear gass fee)
5. no need to emit when order canceled or need to change parameters
