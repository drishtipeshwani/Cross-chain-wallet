import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap'
import web3 from '../../utils/web3'
import { NetworkContext } from '../../App';


function Dashboard() {

  const [balanceMATIC, setBalanceMATIC] = useState('');
  const [balanceAVAX, setBalanceAVAX] = useState('');
  const [balanceETH, setBalanceETH] = useState('');
  const [showSplitBalance, setShowSplitBalance] = useState(false);

  //creating context to be used by signUp
  const network = useContext(NetworkContext);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    setBalanceAVAX(network.Avalanche.balance);
    setBalanceMATIC(network.Polygon.balance);
    setBalanceETH(network.Ropsten.balance);
  });

  const handleSplitBalance = () => {
    setShowSplitBalance(true);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className='splitBalance'>
        <h3> Total Balance </h3>
        {balanceAVAX}
        {balanceMATIC}
        {balanceETH}
        <Button variant="primary" onClick={handleSplitBalance} >Get all chains linked</Button>
        {showSplitBalance ? (
          <div>
            <Card className='text-center card-ctn polygonChain'>
              <Card.Body>
                <Card.Title>Check balance on Polygon</Card.Title>
                <Card.Text>MATIC
                  {balanceMATIC}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='text-center card-ctn polygonChain'>
              <Card.Body>
                <Card.Title>Check balance on Avalanche</Card.Title>
                <Card.Text>AVAX
                  {balanceAVAX}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='text-center card-ctn polygonChain'>
              <Card.Body>
                <Card.Title>Check balance on Ethereum</Card.Title>
                <Card.Text>ETH
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


