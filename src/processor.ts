import {EvmBatchProcessor} from '@subsquid/evm-processor'
import * as positionsAbi from './abi/NonfungiblePositionManager'
import * as factoryAbi from './abi/factory'
import * as poolAbi from './abi/pool'
import {db} from './db'
import {processFactory} from './mappings/factory'
import {processPools} from './mappings/pools'
import {FACTORY_ADDRESS, POSITIONS_ADDRESS} from './utils/constants'
import {processPositions} from './mappings/positions'

let processor = new EvmBatchProcessor()
    .setBlockRange({from: 12369621})
    .setDataSource({
        archive: 'https://eth.archive.subsquid.io',
        chain: process.env.ETH_CHAIN_NODE,
    })
    .addLog(FACTORY_ADDRESS, {
        filter: [[factoryAbi.events.PoolCreated.topic]],
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
        } as const,
    })
    .addLog([], {
        filter: [
            [
                poolAbi.events.Burn.topic,
                poolAbi.events.Mint.topic,
                poolAbi.events.Initialize.topic,
                poolAbi.events.Swap.topic,
            ],
        ],
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
        } as const,
    })
    .addLog(POSITIONS_ADDRESS, {
        filter: [
            [
                positionsAbi.events.IncreaseLiquidity.topic,
                positionsAbi.events.DecreaseLiquidity.topic,
                positionsAbi.events.Collect.topic,
                positionsAbi.events.Transfer.topic,
            ],
        ],
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
        } as const,
    })

processor.run(db, async (ctx) => {
    await processFactory(ctx)
    await processPools(ctx)
    await processPositions(ctx)
})
