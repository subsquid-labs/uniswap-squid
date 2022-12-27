process: migrate
	@node -r dotenv/config lib/processor.js


typegen:
	@npx squid-evm-typegen ./src/abi ./abi/*.json --clean --multicall


build:
	@npm run build


.PHONY: process serve migrate migration codegen typegen up down build pairs
