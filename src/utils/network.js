const fujiRPC = "https://api.avax-test.network/ext/bc/C/rpc";
const kovanRPC = "https://kovan.infura.io/v3/";
const mumbaiRPC = "https://matic-mumbai.chainstacklabs.com";
const goerliRPC = "https://goerli.infura.io/v3/b8cdccd184624e938022708762b2c119";

const networks = {
    Polygon: {
      name: "Polygon",
      rpc: mumbaiRPC,
      chainId: 80001,
      matic: "0x0000000000000000000000000000000000001010",
      weth:"0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    },
    Avalanche: {
      name: "Avalanche",
      rpc: fujiRPC,
      chainId: 43113,
      avax: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      aeth: "0xeff581ca1f9b49f49a183cd4f25f69776fa0ebf4"
    },
    Kovan: {
      name: "Kovan",
      rpc: kovanRPC,
      chainId: 42,
      eth: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    },
    Goerli: {
      name: "Goerli",
      rpc: goerliRPC,
      chainId: 5,
      usdc: "0xb5B640E6414b6DeF4FC9B3C1EeF373925effeCcF",
      eth: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    }
}

// mainnets
// const ethMainNetRPC = "https://mainnet.infura.io/v3/";
// const avaMainNetRPC = "https://api.avax.network/ext/bc/C/rpc";
// const polyMainNetRPC = "https://polygon-rpc.com/";
// const networks = {
//   Polygon: {
//     name: "Polygon MainNet",
//     rpc: polyMainNetRPC,
//     chainId: 137,
//     matic: "0x0000000000000000000000000000000000001010",
//     weth:"0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
//   },
//   Avalanche: {
//     name: "Avalanche MainNet",
//     rpc: avaMainNetRPC,
//     chainId: 43114,
//     avax: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     aeth: "0xeff581ca1f9b49f49a183cd4f25f69776fa0ebf4"
//   },
//   Kovan: {
//     name: "Ethereum Mainnet",
//     rpc: ethMainNetRPC,
//     chainId: 1,
//     usdc: "0xb5B640E6414b6DeF4FC9B3C1EeF373925effeCcF",
//     eth: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
//   }
// }

export default networks



// covalent supports Kovan, 
// biconomy supports Goerli. 