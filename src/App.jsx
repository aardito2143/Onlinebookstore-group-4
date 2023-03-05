import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./scenes/Login/Login";
import Register from "./scenes/Register/Register";
import Checkout from "./scenes/Checkout/Checkout";
import Success from './scenes/Checkout/Success';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/success' element={<Success />} />

        </Routes>
      </Router>
    </div>
  );
}