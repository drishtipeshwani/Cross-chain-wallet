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


function App() {

  const [wallet, setWallet] = useState(localStorage.getItem('user-wallet'));
  const [authed, setAuthed] = useState(false);
  const [balanceMATIC, setBalanceMATIC] = useState('');
  const [balanceAVAX, setBalanceAVAX] = useState('');
  const [balanceETH, setBalanceETH] = useState('');
  const [rpcArray, setRpcArray] = useState([]);

  // RPC of chains
  const fujiRPC = "https://api.avax-test.network/ext/bc/C/rpc";
  const kovanRPC = "https://kovan.infura.io/v3/";
  const mumbaiRPC = "https://rpc-mumbai.matic.today/";
   

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
  //this is for demo
  const address = "0xE5Bb1Ab7c83a32D900EF7BEF2B7dbE3146502A7b";

  //setting chains

  useEffect(() => {
    if (wallet) {
      setAuthed(true);
    }
  }, [wallet])

  useEffect (()=>{
    setRpcArray([{Name:"Polygon",RPC:mumbaiRPC},
  {Name:"Avalanche",RPC:fujiRPC},
  {Name:"Ethereum",RPC:kovanRPC}]);
    balance();
  },[])

  const balance = async () => {

    Object.keys(networks).map(async (key) => {
      let chainId = networks[key].chainId;

      const options = {
        method: 'GET',
        url: `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
        params:  {
          key: process.env.REACT_APP_COVALENT_API_KEY
        }
      }

      const data = await axios.request(options).then(function (response) {
        return response.data;
      }).catch(function (error) {
          console.log(error);
      });

      console.log(data);
    });
  }

  //finding balance of token
  {/**const balanceCheck = (RPC, currency) => {
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
  }**/}

  return (
    <div className="app">
      <h1>Cross Chain Wallet</h1>
      <Routes>
        <Route path='/' element={authed ? <Login /> : <Signup rpcArray={rpcArray}/>} />
        <Route path="/dashboard" element={<Dashboard balanceAVAX={balanceAVAX} balanceETH={balanceETH} balanceMATIC={balanceMATIC} rpcArray={rpcArray}/>} />
      </Routes>
    </div>
  );
}

export default App;
