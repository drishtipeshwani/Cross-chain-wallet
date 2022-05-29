const networks = {
  Polygon: {
    name: "Mumbai Test Net",
    rpc: mumbaiRPC,
    chainId: 80001,
  },
  Avalanche: {
    name: "Avalanche FUJI C-Chain",
    rpc: fujiRPC,
    chainId: 43113,
  },
  Kovan: {
    name: "Kovan Test Net",
    rpc: kovanRPC,
    chainId: 42,
  },
  Goerli: {
    name: "Goerli Test Net",
    rpc: goerliRPC,
    chainId: 5,
  },
}
// const networks = {
//   Polygon: {
//     name: "Polygon MainNet",
//     rpc: polyMainNetRPC,
//     chainId: 137,
//   },
//   Avalanche: {
//     name: "Avalanche MainNet",
//     rpc: avaMainNetRPC,
//     chainId: 43114,
//   },
//   Kovan: {
//     name: "Ethereum Mainnet",
//     rpc: ethMainNetRPC,
//     chainId: 1,
//   }
// }