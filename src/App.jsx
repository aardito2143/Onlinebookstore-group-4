import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./scenes/Login/Login";
import Register from "./scenes/Register/Register";
import Checkout from "./scenes/Checkout/Checkout";
import Success from './scenes/Checkout/Success';
import Dashboard from './scenes/Dashboard/Dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes/ProtectedRoutes';
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
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}