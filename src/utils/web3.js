import Web3 from 'web3'

const ethNetwork = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

export default web3
