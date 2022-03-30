import './App.css';
import React, { useEffect, createContext } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import Signup from './components/signUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Web3 from 'web3';
import NetworkChain from './utils/network'
import { Card, Button, Form } from 'react-bootstrap'

function App() {

  // RPC of chains
  const fujiRPC = "https://api.avax-test.network/ext/bc/C/rpc";
  const ropstenRPC = "https://ropsten.infura.io/v3/";
  const mumbaiRPC = "https://rpc-mumbai.matic.today/";
  //this is for demo
  const address = "0xE5Bb1Ab7c83a32D900EF7BEF2B7dbE3146502A7b";
  const private_key = "0x152f8df1657e3aede6b1a079d479bdc2f71da3558a10b123bd76acbb7caeb170";
  //setting chains
  const [networks, setNetworks] = React.useState('');

  // useEffect(() => {
  const handleContext = () => {
    const INFURA_PROJECT_ID = "b8cdccd184624e938022708762b2c119" //todo
    //network context to be used by Dashboard
    setNetworks({
      Polygon: new NetworkChain("Mumbai Test Net", mumbaiRPC, "80001", "MATIC", "https://mumbai.polygonscan.com/", balanceCheck(mumbaiRPC, "MATIC"))

      ,
      Avalanche: new NetworkChain("Avalanche FUJI C-Chain", fujiRPC, "43113", "AVAX", "https://testnet.snowtrace.io/", balanceCheck(fujiRPC, "AVAX"))

      ,
      Ropsten: new NetworkChain("Ropsten Test Network", ropstenRPC, "3", "ETH", "https://ropsten.etherscan.io", balanceCheck(ropstenRPC + INFURA_PROJECT_ID, "ETH"))

    });
  }
  // );


  //finding balance of token
  const balanceCheck = (RPC, currency) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(RPC));
    web3.eth.getBalance(address, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " " + currency)
      }
    })
  }


  return (
    <div className="app">
      <h1>Cross Chain Wallet</h1>
      <Button variant="primary" onClick={handleContext} >Get context</Button>
      <NetworkContext.Provider value={networks}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </NetworkContext.Provider>
    </div>
  );
}

export default App;
export const NetworkContext = createContext();