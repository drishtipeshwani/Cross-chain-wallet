const fujiRPC = "https://api.avax-test.network/ext/bc/C/rpc";
const kovanRPC = "https://kovan.infura.io/v3/";
const mumbaiRPC = "https://rpc-mumbai.matic.today/";

const networks = {
    Polygon: {
      name: "Polygon",
      rpc: mumbaiRPC,
      chainId: 80001,
    },
    Avalanche: {
      name: "Avalanche",
      rpc: fujiRPC,
      chainId: 43113,
    },
    Kovan: {
      name: "Kovan",
      rpc: kovanRPC,
      chainId: 42,
    },
}

export default networks
