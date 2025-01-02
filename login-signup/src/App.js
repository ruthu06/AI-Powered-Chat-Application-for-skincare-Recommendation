import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/loginsignup/signup';
import LoginSignup from './components/loginsignup/loginsignup';
import Dashboard from './components/loginsignup/dashboard';
import { useState } from 'react';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const[name,setName]= useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} setName={setName} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} setName={setName} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard name={name} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;