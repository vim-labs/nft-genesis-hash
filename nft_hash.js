require("dotenv").config();
const Web3 = require("web3");
const nftTransferAbi = require("./nftTransferAbi.json");
(async () => {
  // Burni NFT address (Any ERC-721 should work)
  const CONTRACT_ADDRESS = "0x999BC7b1D5b2741E90296695Ed1610A37021df49";

  // Block for first contract transaction
  const CONTRACT_BLOCK = 9497370;

  // Token for genesis hash lookup
  const tokenId = 1;

  // Connect to Ethereum via Web3 (on client-side, use MetaMask or alternatives.)
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )
  );

  // Create NFT contract reference ABI
  const nftContract = new web3.eth.Contract(nftTransferAbi, CONTRACT_ADDRESS);

  // Find the mint event for the specified token
  const blockNumber = (
    await nftContract.getPastEvents("Transfer", {
      filter: {
        from: "0x0000000000000000000000000000000000000000",
        tokenId
      },
      fromBlock: CONTRACT_BLOCK,
      toBlock: "latest"
    })
  ).map(event => {
    return event["blockNumber"];
  })[0];

  // Attempt to create NFT genesis hash
  // sha3(join([CONTRACT_ADDRESS, TOKEN_ID, MINT_BLOCK_HASH+1,
  //            MINT_BLOCK_HASH+2, MINT_BLOCK_HASH+3, MINT_BLOCK_HASH+4,
  //            MINT_BLOCK_HASH+5]))
  let genhash = null;

  // Get latest block
  const latestBlockNumber = await web3.eth.getBlockNumber();

  // Calculation requires 5 blocks mined after mint.
  if (latestBlockNumber - blockNumber > 5) {
    const futureBlocks = [...Array(5).keys()].map(v => v + blockNumber + 1);
    const blockHashes = (
      await Promise.all(
        futureBlocks.map(blockNumber => web3.eth.getBlock(blockNumber))
      )
    )
      .map(block => block.hash)
      .join("");
    genhash = web3.utils.sha3(CONTRACT_ADDRESS + tokenId + blockHashes);
  }

  console.log(genhash);
})();
