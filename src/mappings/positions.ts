import {BatchHandlerContext} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import * as positionsAbi from './../abi/NonfungiblePositionManager'
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

export async function processPositions(ctx: BatchHandlerContext<Store_, Item>): Promise<void> {
    let registry = PoolsRegistry.getRegistry()
    processItem(ctx.blocks, (block, item) => {
        if (!registry.has(item.address)) return
        if (item.kind !== 'evmLog') return

        switch (item.evmLog.topics[0]) {
            case positionsAbi.events.IncreaseLiquidity.topic: {
                const {tokenId, liquidity, amount0, amount1} = positionsAbi.events.IncreaseLiquidity.decode(item.evmLog)

                ctx.store.PositionIncreaseLiquidity.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    tokenId: tokenId.toBigInt(),
                    liquidity: liquidity.toBigInt(),
                    amount0: amount0.toBigInt(),
                    amount1: amount1.toBigInt(),
                })
                return
            }
            case positionsAbi.events.DecreaseLiquidity.topic: {
                const {tokenId, liquidity, amount0, amount1} = positionsAbi.events.DecreaseLiquidity.decode(item.evmLog)

                ctx.store.PositionIncreaseLiquidity.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    tokenId: tokenId.toBigInt(),
                    liquidity: liquidity.toBigInt(),
                    amount0: amount0.toBigInt(),
                    amount1: amount1.toBigInt(),
                })
                return
            }
            case positionsAbi.events.Collect.topic: {
                const {tokenId, amount0, amount1, recipient} = positionsAbi.events.Collect.decode(item.evmLog)

                ctx.store.PositionCollect.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    tokenId: tokenId.toBigInt(),
                    recipient: recipient.toLowerCase(),
                    amount0: amount0.toBigInt(),
                    amount1: amount1.toBigInt(),
                })
                return
            }
            case positionsAbi.events.Transfer.topic: {
                const {tokenId, from, to} = positionsAbi.events.Transfer.decode(item.evmLog)

                ctx.store.PositionTransfer.write({
                    blockNumber: block.height,
                    timestamp: new Date(block.timestamp),
                    contractAddress: item.address,
                    tokenId: tokenId.toBigInt(),
                    from: from.toLowerCase(),
                    to: to.toLowerCase(),
                })
                return
            }
        }
    })
}
