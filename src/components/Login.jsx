import React,{useContext} from 'react'
import {Card,Button,Form} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function Login() {

    const [password,setPassword] = React.useState('')

    const navigate = useNavigate();


    const handleLogin = () => {
      if(password === localStorage.getItem('password')){
        renderDashboard()
      }else{
        alert('Incorrect password')
      }
    }

    const renderDashboard = () => {
      navigate('/dashboard')
    }

    return (
    <div className='login-ctn'>
    <Card className='text-center card-ctn'>
    <Card.Body>
    <Card.Title>Welcome back !!</Card.Title>
    <Form>
   <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Enter password to login</Form.Label>
    <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
  </Form.Group>
  <Button variant="primary" onClick = {handleLogin}>
    Login
  </Button>
</Form>
  </Card.Body>
</Card>
    </div>
  )
}

export default Login