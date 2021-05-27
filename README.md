PerpFi subgraphs examples
===========

The graph indexing perpfi example. Runs on self-hosted graph node (similar to being a graph indexer https://thegraph.com/docs/network#indexing). To run on graph hosted service, skip section "Run self-hosted graph node via docker"  


## Installations
install Docker, docker compose, node and npm 

Afterwhich :

  ```
  npm install -g yarn
  ```
  ```
  yarn global add @graphprotocol/graph-cli
  ```


## Run self-hosted graph node via docker

Run via docker compose. 
```
cd CLONED_DIR/docker
```
```
docker compose up
```
Do note that even though perpentual protocol is on xdai, when running
graph node locally, docker-compose config has to be set as with the portion after "mainnet" being the xdai rpc endpoint (https://www.xdaichain.com/for-developers/developer-resources) 

For example:
```
ethereum: 'mainnet:https://rpc.xdaichain.com/'
```

Use an infura/alchemy endpoint to get blocks from eth mainnet

```
ethereum: 'mainnet:https://eth-mainnet.alchemyapi.io/v2/<YOUR API KEY>'
```

To restart the local graph node
```
docker compose stop
```
```
sh ./clear_state.sh
```

### Deploying subgraph to graph node
Ensure graph node is running. Change package.json configs depending on graph node endpoint. Below commands assume running locally

Install dependencies of your subgraph and run the Graph CLI code generation
```
yarn && yarn codegen
```
allocate the subgraph name in the Graph Node with
```
yarn create-local
```
deploy subgraph to graph node with
```
yarn deploy-local
```

### Query subgraph
The subgraph should be queryable at http://127.0.0.1:8000/subgraphs/name/perpfi/perp-protocol-subgraph

Example querys:

Get all indexed AMMs:
```
{
  amms {
    id
    symbol
  }
}
```

Get info for one of the indexed AMM:
```
{
	amm(id: "0x0f346e19f01471c02485df1758cfd3d624e399b4") {
  	id
    address
    symbol
    quoteAssetReserve
    baseAssetReserve
    blockNumber
    timestamp
	}
}
```

Get all recent swaps:
```
{
	swaps(orderBy: blockNumber orderDirection: desc){
    id
    address
    symbol
    direction
    quoteAssetAmount
    baseAssetAmount
  }
}

```


Get all funding rate events by recency 
```
{
	fundingRateUpdatedEvents(orderBy: blockNumber orderDirection: desc) {
    id
    symbol
    amm
    rate
    underlyingPrice
    blockNumber
    timestamp
  }
}
```


### Misc info
Perpentual protocol uses proxy contracts. 

ETH/USDC proxy contract @ https://blockscout.com/poa/xdai/address/0x7B479a0a816ca33F8EB5A3312d1705a34d2d4C82

ETH/USDC impl contract @ https://blockscout.com/poa/xdai/address/0xf8Bc804BB6b4485C4fbC807cbed14cF64a76e0A1

subgraph.yaml contract source should be the proxy contracts. Use https://github.com/perpetual-protocol/perp-cli/ to get AMM address information