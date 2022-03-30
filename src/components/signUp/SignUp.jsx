import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap'
import './signup.css'
import web3 from '../../utils/web3';

var randomWords = require('random-words');


function SignUp() {

  const [currentScreen, setCurrentScreen] = React.useState(1);
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [phrase, setphrase] = React.useState([])
  const [inputPhrase, setInputPhrase] = React.useState('')



  const navigate = useNavigate();

  const createPassword = () => {
    if (password !== confirmPassword) {
      alert('Password does not match')
    } else {
      setCurrentScreen(currentScreen + 1)
      setphrase(randomWords(10))
    }
  }

  const createWallet = () => {
    const userInput = inputPhrase.split(' ')
    if (JSON.stringify(userInput) !== JSON.stringify(phrase)) {
      alert('Incorrect phrase')
    } else {
      web3.eth.accounts.wallet.create(1, JSON.stringify(phrase));
      web3.eth.accounts.wallet.encrypt(password);
      web3.eth.accounts.wallet.save(password); //Stores the keystore in local storage
      loadWallet()
    }
  }

  const loadWallet = () => {
    web3.eth.accounts.wallet.load(password);
    renderDashBoard()
  }

  const renderDashBoard = () => {
    navigate('/dashboard')
  }

  return (
    <div className='signup-component'>
      {currentScreen === 1 && <div className='slide-1'>
        <Card className='text-center card-ctn'>
          <Card.Body>
            <Card.Title>Welcome !!</Card.Title>
            <Card.Text>
              Get Started by clicking on the button below to create a new wallet to store crypto and simplify cross-chain transactions.
            </Card.Text>
            <Button variant="primary" onClick={() => setCurrentScreen(currentScreen + 1)}>Create Wallet</Button>
          </Card.Body>
        </Card>
      </div>}
      {currentScreen === 2 && <div className='slide-2'>
        <Card className='text-center card-ctn'>
          <Card.Body>
            <Card.Title>Create a Password</Card.Title>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" onClick={createPassword}>
                Next
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>}
      {currentScreen === 3 && <div className='slide-3'>
        <Card className='text-center card-ctn'>
          <Card.Body>
            <Card.Title>Secure your wallet</Card.Title>
            <Card.Text>
              <div className='header-text'>
                We will be providing a secret recovery phrase which will allow you to recover your wallet in case you lose your password.
                Warning: Never disclose your recovery phrase to anyone and make sure to store it at a secure location. Anyone
                who has access to your recovery phrase can access your wallet.
              </div>
              <div className='phrase-ctn'>
                {phrase.map((word, index) => {
                  return (
                    <div className='phrase-word'>
                      <span>{word}</span>
                    </div>
                  )
                })}
              </div>
            </Card.Text>
            <Button variant="primary" onClick={() => setCurrentScreen(currentScreen + 1)}>Next</Button>
          </Card.Body>
        </Card>
      </div>}
      {currentScreen === 4 && <div className='slide-4'>
        <Card className='text-center card-ctn'>
          <Card.Body>
            <Card.Title>Confirm the Recovery Phrase</Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter your secret recovery phrase</Form.Label>
                <Form.Control type="text" placeholder="Recovery Phrase" value={inputPhrase} onChange={(e) => { setInputPhrase(e.target.value) }} />
              </Form.Group>
              <Button variant="primary" onClick={createWallet}>
                Confirm and Create Wallet
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>}
    </div>
  )
}

export default SignUp


//Signup Workflow
//Handle Authentication for accessing the dashboard