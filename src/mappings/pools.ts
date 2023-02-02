import {BatchHandlerContext} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import * as poolAbi from '../abi/pool'
import {Store_} from '../db'
import {PoolsRegistry} from '../utils'
import {processItem} from '../utils/tools'

type Item =
    | LogItem<{
          evmLog: {
              topics: true
              data: true
          }
      }>
    | TransactionItem

export async function processPools(ctx: BatchHandlerContext<Store_, Item>): Promise<void> {
    let registry = PoolsRegistry.getRegistry()
    processItem(ctx.blocks, (block, item) => {
        if (!registry.has(item.address)) return
        if (item.kind !== 'evmLog') return

        switch (item.evmLog.topics[0]) {
            case poolAbi.events.Initialize.topic: {
                const {sqrtPriceX96, tick} = poolAbi.events.Initialize.decode(item.evmLog)

                ctx.store.PoolInitialize.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    sqrtPriceX96: sqrtPriceX96.toBigInt(),
                    tick,
                })
                return
            }
            case poolAbi.events.Mint.topic: {
                const {sender, owner, amount, amount0, amount1, ...data} = poolAbi.events.Mint.decode(item.evmLog)

                ctx.store.PoolMint.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    sender: sender.toLowerCase(),
                    owner: owner.toLowerCase(),
                    amount: amount.toBigInt(),
                    amount0: amount0.toBigInt(),
                    amount1: amount1.toBigInt(),
                    ...data,
                })
                return
            }
            case poolAbi.events.Burn.topic: {
                const {owner, amount, amount0, amount1, ...data} = poolAbi.events.Burn.decode(item.evmLog)

                ctx.store.PoolBurn.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    owner: owner.toLowerCase(),
                    amount: amount.toBigInt(),
                    amount0: amount0.toBigInt(),
                    amount1: amount1.toBigInt(),
                    ...data,
                })
                return
            }
            case poolAbi.events.Swap.topic: {
                const {sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, ...data} =
                    poolAbi.events.Swap.decode(item.evmLog)

                ctx.store.PoolSwap.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    sender: sender.toLowerCase(),
                    recipient: recipient.toLowerCase(),
                    amount0: amount0.toBigInt(),
                    amount1: amount1.toBigInt(),
                    sqrtPriceX96: sqrtPriceX96.toBigInt(),
                    liquidity: liquidity.toBigInt(),
                    ...data,
                })
                return
            }
        }
    })
}
