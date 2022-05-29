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
      balanceETHGoerli: 0,
      balanceETHKovan: 0,
      balanceETHPolygon: 0,
      balanceETHAvalanche: 0,
      wallet: null,
      senderInput: '',
      receiverInput: '',
      amountInput: '',
      demoAddress: '0xE5Bb1Ab7c83a32D900EF7BEF2B7dbE3146502A7b',
      demoAddressPK: '152f8df1657e3aede6b1a079d479bdc2f71da3558a10b123bd76acbb7caeb170'
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(networks.Goerli.rpc));
  }

  updateAmount(e) {
    // Changing state 
    this.setState({ ...this.state, amountInput: e.target.value });
  }

  updateSender(e) {
    this.setState({ ...this.state, senderInput: e.target.value });
  }

  updateReceiver(e) {
    this.setState({ ...this.state, receiverInput: e.target.value });

  }


  async componentDidMount() {
    await this.getData(networks.Polygon);
    await this.getData(networks.Avalanche);
    await this.getData(networks.Kovan);
    await this.getDataGoerli(networks.Goerli);
    this.wallet = this.web3.eth.accounts.wallet.load(localStorage.getItem('password'), 'user-wallet')
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

    let amount = this.web3.utils.toWei('0.002', 'ether');
    let preTransferStatus = await hyphen.depositManager.preDepositStatus({
      tokenAddress: networks.Goerli.eth, // Token address on fromChain which needs to be transferred
      amount: amount.toString(), // Amount of tokens to be transferred in smallest unit eg wei
      fromChainId: networks.Goerli.chainId, // Chain id from where tokens needs to be transferred
      toChainId: networks.Polygon.chainId, // Chain id where tokens are supposed to be sent
      // userAddress: wallet[0].address // User wallet address who want's to do the transfer
      userAddress: this.state.demoAddress // this is demoAddress
    });

    console.log(preTransferStatus);

    if (preTransferStatus.code === RESPONSE_CODES.OK) {
      // ✅ ALL CHECKS PASSED. Proceed to do deposit transaction
    } else if (preTransferStatus.code === RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
      // ❌ Not enough apporval from user address on LiquidityPoolManager contract on fromChain
      let infiniteApproval = false;
      let useBiconomy = false;
      console.log("^^^^^^^^gfdhfjhdjhfjdh^&^^^^^^^^^");
      let approveTx = await hyphen.tokens.approveERC20(networks.Goerli.eth,
        '0xE61d38cC9B3eF1d223b177090f3FD02b0B3412e7', amount.toString(),
        infiniteApproval, useBiconomy,
        wallet); // !!!NOTE: the previously created wallet is added here
      console.log("^^^^^^^^gfdhfjhdjhfjdh^&^^^^^^^^^");
      // ⏱Wait for the transaction to confirm, pass a number of blocks to wait as param
      const approveTxWait = await approveTx.wait(2);
      console.log(approveTxWait + "approveTxWait");

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
    if (this.state.amountInput !== '') {
      amountInput = this.web3.utils.toWei(this.state.amountInput, 'ether');
    }
    let senderChain;
    let receiverChain;
    console.log(this.state.receiverInput)
    console.log(this.state.senderInput)
    if (this.state.senderInput === 'Polygon') {
      senderChain = networks.Polygon.chainId;
    }
    else if (this.state.senderInput === 'Avalanche') {
      senderChain = networks.Avalanche.chainId;
    }
    else if (this.state.senderInput === 'Ethereum') {
      // senderChain = networks.Kovan.chainId;
      senderChain = networks.Goerli.chainId;
    }

    if (this.state.receiverInput === 'Polygon') {
      receiverChain = networks.Polygon.chainId;
    }
    else if (this.state.receiverInput === 'Avalanche') {
      receiverChain = networks.Avalanche.chainId;
    }
    else if (this.state.receiverInput === 'Ethereum') {
      // receiverChain = networks.Kovan.chainId;
      receiverChain = networks.Goerli.chainId;
    }

    console.log(senderChain, receiverChain);
    console.log("#############");
    console.log(this.state.demoAddress);
    console.log(networks.Goerli.eth);
    // console.log(preTransferStatus.depositContract);
    console.log(senderChain);
    console.log(receiverChain);
    console.log("#############");

    let tx = {
      mode: 'no-cores',
      gas: 1000000,
      sender: this.state.demoAddress,
      receiver: this.state.demoAddress, //my account-1
      tokenAddress: networks.Goerli.eth,
      depositContractAddress: '0xE61d38cC9B3eF1d223b177090f3FD02b0B3412e7',
      amount: amount.toString(), //Amount to be transferred. Denoted in smallest unit eg in wei",
      fromChainId: senderChain, // chainId of fromChain
      toChainId: receiverChain,     // chainId of toChain
      useBiconomy: false, // OPTIONAL boolean flag specifying whether to use Biconomy for gas less transaction or not
      tag: "Dapp specific identifier",
    }

    console.log(tx);
    let signedTx = await this.web3.eth.accounts.signTransaction(tx, this.state.demoAddressPK)

    console.log(signedTx);

    let preDepositTxRes = await hyphen.depositManager.preDepositCheck({
      tokenAddress: networks.Goerli.eth,
      amount: amount.toString(),
      fromChainId: senderChain,
      toChainId: receiverChain,
      userAddress: this.state.demoAddress
    });

    console.log(preDepositTxRes);

    let depositTxRes = await hyphen.depositManager.deposit(tx, wallet);
    // Wait for 1 block confirmation
    const depositTxWait = await depositTxRes.wait(1);
    console.log(depositTxWait + "***************");

    // let depositTx = await hyphen.depositManager.deposit({
    //   sender: this.state.demoAddress,
    //   receiver: this.state.demoAddress,
    //   tokenAddress: networks.Goerli.eth,
    //   depositContractAddress: '0xE61d38cC9B3eF1d223b177090f3FD02b0B3412e7',
    //   amount: amount.toString(), //Amount to be transferred. Denoted in smallest unit eg in wei",
    //   fromChainId: senderChain, // chainId of fromChain
    //   toChainId: receiverChain,     // chainId of toChain
    //   useBiconomy: true, // OPTIONAL boolean flag specifying whether to use Biconomy for gas less transaction or not
    //   tag: "Dapp specific identifier" // Can be any string, emitted from the contract during the deposit call; used for analytics
    // }, wallet);  // !!!NOTE: the previously created wallet is added here

    // // Wait for 1 block confirmation
    // const depositTxWait = await depositTx.wait(1);
    // console.log(depositTxWait + "***************");
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
      // url: `https://api.covalenthq.com/v1/${network.chainId}/address/${wallet[0].address}/balances_v2/`,
      url: `https://api.covalenthq.com/v1/${network.chainId}/address/${this.state.demoAddress}/balances_v2/`,
      params: {
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
        console.log(this.state.totalBalanceETH + "$$$$$$");
        this.setState({
          ...this.state, totalBalanceETH: this.state.totalBalanceETH + parseFloat(tokenAmounts[symbol]),
          [stateName]: this.state[stateName] + parseFloat(tokenAmounts[symbol])
        })
        console.log(this.state.totalBalanceETH + "*********");

      }
      if (symbol === "MATIC") {
        this.setState({
          ...this.state, totalBalanceMATIC: this.state.totalBalanceMATIC + parseFloat(tokenAmounts[symbol])
        })
      }
      if (symbol === "AVAX") {
        this.setState({
          ...this.state, totalBalanceAVAX: this.state.totalBalanceAVAX + parseFloat(tokenAmounts[symbol])
        })
      }
    });


    this.setState({
      ...this.state, [network.name]: {
        ...tokenAmounts
      }
    })
    // console.log(this.state.totalBalanceETH + "^^^^^^^");
  }

  getDataGoerli = async (network) => {
    const {
      address,
      totalBalanceETH,
      balanceETHGoerli
    } = this.state;
    console.log(this.state.totalBalanceETH + "^^^^^^^");
    let wallet = this.web3.eth.accounts.wallet.load(localStorage.getItem('password'), 'user-wallet')

    //finding balance of token in Goerli
    let tokenAmounts = {};
    let symbol = "ETH";
    let web3 = new Web3(new Web3.providers.HttpProvider(network.rpc));
    console.log(this.state.totalBalanceETH + "@@@@@@@@@@@");
    const resp = await web3.eth.getBalance(this.state.demoAddress);
    tokenAmounts[symbol] = web3.utils.fromWei(resp, "ether");

    let stateName = "balanceETH" + network.name;
    console.log(this.state + "!!!!!!!!!!!!");
    this.setState({
      ...this.state, totalBalanceETH: this.state.totalBalanceETH + parseFloat(tokenAmounts[symbol]),
      [stateName]: this.state[stateName] + parseFloat(tokenAmounts[symbol])
    })



    this.setState({
      ...this.state, [network.name]: {
        ...tokenAmounts
      }
    })
  }

  render() {
    return (
      <Container>
        {/* {this.wallet && <h5>Account Address - <span>{this.wallet[0].address}</span></h5>} */}
        {this.wallet && <h5>Account Address - <span>{this.state.demoAddress}</span></h5>}
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
                <select onChange={(e) => { this.updateSender(e) }} value={this.state.senderInput}>
                  <option value='default'>Select Chain</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Avalanche">Avalanche</option>
                  <option value="Ethereum">Ethereum</option>
                </select>
              </Row>
              <Row className="input-ctn">
                <p>DESTINATION</p>
                <select onChange={(e) => { this.updateReceiver(e) }} value={this.state.receiverInput}>
                  <option value='default'>Select Chain</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Avalanche">Avalanche</option>
                  <option value="Ethereum">Ethereum</option>
                </select>
              </Row>
              <Row className="input-ctn">
                <p>AMOUNT</p>
                {/**Define input field for input amount */}
                <input type="text" placeholder="0.00" value={this.amountInput} onChange={(e) => this.updateAmount(e)} />
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
