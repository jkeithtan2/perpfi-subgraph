import { BigInt, Address, TypedMap } from "@graphprotocol/graph-ts"
import { Amm } from "../../generated/schema"

export let BI_ZERO = BigInt.fromI32(0)

let addressMapping = new TypedMap<string, string>() 
addressMapping.set("0x8d22f1a9dce724d8c1b4c688d75f17a2fe2d32df", "ETH/USDC")
addressMapping.set("0x0f346e19f01471c02485df1758cfd3d624e399b4", "BTC/USDC")  

/** 
   enum Dir { ADD_TO_AMM, REMOVE_FROM_AMM } from Amm.sol
   _dirOfQuote ADD_TO_AMM for long, REMOVE_FROM_AMM for short
**/
let getSwapDirectionMapping = new TypedMap<number, string>()
getSwapDirectionMapping.set(0, "long")
getSwapDirectionMapping.set(1, "short")

export function getSwapDirection(dir: number): string {
  return getSwapDirectionMapping.get(dir) as string
}

export function addressToPair(ammAddress: Address): string {
  return addressMapping.get(parseAmmId(ammAddress)) as string
}


export function getAmm(ammAddress: Address): Amm {
  let amm = Amm.load(parseAmmId(ammAddress))
  if (!amm) {
    amm = createAmm(ammAddress)
  }
  return amm!
}


export function createAmm(ammAddress: Address): Amm {
  let amm = new Amm(parseAmmId(ammAddress))
  amm.address = ammAddress
  amm.symbol = addressToPair(ammAddress)
  amm.quoteAssetReserve = BI_ZERO
  amm.baseAssetReserve = BI_ZERO
  amm.blockNumber = BI_ZERO
  amm.timestamp = BI_ZERO
  amm.save()
  return amm
}

export function parseAmmId(ammAddress: Address): string {
  return ammAddress.toHexString()
}