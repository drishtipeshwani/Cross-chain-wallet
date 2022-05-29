import React, { useEffect, createContext, useState } from 'react'
import axios from 'axios'
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Signup from './components/signUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Web3 from 'web3';
import NetworkChain from './utils/network'
import { Card, Button, Form } from 'react-bootstrap'
import Login from './components/Login'
import Home from './components/Home/Home'

function App() {

  const [wallet, setWallet] = useState(localStorage.getItem('user-wallet'));
  const [authed, setAuthed] = useState(false);
  const [balanceMATIC, setBalanceMATIC] = useState('');
  const [balanceAVAX, setBalanceAVAX] = useState('');
  const [balanceETH, setBalanceETH] = useState('');

  // RPC of chains
  const fujiRPC = "https://api.avax-test.network/ext/bc/C/rpc";
  const kovanRPC = "https://kovan.infura.io/v3/";
  const mumbaiRPC = "https://rpc-mumbai.matic.today/";
  //this is for demo
  const address = "0xE5Bb1Ab7c83a32D900EF7BEF2B7dbE3146502A7b";
  //setting chains
  const [networks, setNetworks] = React.useState({
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
  })

  useEffect(() => {
    balance()
  }, [wallet])


  const balance = async () => {
    console.log("in balance");
    Object.keys(networks).map(async (key) => {
      let chainId = networks[key].chainId;

      const options = {
        method: 'GET',
        url: `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
        params: {
          key: process.env.REACT_APP_COVALENT_API_KEY
        }
      }

      const data = await axios.request(options).then(function (response) {
        let x = response.data.data.items[0].balance / Math.pow(10, 18);
        if (response.data.data.items[0].contract_ticker_symbol === "MATIC")
          setBalanceMATIC(x + " " + "MATIC");
        if (response.data.data.items[0].contract_ticker_symbol === "ETH")
          setBalanceETH(x + " " + "ETH");
        if (response.data.data.items[0].contract_ticker_symbol === "AVAX")
          setBalanceAVAX(x + " " + "AVAX");
        return response.data;
      }).catch(function (error) {
        console.log(error);
      });

      // console.log(data);
    });
  }

  return (
    <div className="app">
      <div>
        <h1>Cross Chain Wallet</h1>
      </div>
      <Routes>
        {console.log(authed)}
        <Route path='/' element={authed ? <Login /> : <Signup />} />
        <Route path="/dashboard" element={<Dashboard balanceAVAX={balanceAVAX} balanceETH={balanceETH} balanceMATIC={balanceMATIC} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
