import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./scenes/Login/Login";
import Register from "./scenes/Register/Register";
import './App.css';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}