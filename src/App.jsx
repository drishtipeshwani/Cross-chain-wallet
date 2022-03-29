import React, {useState,useEffect} from 'react'
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Signup from './components/signUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login';
import web3 from './utils/web3'

function App() {


    const [wallet, setWallet] =useState(localStorage.getItem('user-wallet'));
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
     if(wallet){
        setAuthed(true);
     }
  },[wallet])
  

  return (
    <div className="app">
       <h1>Cross Chain Wallet</h1>
       <Routes>
         {console.log(authed)}
         <Route path = '/' element = {authed ? <Login/> : <Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
       </Routes>
    </div>
  );
}

export default App;
