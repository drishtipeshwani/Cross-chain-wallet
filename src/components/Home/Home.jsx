import React from "react";
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap'
import networks from "../../utils/network";
import Web3 from 'web3';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Polygon: '',
      Avalanche: '',
      Kovan: '',
      address: "0xE5Bb1Ab7c83a32D900EF7BEF2B7dbE3146502A7b",
      balanceETH: 0,
      balanceMATIC: 0,
      balanceAVAX: 0,
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(networks.Polygon.rpc));
  }


  componentDidMount(){
    this.getData(networks.Polygon);
    this.getData(networks.Avalanche);
    this.getData(networks.Kovan);
  }

  getData = async (network) => {
    const { address, balanceAVAX, balanceETH, balanceMATIC } = this.state;
    const options = {
      method: 'GET',
      url: `https://api.covalenthq.com/v1/${network.chainId}/address/${address}/balances_v2/`,
      params:  {
        key: process.env.REACT_APP_COVALENT_API_KEY
      }
    }

    const data = await axios.request(options).then(function (response) {
      return response.data;
    }).catch(function (error) {
        console.log(error);
    });
    
    let tokens = data.data.items;

    let tokenAmounts = {};

    tokens.forEach(token => {
      let symbol = token.contract_ticker_symbol
      tokenAmounts[symbol] = this.web3.utils.fromWei(token.balance, 'ether');
      console.log(typeof(this.state.balanceETH), parseFloat(tokenAmounts[symbol]));


      if (symbol == "ETH" || symbol == "WETH") {
        this.setState({
          balanceETH: this.state.balanceETH + parseFloat(tokenAmounts[symbol])
        })

      }
      if (symbol === "MATIC") {
        this.setState({
          balanceMATIC: this.state.balanceMATIC + parseFloat(tokenAmounts[symbol])
        })
      }
      if (symbol === "AVAX") {
        this.setState({
          balanceAVAX: this.state.balanceAVAX + parseFloat(tokenAmounts[symbol])
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
        <Row>
          <Col>
            <h1>Balances</h1>
            <Row>
              ETH: {this.state.balanceETH}
            </Row>
            <Row>
              Matic: {this.state.balanceMATIC}
            </Row>
            <Row>
              Avax: {this.state.balanceAVAX}
            </Row>
          </Col>
          <Col>
            <h1>Transfer token</h1>
            <Row>
              1
            </Row>
            <Row>
              1
            </Row>
            <Row>
              1
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Home;
