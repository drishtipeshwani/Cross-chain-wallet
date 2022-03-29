import React from 'react'
import web3 from '../../utils/web3'

function Dashboard() {

  const [wallet, setWallet] = React.useState(null);
  

  React.useEffect(() => {
    setWallet(web3.eth.accounts.wallet.load(localStorage.getItem('password'),'user-wallet'));
  },[])

  return (
    <div>
    <h1>Dashboard</h1>
    {console.log(wallet)}
    </div>
  )
}

export default Dashboard