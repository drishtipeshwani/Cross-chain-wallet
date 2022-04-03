import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap'
import Web3 from 'web3';

function Dashboard(props) {

  const [balanceMATIC, setBalanceMATIC] = useState('');
  const [balanceAVAX, setBalanceAVAX] = useState('');
  const [balanceETH, setBalanceETH] = useState('');
  const [showSplitBalance, setShowSplitBalance] = useState(false);
  const [wallet, setWallet] = React.useState(null);

  const navigate = useNavigate();

  
  React.useEffect(() => {
    let defaultNetwork = localStorage.getItem('defaultNetwork');
    let RPC = props.networks.filter(network => network.chainName === defaultNetwork)[0].RPC
    let web3 = new Web3(new Web3.providers.HttpProvider(RPC));
    setWallet(web3.eth.accounts.wallet.load(localStorage.getItem('password'), 'user-wallet'));
    console.log(wallet)
  },[])

  //creating context to be used by signUp
  // const [network, setNetwork] = useContext(NetworkContext);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    setBalanceAVAX(props.balanceAVAX);
    setBalanceMATIC(props.balanceMATIC);
    setBalanceETH(props.balanceETH);
  });

  const handleSplitBalance = () => {
    setShowSplitBalance(true);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className='splitBalance'>
        <h3> Total Balance </h3>
        {balanceAVAX} <br />
        {balanceMATIC}<br />
        {balanceETH}
        <Button variant="primary" onClick={handleSplitBalance} >Get all chains linked</Button>
        {showSplitBalance ? (
          <div>
            <Card className='text-center card-ctn polygonChain'>
              <Card.Body>
                <Card.Title>Check balance on Polygon</Card.Title>
                <Card.Text>
                  {balanceMATIC}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='text-center card-ctn polygonChain'>
              <Card.Body>
                <Card.Title>Check balance on Avalanche</Card.Title>
                <Card.Text>
                  {balanceAVAX}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='text-center card-ctn polygonChain'>
              <Card.Body>
                <Card.Title>Check balance on Ethereum</Card.Title>
                <Card.Text>
                  {balanceETH}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
export default Dashboard


