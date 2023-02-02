import {BatchHandlerContext, assertNotNull} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import * as factoryAbi from '../abi/factory'
import {Store_} from '../db'
import {PoolsRegistry} from '../utils'
import {FACTORY_ADDRESS} from '../utils/constants'
import {fetchTokensDecimals, fetchTokensName, fetchTokensSymbol, fetchTokensTotalSupply} from '../utils/token'
import {last, processItem} from '../utils/tools'

type Item =
    | LogItem<{
          evmLog: {
              topics: true
              data: true
          }
      }>
    | TransactionItem

let knownTokens = new Set<string>()

export async function processFactory(ctx: BatchHandlerContext<Store_, Item>): Promise<void> {
    let tokens: string[] = []

    processItem(ctx.blocks, (block, item) => {
        if (item.address !== FACTORY_ADDRESS) return
        if (item.kind !== 'evmLog') return
        if (item.evmLog.topics[0] !== factoryAbi.events.PoolCreated.topic) return

        const {
            token0: token0Raw,
            token1: token1Raw,
            pool: poolRaw,
            ...data
        } = factoryAbi.events.PoolCreated.decode(item.evmLog)

        let token0 = token0Raw.toLowerCase()
        let token1 = token1Raw.toLowerCase()
        let pool = poolRaw.toLowerCase()

        ctx.store.FactoryPairCreated.write({
            blockNumber: block.height,
            timestamp: new Date(block.timestamp),
            contractAddress: item.address,
            token0,
            token1,
            pool,
            ...data,
        })

        PoolsRegistry.getRegistry().add(pool)

        if (!knownTokens.has(token0)) {
            tokens.push(token0)
        }

        if (!knownTokens.has(token0)) {
            tokens.push(token1)
        }

        knownTokens.add(token0).add(token1)
    })

    tokens = [...new Set(tokens)]

    let block = last(ctx.blocks).header
    const [symbols, names, totalSupplies, decimals] = await Promise.all([
        fetchTokensSymbol(ctx, block, tokens),
        fetchTokensName(ctx, block, tokens),
        fetchTokensTotalSupply(ctx, block, tokens),
        fetchTokensDecimals(ctx, block, tokens),
    ])

    for (const token of tokens) {
        ctx.store.Tokens.write({
            blockNumber: block.height,
            timestamp: new Date(block.timestamp),
            contractAddress: token,
            name: assertNotNull(names.get(token)),
            symbol: assertNotNull(symbols.get(token)),
            totalSupply: assertNotNull(totalSupplies.get(token)),
            decimals: assertNotNull(decimals.get(token)),
        })
    }
}
