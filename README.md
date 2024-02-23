# Awesome-Web3 PubSub

Awesome-web3 PubSub makes consuming and processing blockchain events easy.  All you need is to 
1. setup a subscription to a *topic* with a filter on *attributes*, and
2. listen for fully decoded events.

No need for nodes, RPCs, APIs or any kind of complex decoding!   

All resources for `awesome-web3` are graciously provided by Google Cloud Web3.    
This is currently in PoC but is available to `allAuthenticated` users.  

Below is basic documentation to get started on the available topics, the attributes for each topic, and some sample filters on those attributes.

If you would like to contribute your topics or add your useful filters to this repo, join us on Telegram at [https://t.me/awesomeweb3](https://t.me/awesomeweb3).

## Quick Start Guide

### 1. Setup a subscription to a `awesome-web3` topic.

Here are list of full paths to 4 Ethereum PubSub topics: 

* `projects/awesome-web3/topics/ethereum_blocks_raw`
* `projects/awesome-web3/topics/ethereum_transactions_raw`
* `projects/awesome-web3/topics/ethereum_traces_raw`
* `projects/awesome-web3/topics/ethereum_token_transfers_raw`

This is the full string that you can put the topic field in the subscriptions UI.

Chain support is limited to Ethereum currently.


### 2.  Define a filter

Depending on which topic you select, you can [filter on any of the attributes](https://cloud.google.com/pubsub/docs/subscription-message-filter).   Note that filters are up to 256 characters only so multiple subscriptions might be required for complex filters.

For example, to monitor all USDT transfers, use the following filter on `ethereum_token_transfers_raw` topic:

```
attributes.symbol = "USDT"  AND attributes.token_address = "0xdac17f958d2ee523a2206206994597c13d831ec7"
```

You can set up a subscription `ethereumusdt`.  The `projects/awesome-web3/subscriptions/ethereum_token_transfers_usdt` subscription has this exact filter.

Here are some useful subscriptions: 

```
projects/awesome-web3/subscriptions/ethereum_token_transfers_usdt
projects/awesome-web3/subscriptions/ethereum_logs_tokenexchange
projects/awesome-web3/subscriptions/ethereum_logs_raw_uniswapv2
projects/awesome-web3/subscriptions/ethereum_log_nft_transfer
```

See below for message schemas and filter attributes for all 4 topics. 

### Sample Node.js Code

Once you have set up a subscription, you can send the data to a Google Cloud Storage bucket, a Google BigQuery table, or process it with a script.

Assuming you have set up a `ethereumusdt` subscription in your Google Cloud account (see above), the following Node.js script will enable you to capture the message and do some further analysis:

```
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub({ projectId: 'awesome-web3' });
async function subscribeWithFilter() {
    const subscription = pubsub.subscription('ethereumusdt');
    const messageHandler = (message) => {
      try {
	      const data = JSON.parse(Buffer.from(message.data, 'base64').toString('utf-8'));
	    } catch (error) {
	      console.error('Error processing message:', error);
	    }
	    message.ack();
    };
    subscription.on('message', messageHandler);
    console.log(`Listening for messages on subscription: ${subscriptionName}`);
}
subscribeWithFilter();
```

## Messages Schemas, Supported Filter Attributes 

#### logs

*Message Schema*:

| Attribute              | Type               | Description                                                                                               |
|------------------------|--------------------|-----------------------------------------------------------------------------------------------------------|
| chain_id               | Integer            | The ID of the blockchain chain.                                                                           |
| id                     | String             | The identifier for the blockchain (e.g., Ethereum).                                                      |
| log_index              | Integer            | The index of the log entry.                                                                              |
| transaction_hash       | String             | The hash of the transaction.                                                                             |
| transaction_index      | Integer            | The index of the transaction within the block.                                                           |
| address                | String             | The address associated with the transaction.                                                            |
| creator_address        | String             | The creator's address.                                                                                   |
| tx_from_address        | String             | The address from which the transaction originates.                                                      |
| data                   | String             | The data associated with the transaction.                                                               |
| topics                 | Array of Strings   | An array of topic strings.                                                                               |
| block_timestamp        | Integer            | The timestamp of the block.                                                                              |
| block_number           | Integer            | The number of the block.                                                                                 |
| block_hash             | String             | The hash of the block.                                                                                   |
| signature              | String             | The signature associated with the transaction.                                                          |
| from_address           | String             | The sender's address.                                                                                    |
| to_address             | String             | The recipient's address.                                                                                 |
| to_creator_address     | String             | The recipient's creator address.                                                                         |
| to_tx_from_address     | String             | The recipient's transaction from address.                                                               |
| decoded                | Array of Objects   | An array of objects containing decoded information.                                                     |
| decoded_error          | Null or String     | An error message if decoding fails, otherwise null.                                                     |
| is_decoded             | Boolean            | Indicates whether the decoding was successful (true) or not (false).                                    |

*Sample Message*:
```
{
  chain_id: 1,
  id: 'ethereum',
  log_index: 0,
  transaction_hash: '0xceeb92b8e6ea6b212c26752d1f22d7a89bd2d52655e131c9901d6c38d641daf2',
  transaction_index: 1,
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  creator_address: '0x95ba4cf87d6723ad9c0db21737d862be80e93911',
  tx_from_address: '0x95ba4cf87d6723ad9c0db21737d862be80e93911',
  data: '0x0000000000000000000000000000000000000000000000000000000218711a00',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x000000000000000000000000fdc9d4b7c4850aafbe18a3d697447eb8f01c27dd',
    '0x00000000000000000000000024005928ef84d66c2c6739e0786d6bc1a6276e2a'
  ],
  block_timestamp: 1706661779,
  block_number: 19122974,
  block_hash: '0xef3794a6a9bf2a5c7f7dfcfc1c70e31182b7cb843a11176ff329fb297279778e',
  signature: 'Transfer(address,address,uint256)',
  from_address: '0xfdc9d4b7c4850aafbe18a3d697447eb8f01c27dd',
  to_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  to_creator_address: '0x95ba4cf87d6723ad9c0db21737d862be80e93911',
  to_tx_from_address: '0x95ba4cf87d6723ad9c0db21737d862be80e93911',
  decoded: [
    {
      name: 'from',
      type: 'address',
      value: '0xFDc9D4B7C4850aafbe18A3d697447Eb8F01c27Dd'
    },
    {
      name: 'to',
      type: 'address',
      value: '0x24005928EF84D66c2c6739e0786d6Bc1A6276E2A'
    },
    {
      name: 'value',
      type: 'uint256',
      value: '9000000000',
      value_float: 9000,
      price_usd: 0.997902,
      value_usd: 8981.118,
      token_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      token_symbol: 'USDC'
    }
  ],
  decoded_error: null,
  is_decoded: true
}
```

Supported Filter Attributes:

| Attribute          | Desc                                                |
|--------------------|-----------------------------------------------------|
| insert_id          | Uniquely identifying this message (TODO: requires de-duplication) |
| chain              | Identifying the chain                                |
| msg_type           | Message type (same as the topic name)                |
| timestamp          | Timestamp where the message is generated (might be different than the actual publish time) |
| finalized          | Indicates if the message is finalized (or not). Currently, only unfinalized messages are published |
| block_hash         | Block hash identifying where the message belongs to |
| log_index          | The index position within the block                  |
| transaction_hash   | Transaction hash identifying the origin of the events |
| transaction_index  | The transaction index within the block               |
| address            | The contract address                                |
| creator_address    | Creator of the message                               |
| topic0             | Used to identify a certain event on the chain        |
| topic_length       | Used to eliminate certain ambiguous cases when topic0 has collision |
| signature          | Derived from topic0, if available                    |

#### Examples of `logs` filtering:

*   Uniswapv2 Swap events: filter on `topic0`

```
attributes.topic0="0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
```

* Curve's TokenExchange: filter on `signatures` 

```
hasPrefix(attributes.signature, "TokenExchange")
```

* Filter ENS events: filter on contract address using `address`

```
attributes.address="0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
```

* Filter on all Uniswap events by contract `creator`

```
attributes.creator="0x1f98431c8ad98523631ae4a59f267346ea31f984"
```

### transactions

**Transaction Schema**:

| Attribute                       | Type             | Description                                                    |
|----------------------------------|------------------|----------------------------------------------------------------|
| `transaction_hash`              | String           | Hash identifying the transaction.                              |
| `value_lossless`                | Integer          | The value of the transaction in the smallest unit of the currency (wei in Ethereum). |
| `value`                          | Float            | The value of the transaction in the base currency.             |
| `chain_id`                       | Integer          | ID of the blockchain where the transaction occurred.           |
| `id`                             | String           | Identifier for the blockchain (e.g., 'ethereum').             |
| `nonce`                          | Integer          | A unique number assigned to the transaction sender to prevent replay attacks. |
| `transaction_index`              | Integer          | Index representing the transaction within a block.            |
| `from_address`                   | String           | Sender's address.                                              |
| `to_address`                     | String           | Receiver's address.                                            |
| `to_creator_address`             | Null or String   | Creator's address (if applicable).                             |
| `to_tx_from_address`             | Null or String   | Transaction sender's address (if applicable).                 |
| `gas`                            | Integer          | Gas limit for the transaction.                                  |
| `gas_price`                      | Integer          | Price of gas in wei.                                           |
| `input`                          | String           | Input data for the transaction.                                 |
| `receipt_cumulative_gas_used`    | Integer          | Cumulative gas used up to the current transaction.             |
| `receipt_gas_used`               | Integer          | Gas used by the transaction.                                    |
| `receipt_contract_address`       | Null or String   | Contract address (if applicable).                              |
| `receipt_root`                   | Null or String   | Root of the receipt (if applicable).                           |
| `receipt_status`                 | Integer          | Status of the transaction receipt (1 for success, 0 for failure). |
| `block_timestamp`                | Integer          | Timestamp of the block containing the transaction.             |
| `block_number`                   | Integer          | Block number containing the transaction.                       |
| `block_hash`                     | String           | Hash of the block containing the transaction.                  |
| `max_fee_per_gas`                | Null or String   | Maximum fee per gas (if applicable).                           |
| `max_priority_fee_per_gas`       | Null or String   | Maximum priority fee per gas (if applicable).                  |
| `transaction_type`               | Integer          | Type of transaction.                                           |
| `receipt_effective_gas_price`    | Integer          | Effective gas price for the transaction.                       |
| `fee`                            | Float            | Fee associated with the transaction.                           |
| `txn_saving`                     | Null or String   | Transaction saving information (if applicable).               |
| `burned_fee`                     | Float            | Burned fee during the transaction.                              |
| `is_decoded`                     | Boolean          | Indicates whether the transaction is decoded.                  |
| `decoded_error`                  | Null or String   | Decoding error message (if applicable).                        |
| `method_id`                      | Null or String   | Method identifier (if applicable).                              |
| `decoded`                        | Null or String   | Decoded information (if applicable).                           |
| `r`                              | String           | R component of the transaction signature.                      |
| `s`                              | String           | S component of the transaction signature.                      |
| `v`                              | String           | V component of the transaction signature.                      |
| `signature`                      | String           | Signature type (e.g., 'nativeTransfer').                       |
| `access_list`                    | Array            | List of addresses with access to the transaction.              |

Sample Message:
```
{
  transaction_hash: '0x2282887986c6063854c99430bae64f33af029da75e7f3e2914715ac95173a9b8',
  value_lossless: 60000000000000000,
  value: 0.06,
  chain_id: 1,
  id: 'ethereum',
  nonce: 43290,
  transaction_index: 0,
  from_address: '0x083d7668e578f3938f84d9a2b75a5292d9873ca8',
  to_address: '0x03bd27c5f5b6784f9350a551387aef75120a8650',
  to_creator_address: null,
  to_tx_from_address: null,
  gas: 250000,
  gas_price: 32000000000,
  input: '0x',
  receipt_cumulative_gas_used: 21000,
  receipt_gas_used: 21000,
  receipt_contract_address: null,
  receipt_root: null,
  receipt_status: 1,
  block_timestamp: 1706661779,
  block_number: 19122974,
  block_hash: '0xef3794a6a9bf2a5c7f7dfcfc1c70e31182b7cb843a11176ff329fb297279778e',
  max_fee_per_gas: null,
  max_priority_fee_per_gas: null,
  transaction_type: 0,
  receipt_effective_gas_price: 32000000000,
  fee: 0.000672,
  txn_saving: null,
  burned_fee: 0,
  is_decoded: true,
  decoded_error: null,
  method_id: null,
  decoded: null,
  r: '0x27bd98e260621db9e8edbd374506f62d60b890a750d7da9b36a8bb4eacb1e916',
  s: '0x2279db3baadf89a0b4275037cef3d7c401cfa0b94bcb254b04a6ee7346febd39',
  v: '0x26',
  signature: 'nativeTransfer',
  access_list: []
}
```

Supported Filter Attributes:

| Attributes      | Desc                                                              |
|-----------------|-------------------------------------------------------------------|
| insert_id       | Uniquely identifying this msg (TODO: requires de-duplication)    |
| chain           | Identifying the chain                                             |
| msg_type        | Msg_type                                                          |
| timestamp       | Timestamp where the msg is generated (might be different than the actual publish time) |
| finalized       | Is msg finalized (or not). Currently, we only publish unfinalized msg |
| block_hash      | Block_hash identifying where the msg belongs to                   |
| from_address    | Sender/signer of the txn                                          |
| to_address      | Recipient of the msg                                               |
| receipt_status  | Transaction status {success, failed}                             |
| method_id       | 4bytes identifier from txninput                                   |
| signature       | Decoded_signature using method_id, if available                   |


#### Examples:

* transfers between `from_address` and `to_address`

```
attributes.from_address="0x28c6c06298d514db089934071355e5743bf21d60"  
AND attributes.to_address="0x28c6c06298d514db089934071355e5743bf21d60"
```

*  L2 Transfers of `depositETH` 

```
hasPrefix(attributes.signature, "depositETH")  
```

*  _Successful_ swap transactions of 1inch router V5
```
attributes.to_address="0x1111111254eeb25477b68fb85ed929f73a960582"  
AND attributes.receipt_status= '1'
```

### token_transfers

**Message Schema**:

| Attribute              | Description                                                            |
|------------------------|------------------------------------------------------------------------|
| chain_id               | The identifier for the blockchain network. (E.g., 1 for Ethereum mainnet) |
| id                     | Unique identifier for the blockchain or token. (E.g., 'ethereum')      |
| token_address          | The address of the ERC-20 token on the Ethereum blockchain.            |
| from_address           | Ethereum address from which the transaction originated.                |
| to_address             | Ethereum address to which the transaction was sent.                    |
| value                  | Value of the transaction as a string. (E.g., '9000000000')             |
| transaction_hash       | Unique identifier for the transaction.                                  |
| log_index              | Index of the transaction log.                                           |
| block_timestamp        | Timestamp of the block in which the transaction was included.          |
| block_number           | Block number in which the transaction was included.                    |
| block_hash             | Unique identifier for the block containing the transaction.            |
| token_type             | Type of token. (E.g., 'ERC20')                                          |
| value_float            | Value of the transaction as a floating-point number. (E.g., 9000)      |
| price_usd              | Price of the token in USD.                                              |
| value_usd              | Value of the transaction in USD.                                        |
| token_address_info     | Additional information about the ERC-20 token.                         |
| - name                 | The name of the token. (E.g., 'USD Coin')                               |
| - symbol               | The symbol or ticker of the token. (E.g., 'USDC')                       |
| - decimals             | Number of decimal places used for the token. (E.g., 6)                  |


**Sample Message**:

```
{
  chain_id: 1,
  id: 'ethereum',
  token_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  from_address: '0xfdc9d4b7c4850aafbe18a3d697447eb8f01c27dd',
  to_address: '0x24005928ef84d66c2c6739e0786d6bc1a6276e2a',
  value: '9000000000',
  transaction_hash: '0xceeb92b8e6ea6b212c26752d1f22d7a89bd2d52655e131c9901d6c38d641daf2',
  log_index: 0,
  block_timestamp: 1706661779,
  block_number: 19122974,
  block_hash: '0xef3794a6a9bf2a5c7f7dfcfc1c70e31182b7cb843a11176ff329fb297279778e',
  token_type: 'ERC20',
  value_float: 9000,
  price_usd: 0.997902,
  value_usd: 8981.118,
  token_address_info: { name: 'USD Coin', symbol: 'USDC', decimals: 6 }
}
```

Supported Filter Attributes:

| Attributes       | Desc                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| insert_id        | Uniquely identifying this message (TODO: requires de-duplication)                      |
| chain            | Identifying the chain                                                                   |
| msg_type         | Message type                                                                           |
| timestamp        | Timestamp where the message is generated (might be different than the actual publish time) |
| finalized        | Indicates if the message is finalized (or not). Currently, we only publish unfinalized messages |
| token_address    | Block hash identifying where the message belongs to                                      |
| from_address     | Sender of the token transfer                                                           |
| to_address       | Recipient of the token transfer                                                        |
| token_type       | Token type (ERC20 or ERC721 or ERC 1155)                                               |
| transaction_hash | The transaction index position within the block                                         |
| log_index        | The log index position within the block                                                |
| symbol           | Token symbol                                                                           |
| decimals         | Token decimals                                                                         |
| value            | For ERC20: token amount (raw), For ERC721: token ID                                     |

#### Examples

* monitor all USDT transfers
```
attributes.symbol = "USDT"  AND attributes.token_address = "0xdac17f958d2ee523a2206206994597c13d831ec7"
```
* monitor ERC721 transfers
```
attributes.token_type = "ERC721"
```
* monitor token transfers to exchanges
```
attributes.token_address = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"  
AND attributes.to_address = "{exchange}"
```


### traces

**Traces Schema**:
| Attribute              | Type        | Description                                                                       |
|------------------------|-------------|-----------------------------------------------------------------------------------|
| `chain_id`             | Integer     | Represents the identifier of the blockchain chain.                                |
| `id`                   | String      | Represents the identifier of the blockchain (e.g., Ethereum).                     |
| `transaction_hash`     | String      | Represents the unique identifier/hash of the transaction.                           |
| `transaction_index`    | Integer     | Represents the index of the transaction.                                          |
| `action`               | Object      | Contains details about the action performed in the transaction.                    |
| `action.call_type`     | String      | Specifies the type of call.                                                       |
| `action.from_address`  | String      | Represents the sender's address.                                                  |
| `action.to_address`    | String      | Represents the recipient's address.                                               |
| `action.gas`           | String      | Represents the amount of gas used in the transaction.                              |
| `action.input`         | String      | Represents the input data for the transaction.                                    |
| `action.value_lossless`| String      | Represents the value in a lossless format.                                        |
| `action.value`         | Float       | Represents the value in a human-readable format.                                  |
| `action.decoded`       | Null        | Represents decoded information (null in this case).                                |
| `action.from_creator_address` | Null | Represents the creator's address (null in this case).                             |
| `action.from_tx_from_address` | Null | Represents the transaction creator's address (null in this case).                |
| `action.to_creator_address` | Null   | Represents the recipient creator's address (null in this case).                   |
| `action.to_tx_from_address` | Null   | Represents the recipient transaction creator's address (null in this case).      |
| `action.is_decoded`    | Boolean     | Indicates whether the action is decoded (true in this case).                      |
| `action.signature`     | String      | Represents the signature (e.g., "nativeTransfer").                                |
| `result`               | Object      | Contains details about the result of the transaction.                              |
| `result.address`       | Null        | Represents the address (null in this case).                                        |
| `result.code`          | Null        | Represents the code (null in this case).                                           |
| `result.output`        | Null        | Represents the output (null in this case).                                         |
| `result.gas_used`      | String      | Represents the amount of gas used.                                                |
| `result.decoded_output`| Object      | Represents decoded output information.                                            |
| `result.is_decoded_output`| Boolean  | Indicates whether the output is decoded.                                          |
| `error`                | Null        | Represents any error (null in this case).                                         |
| `error_reason`         | Null        | Represents the reason for any error (null in this case).                           |
| `trace_type`           | String      | Represents the type of trace (e.g., "call").                                      |
| `subtrace_count`       | Integer     | Represents the count of subtraces.                                                |
| `trace_address`        | Array       | Represents the trace address.                                                     |
| `trace_id`             | String      | Represents the unique identifier/hash of the trace.                               |
| `block_timestamp`      | Integer     | Represents the timestamp of the block.                                            |
| `block_number`         | Integer     | Represents the number of the block.                                               |
| `block_hash`           | String      | Represents the unique identifier/hash of the block.                               |

**Sample Message**:
```
{
    "chain_id": 1,
    "id": "ethereum",
    "transaction_hash": "0x2282887986c6063854c99430bae64f33af029da75e7f3e2914715ac95173a9b8",
    "transaction_index": 0,
    "action": {
        "call_type": "call",
        "from_address": "0x083d7668e578f3938f84d9a2b75a5292d9873ca8",
        "to_address": "0x03bd27c5f5b6784f9350a551387aef75120a8650",
        "gas": "229000",
        "input": "0x",
        "value_lossless": "60000000000000000",
        "value": 0.06,
        "decoded": null,
        "from_creator_address": null,
        "from_tx_from_address": null,
        "to_creator_address": null,
        "to_tx_from_address": null,
        "is_decoded": true,
        "signature": "nativeTransfer"
    },
    "result": {
        "address": null,
        "code": null,
        "output": null,
        "gas_used": "21000",
        "decoded_output": {
            "methodID": null,
            "txInput": "0x",
            "txOutput": null,
            "decodeStatus": "empty",
            "signature": ""
        },
        "is_decoded_output": false
    },
    "error": null,
    "error_reason": null,
    "trace_type": "call",
    "subtrace_count": 0,
    "trace_address": [],
    "trace_id": "call_0x2282887986c6063854c99430bae64f33af029da75e7f3e2914715ac95173a9b8_",
    "block_timestamp": 1706661779,
    "block_number": 19122974,
    "block_hash": "0xef3794a6a9bf2a5c7f7dfcfc1c70e31182b7cb843a11176ff329fb297279778e"
}
```

Supported Filter Attributes: (Under construction)

| Attributes       | Desc                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| `action`               | Object      | Contains details about the action performed in the transaction.                    |
| `action.call_type`     | String      | Specifies the type of call.                                                       |
| `action.from_address`  | String      | Represents the sender's address.                                                  |
| `action.to_address`    | String      | Represents the recipient's address.                                               |
| `action.gas`           | String      | Represents the amount of gas used in the transaction.                              |
| `action.input`         | String      | Represents the input data for the transaction.                                    |
| `action.value_lossless`| String      | Represents the value in a lossless format.                                        |
| `action.value`         | Float       | Represents the value in a human-readable format.                                  |
| `action.decoded`       | Null        | Represents decoded information (null in this case).                                |
| `action.from_creator_address` | Null | Represents the creator's address (null in this case).                             |
| `action.from_tx_from_address` | Null | Represents the transaction creator's address (null in this case).                |
| `action.to_creator_address` | Null   | Represents the recipient creator's address (null in this case).                   |
| `action.to_tx_from_address` | Null   | Represents the recipient transaction creator's address (null in this case).      |
| `action.is_decoded`    | Boolean     | Indicates whether the action is decoded (true in this case).                      |
| `action.signature`     | String      | Represents the signature (e.g., "nativeTransfer").                                |


### Requests for Topics/Attributes/Filters

If you have requests for new attributes or sample filters, add them here:
* Large Value transfers
* Gas Limit Excess
* AML Filters
