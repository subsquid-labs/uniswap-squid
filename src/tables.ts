import {Table, Column, Compression, Types} from '@subsquid/file-store-parquet'

export const Tokens = new Table(
    'tokens.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        symbol: Column(Types.String()),
        name: Column(Types.String()),
        totalSupply: Column(Types.Uint64()),
        decimals: Column(Types.Uint16()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const FactoryPairCreated = new Table(
    'factory_event_PairCreated.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        token0: Column(Types.String()),
        token1: Column(Types.String()),
        fee: Column(Types.Uint16()),
        tickSpacing: Column(Types.Uint16()),
        pool: Column(Types.String()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PoolInitialize = new Table(
    'pool_event_Initialize.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        sqrtPriceX96: Column(Types.Uint64()),
        tick: Column(Types.Uint32()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PoolMint = new Table(
    'pool_event_Mint.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        sender: Column(Types.String()),
        owner: Column(Types.String()),
        tickLower: Column(Types.Uint32()),
        tickUpper: Column(Types.Uint32()),
        amount: Column(Types.Uint64()),
        amount0: Column(Types.Uint64()),
        amount1: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PoolBurn = new Table(
    'pool_event_Burn.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        owner: Column(Types.String()),
        tickLower: Column(Types.Uint32()),
        tickUpper: Column(Types.Uint32()),
        amount: Column(Types.Uint64()),
        amount0: Column(Types.Uint64()),
        amount1: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PoolSwap = new Table(
    'pool_event_Swap.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        sender: Column(Types.String()),
        recipient: Column(Types.String()),
        amount0: Column(Types.Uint64()),
        amount1: Column(Types.Uint64()),
        sqrtPriceX96: Column(Types.Uint64()),
        tick: Column(Types.Uint32()),
        liquidity: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PositionIncreaseLiquidity = new Table(
    'position_event_IncreaseLiquidity.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        tokenId: Column(Types.Uint64()),
        liquidity: Column(Types.Uint64()),
        amount0: Column(Types.Uint64()),
        amount1: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PositionDecreaseLiquidity = new Table(
    'position_event_DecreaseLiquidity.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        tokenId: Column(Types.Uint64()),
        liquidity: Column(Types.Uint64()),
        amount0: Column(Types.Uint64()),
        amount1: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PositionCollect = new Table(
    'position_event_Collect.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        tokenId: Column(Types.Uint64()),
        recipient: Column(Types.String()),
        amount0: Column(Types.Uint64()),
        amount1: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)

export const PositionTransfer = new Table(
    'position_event_Transfer.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        from: Column(Types.String()),
        to: Column(Types.String()),
        tokenId: Column(Types.Uint64()),
    },
    {
        compression: Compression.ZSTD,
    }
)
