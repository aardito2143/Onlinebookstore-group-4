import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./scenes/Login/Login";
import Register from "./scenes/Register/Register";
import Checkout from "./scenes/Checkout/Checkout";
import Success from './scenes/Success/Success';
import Dashboard from './scenes/Dashboard/Dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes/ProtectedRoutes';
import PersistLogin from './components/PersistLogin/PersistLogin';
import './App.css';
import AddProduct from './scenes/AddProduct/AddProduct';
import Home from './scenes/Home/Home';
import ErrorPage from './scenes/ErrorPage/ErrorPage';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/success' element={<Success />} />
          <Route element={<PersistLogin />}>
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/add-product" element={<AddProduct />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}