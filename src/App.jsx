import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Signup from './components/signUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="app">
       <h1>Cross Chain Wallet</h1>
       <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  );
}

export default App;
