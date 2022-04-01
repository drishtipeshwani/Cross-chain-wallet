import React, { useEffect, createContext, useState } from 'react'
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Signup from './components/signUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Web3 from 'web3';
import NetworkChain from './utils/network'
import { Card, Button, Form } from 'react-bootstrap'
import Login from './components/Login'

function App() {

  const [wallet, setWallet] = useState(localStorage.getItem('user-wallet'));
  const [authed, setAuthed] = useState(false);
  const [balanceMATIC, setBalanceMATIC] = useState('');
  const [balanceAVAX, setBalanceAVAX] = useState('');
  const [balanceETH, setBalanceETH] = useState('');

  // RPC of chains
  const fujiRPC = "https://api.avax-test.network/ext/bc/C/rpc";
  const ropstenRPC = "https://ropsten.infura.io/v3/";
  const mumbaiRPC = "https://rpc-mumbai.matic.today/";
  //this is for demo
  const address = "0xE5Bb1Ab7c83a32D900EF7BEF2B7dbE3146502A7b";
  //setting chains
  const [networks, setNetworks] = React.useState('');

  useEffect(() => {
    if (wallet) {
      setAuthed(true);
    }
  }, [wallet])

  const handleContext = () => {
    const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;
    setNetworks({
      Polygon: new NetworkChain("Mumbai Test Net", mumbaiRPC, "80001", "MATIC", "https://mumbai.polygonscan.com/", balanceCheck(mumbaiRPC, "MATIC"))

      ,
      Avalanche: new NetworkChain("Avalanche FUJI C-Chain", fujiRPC, "43113", "AVAX", "https://testnet.snowtrace.io/", balanceCheck(fujiRPC, "AVAX"))

      ,
      Ropsten: new NetworkChain("Ropsten Test Network", ropstenRPC, "3", "ETH", "https://ropsten.etherscan.io", balanceCheck(ropstenRPC + INFURA_PROJECT_ID, "ETH"))

    });

    console.log(networks);

  }


  //finding balance of token
  const balanceCheck = (RPC, currency) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(RPC));
    web3.eth.getBalance(address, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        const x = web3.utils.fromWei(result, "ether") + " " + currency;
        console.log(x)
        if (currency === "ETH") {
          setBalanceETH(x)
        }
        if (currency === "MATIC") {
          setBalanceMATIC(x)
        }
        if (currency === "AVAX") {
          setBalanceAVAX(x)
        }

      }
    })
  }



  return (
    <div className="app">
      <h1>Cross Chain Wallet</h1>
      <Button variant="primary" onClick={handleContext} >Get context</Button>
      <Routes>
        {console.log(authed)}
        <Route path='/' element={authed ? <Login /> : <Signup />} />
        <Route path="/dashboard" element={<Dashboard balanceAVAX={balanceAVAX} balanceETH={balanceETH} balanceMATIC={balanceMATIC} />} />
      </Routes>
    </div>
  );
}

export default App;
