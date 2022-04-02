import Web3 from 'web3'

const INFURA_PROJECT_ID = "b8cdccd184624e938022708762b2c119"
const ethNetwork = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

export default web3
