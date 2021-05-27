import {
  FundingRateUpdated, 
  LiquidityChanged,
  ReserveSnapshotted,
  SwapInput
} from "../../generated/AmmBTCUSDC/Amm"
import {
  FundingRateUpdatedEvent, 
  LiquidityChangedEvent,
  Swap
} from "../../generated/schema"
import {
  addressToPair, getAmm, getSwapDirection
} from "./utils"

/* Funding rate/payment event
 */
export function handleFundingRateUpdated(event: FundingRateUpdated): void {
  let entity = new FundingRateUpdatedEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  entity.amm = event.address
  entity.symbol = addressToPair(event.address)
  entity.rate = event.params.rate
  entity.underlyingPrice = event.params.underlyingPrice
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.save()
}

export function handleLiquidityChanged(event: LiquidityChanged): void {
  let entity = new LiquidityChangedEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  entity.amm = event.address
  entity.symbol = addressToPair(event.address)
  entity.quoteReserve = event.params.quoteReserve
  entity.baseReserve = event.params.baseReserve
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.save()
}

export function handleSwap(event: SwapInput) : void {
  let swap = new Swap(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  swap.address = event.address
  swap.symbol = addressToPair(event.address)
  swap.direction = getSwapDirection(event.params.dir)
  swap.baseAssetAmount = event.params.baseAssetAmount
  swap.quoteAssetAmount = event.params.quoteAssetAmount
  swap.save()
}

export function handleReserveSnapshotted(event: ReserveSnapshotted): void {
  let amm = getAmm(event.address)
  amm.baseAssetReserve = event.params.baseAssetReserve
  amm.quoteAssetReserve = event.params.quoteAssetReserve
  amm.blockNumber = event.block.number
  amm.timestamp = event.block.timestamp
  amm.save()
}