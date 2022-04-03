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
      totalBalanceETH: 0,
      totalBalanceMATIC: 0,
      totalBalanceAVAX: 0,
      balanceETHKovan: 0,
      balanceETHPolygon: 0,
      balanceETHAvalanche: 0,

    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(networks.Polygon.rpc));
  }

  componentDidMount(){
    this.getData(networks.Polygon);
    this.getData(networks.Avalanche);
    this.getData(networks.Kovan);
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
      console.log(token);
      let symbol = token.contract_ticker_symbol
      tokenAmounts[symbol] = this.web3.utils.fromWei(token.balance, 'ether');

      if (symbol == "ETH" || symbol == "WETH") {
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
