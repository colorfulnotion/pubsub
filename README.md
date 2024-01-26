# Getting Started with GC Web3 PubSub

GCWeb3 PubSub makes consuming and processing blockchain events easy.  All you need is to 1. setup a subscription to a *topic* with a filter on *attributes*, and listen for fully decoded events.    No need for nodes, RPCs, APIs or any kind of complex decoding!  

This is currently in PoC but is available to `allAuthenticated` users.


### 1. Setup a subscription to a topic:

All topics are in `awesome-web3` .  Chain support is limited to Ethereum

* [ethereum_logs_raw](https://console.cloud.google.com/cloudpubsub/topic/detail/ethereum_logs_raw?hl=en&project=awesome-web3)
*  [ethereum_token_transfers_raw](https://console.cloud.google.com/cloudpubsub/topic/detail/ethereum_token_transfers_raw?hl=en&project=awesome-web3)
* [ethereum_traces_raw](https://console.cloud.google.com/cloudpubsub/topic/detail/ethereum_traces_raw?hl=en&project=awesome-web3)
* [ethereum_transactions_raw](https://console.cloud.google.com/cloudpubsub/topic/detail/ethereum_transactions_raw?hl=en&project=awesome-web3)

### 2.  Define a filter

Depending on which topic you select, you can [filter on any of the attributes](https://cloud.google.com/pubsub/docs/subscription-message-filter).   Note that filters are up to 256 characters only.

#### logs

Supported Attributes:

| Attribute          | Desc                                                |
|--------------------|-----------------------------------------------------|
| insert_id          | Uniquely identifying this message (TODO: requires de-duplication) |
| chain              | Identifying the chain                                |
| msg_type           | Message type                                        |
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

Supported Attributes:

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

Supported Attributes:

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
attributes.symbol = ''USDT"  AND attributes.token_address = "0xdac17f958d2ee523a2206206994597c13d831ec7"
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



### Requests for Topics/Attributes/Filters

If you have requests for new attributes or sample filters, add them here:
* Large Value transfers
* Gas Limit Excess
* AML Filters





