# OrderBook and Matching Engine

# Matching Engine

1.  \_insertFirstOrder()

- orderId and orderType as argument
- set values of asks / bids list parameters for first order
- used for first active order on the list

  ```md
  1st order

  | map(id) | id  | prev | next |
  | :-----: | :-: | :--: | :--: |
  |    0    |  0  |  2   |  6   |
  |    1    |  0  |  0   |  0   |
  |    2    |  2  |  3   |  0   |
  |    3    |  3  |  4   |  2   |
  |    4    |  4  |  5   |  3   |
  |    5    |  5  |  6   |  4   |
  |    6    |  6  |  0   |  5   |
  |    7    |  7  |  0   |  0   |
  ```

1.  \_insertOrderAtPosition()

- orderId, orderType and insertPos as argument
- set values of asks / bids list parameters at particular pos

  ```md
  pos order

  | map(id) | id  | prev | next |
  | :-----: | :-: | :--: | :--: |
  |    0    |  0  |  2   |  6   |
  |    1    |  0  |  0   |  0   |
  |    2    |  2  |  3   |  0   |
  |    3    |  3  |  7   |  2   |
  |    4    |  4  |  5   |  7   |
  |    5    |  5  |  6   |  4   |
  |    6    |  6  |  0   |  5   |
  |    7    |  7  |  4   |  3   |
  ```
