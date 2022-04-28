import React from "react";
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap'
import networks from "../../utils/network";
import Web3 from 'web3';
import { Hyphen, SIGNATURE_TYPES, RESPONSE_CODES } from "@biconomy/hyphen";
import './Home.css';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Polygon: '',
      Avalanche: '',
      Kovan: '',
      totalBalanceETH: 0,
      totalBalanceUSDC: 0,
      totalBalanceMATIC: 0,
      totalBalanceAVAX: 0,
      balanceETHKovan: 0,
      balanceETHPolygon: 0,
      balanceETHAvalanche: 0,
      wallet:null,
      senderInput: '',
      receiverInput: '',
      amountInput: '',
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(networks.Polygon.rpc));
  }

  updateAmount(e){ 
    // Changing state 
    this.setState({amountInput: e.target.value});
  } 

  updateSender(e){
    this.setState({senderInput: e.target.value});
  }

  updateReceiver(e){
    this.setState({receiverInput: e.target.value});
    
  }


  componentDidMount(){
     this.getData(networks.Polygon);
     this.getData(networks.Avalanche);
      this.getData(networks.Kovan);
    this.wallet  = this.web3.eth.accounts.wallet.load(localStorage.getItem('password'), 'user-wallet')
  }

  initializeTransaction = async () => {
    let wallet = this.web3.eth.accounts.wallet.load(localStorage.getItem('password'), 'user-wallet')
    console.log(wallet);
    let provider = wallet._accounts._provider
    console.log(provider);
    let hyphen = new Hyphen(provider, {
      debug: true,            // If 'true', it prints debug logs on console window
      environment: "test",    // It can be "test" or "prod"
      onFundsTransfered: (data) => {
        console.log(data);
       // Optional Callback method which will be called when funds transfer across
      //   // chains will be completed
       }
    });

     //Initializing the hyphen sdk
    await hyphen.init();

    let amount = this.web3.utils.toWei('0.2', 'ether');
    let preTransferStatus = await hyphen.depositManager.preDepositStatus({
      tokenAddress: networks.Kovan.eth, // Token address on fromChain which needs to be transferred
      amount: amount.toString(), // Amount of tokens to be transferred in smallest unit eg wei
      fromChainId: networks.Kovan.chainId, // Chain id from where tokens needs to be transferred
      toChainId: networks.Polygon.chainId, // Chain id where tokens are supposed to be sent
      userAddress: wallet[0].address // User wallet address who want's to do the transfer
    });

    console.log(preTransferStatus.code, RESPONSE_CODES.OK);
    console.log(preTransferStatus);
    
    if (preTransferStatus.code === RESPONSE_CODES.OK) {
      // ✅ ALL CHECKS PASSED. Proceed to do deposit transaction
    } else if(preTransferStatus.code === RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
      console.log('Allowance not given');
      // ❌ Not enough apporval from user address on LiquidityPoolManager contract on fromChain

      let approveTx = {
        tokenAddress: networks.Kovan.eth, // Token address on fromChain which needs to be transferred
        spender: preTransferStatus.depositContract,
        amount: amount.toString(),
        userAddress: wallet[0].address,
        infiniteApproval: true,
        useBiconomy: true
      };
      console.log(approveTx);
      this.web3.eth.accounts.signTransaction(approveTx, wallet[0].privateKey)
      console.log(approveTx);

      let approveTxRes = await hyphen.tokens.approveERC20(approveTx);
      // ⏱Wait for the transaction to confirm, pass a number of blocks to wait as param
      console.log(approveTxRes);
      
      await approveTxRes.wait(1);
      
      // NOTE: Whenever there is a transaction done via SDK, all responses
      // will be ethers.js compatible with an async wait() function that
      // can be called with 'await' to wait for transaction confirmation.
      
      // 🆗Now proceed to do the deposit transaction
      
    } else if (preTransferStatus.code === RESPONSE_CODES.UNSUPPORTED_NETWORK) {
      // ❌ Target chain id is not supported yet
    } else if (preTransferStatus.code === RESPONSE_CODES.NO_LIQUIDITY) {
      // ❌ No liquidity available on target chain for given tokenn
    } else if (preTransferStatus.code === RESPONSE_CODES.UNSUPPORTED_TOKEN) {
      // ❌ Requested token is not supported on fromChain yet
    } else {
      // ❌ Any other unexpected error
    }
    let amountInput = 0;
     if(this.state.amountInput!==''){
        amountInput  = this.web3.utils.toWei(this.state.amountInput, 'ether');
    }
    let senderChain;
    let receiverChain;
    console.log(this.state.receiverInput)
    console.log(this.state.senderInput)
    if(this.state.senderInput === 'Polygon'){
      senderChain = networks.Polygon.chainId;
    }
    else if(this.state.senderInput === 'Avalanche'){
      senderChain = networks.Avalanche.chainId;
    }
    else if(this.state.senderInput === 'Ethereum'){
      senderChain = networks.Kovan.chainId;
    }

    if(this.state.receiverInput === 'Polygon'){
      receiverChain = networks.Polygon.chainId;
    }
    else if(this.state.receiverInput === 'Avalanche'){
      receiverChain = networks.Avalanche.chainId;
    }
    else if(this.state.receiverInput === 'Ethereum'){
      receiverChain = networks.Kovan.chainId;
    }

    console.log(senderChain, receiverChain);
    let tx = {
      mode: 'no-cores',
      gas: 1000000,
      sender: wallet[0].address,
      receiver: wallet[0].address, //my account-1
      tokenAddress: networks.Kovan.eth,
      depositContractAddress: preTransferStatus.depositContract,
      amount: amountInput.toString(), //Amount to be transferred. Denoted in smallest unit eg in wei",
      fromChainId: senderChain, // chainId of fromChain
      toChainId: receiverChain,     // chainId of toChain
      // useBiconomy: true, // OPTIONAL boolean flag specifying whether to use Biconomy for gas less transaction or not
      tag: "Dapp specific identifier",
    }
    
    console.log(tx);
    let signedTx = await this.web3.eth.accounts.signTransaction(tx, wallet[0].privateKey)

    console.log(signedTx);

    let depositTxRes = await hyphen.depositManager.deposit(signedTx);
    console.log(depositTxRes);
    // Wait for 1 block confirmation
      await tx.wait(1);

  }


  getData = async (network) => {
    const { 
      address,
      totalBalanceAVAX,
      totalBalanceETH,
      totalBalanceMATIC,
      balanceETHAvalanche,
      balanceETHPolygon,
      balanceETHKovan,
    } = this.state;



    let wallet = this.web3.eth.accounts.wallet.load(localStorage.getItem('password'), 'user-wallet')


    const options = {
      method: 'GET',
      url: `https://api.covalenthq.com/v1/${network.chainId}/address/${wallet[0].address}/balances_v2/`,
      params:  {
        key: process.env.REACT_APP_COVALENT_API_KEY
      }
    }

    const data = await axios.request(options).then(function (response) {
      return response.data;
    }).catch(function (error) {
        console.log(error);
    });

    console.log(data)
    
    let tokens = data.data.items;

    let tokenAmounts = {};

    tokens.forEach(token => {
      console.log(token);
      let symbol = token.contract_ticker_symbol
      tokenAmounts[symbol] = this.web3.utils.fromWei(token.balance, 'ether');

      if (symbol == "ETH" || symbol == "WETH" || symbol == "aeth") {
        let stateName = "balanceETH" + network.name;
        this.setState({
          totalBalanceETH: this.state.totalBalanceETH + parseFloat(tokenAmounts[symbol]),
          [stateName]: this.state[stateName] + parseFloat(tokenAmounts[symbol])
        })

      }
      if (symbol === "MATIC") {
        this.setState({
          totalBalanceMATIC: this.state.totalBalanceMATIC + parseFloat(tokenAmounts[symbol])
        })
      }
      if (symbol === "AVAX") {
        this.setState({
          totalBalanceAVAX: this.state.totalBalanceAVAX + parseFloat(tokenAmounts[symbol])
        })
      }
    });

    
    this.setState({
      [network.name] : {
        ...tokenAmounts
      }
    })
  }

  render(){
    return (
      <Container>    
       {this.wallet && <h5>Account Address - <span>{this.wallet[0].address}</span></h5> }
        <Row>
          <Col>
            <h1>Balances</h1>
            <Row>
              <Col>
                ETH: {this.state.totalBalanceETH}
              </Col>
              <Col>
                <Row>
                  Kovan: {this.state.balanceETHKovan}
                </Row>
                <Row>
                  Avalanch: {this.state.balanceETHAvalanche}
                </Row>
                <Row>
                  Polygon: {this.state.balanceETHPolygon}
                </Row>
              </Col>
            </Row>
            <Row>
              Matic: {this.state.totalBalanceMATIC}
            </Row>
            <Row>
              Avax: {this.state.totalBalanceAVAX}
            </Row>
          </Col>
          <Col>
            <h1>Transfer token</h1>
             <div className="transfer-ctn">
               <Row className="input-ctn">
                 <p>SOURCE</p>
                 <select onChange={(e)=>{this.updateSender(e)}} value={this.state.senderInput}>
                   <option value='default'>Select Chain</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Avalanche">Avalanche</option>
                    <option value = "Ethereum">Ethereum</option>
                 </select>
               </Row>
               <Row className="input-ctn">
                 <p>DESTINATION</p>
                 <select onChange={(e)=>{this.updateReceiver(e)}} value={this.state.receiverInput}>
                 <option value='default'>Select Chain</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Avalanche">Avalanche</option>
                    <option value = "Ethereum">Ethereum</option>
                 </select>
               </Row>
               <Row className="input-ctn">
                 <p>AMOUNT</p>
                 {/**Define input field for input amount */}
                  <input type="text" placeholder="0.00" value={this.amountInput} onChange={(e)=>this.updateAmount(e)}/>
               </Row>
               <Row className="input-ctn">
                <button className="button-ctn" onClick={this.initializeTransaction}>Transfer</button>
               </Row>
             </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Home;
