import assert from 'assert'
import {Database, LocalDest, Store} from '@subsquid/file-store'
import {
    FactoryPairCreated,
    PoolBurn,
    PoolInitialize,
    PoolMint,
    PoolSwap,
    PositionCollect,
    PositionDecreaseLiquidity,
    PositionIncreaseLiquidity,
    PositionTransfer,
    Tokens,
} from './tables'
import {PoolsRegistry} from './utils'
import {S3Dest} from '@subsquid/file-store-s3'

type Metadata = {
    height: number
    pools: string[]
}

export const db = new Database({
    tables: {
        Tokens,
        FactoryPairCreated,
        PoolInitialize,
        PoolMint,
        PoolBurn,
        PoolSwap,
        PositionCollect,
        PositionDecreaseLiquidity,
        PositionIncreaseLiquidity,
        PositionTransfer,
    },
    dest: process.env.DEST === 'S3' ? new S3Dest('./uniswap', 'csv-store') : new LocalDest('./data'),
    hooks: {
        async onConnect(dest) {
            if (await dest.exists('status.json')) {
                let {height, pools}: Metadata = await dest.readFile('status.json').then(JSON.parse)
                assert(Number.isSafeInteger(height))

                let registry = PoolsRegistry.getRegistry()
                for (let pool of pools) {
                    registry.add(pool)
                }

                return height
            } else {
                return -1
            }
        },
        async onFlush(dest, range) {
            let metadata: Metadata = {
                height: range.to,
                pools: PoolsRegistry.getRegistry().values(),
            }
            await dest.writeFile('status.json', JSON.stringify(metadata))
        },
    },
    chunkSizeMb: 50,
})

export type Store_ = typeof db extends Database<infer R, any> ? Store<R> : never
