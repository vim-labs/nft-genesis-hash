# NFT Genesis Hash

Generate pseudorandom client-side ERC-721 token genesis hashes.

```
sha3(join([CONTRACT_ADDRESS, TOKEN_ID, MINT_BLOCK_HASH+1,
           MINT_BLOCK_HASH+2, MINT_BLOCK_HASH+3, MINT_BLOCK_HASH+4,
           MINT_BLOCK_HASH+5]))
```

Create an Infura Project at:
https://infura.io/
