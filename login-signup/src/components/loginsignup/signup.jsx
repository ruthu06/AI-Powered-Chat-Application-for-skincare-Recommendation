import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({setIsAuthenticated,setName}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submit, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  

  const handleSignup = async(e) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signup Data:', { username, email, password });
    e.preventDefault();
    setIsSubmitted(true);

    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password ,confirmPassword}),
    });

    const data = await response.json();

    if (response.ok) {
      setIsAuthenticated(true);
      setMessage(data.msg);
      setName(username);  
      navigate('/dashboard'); 
    } else {
      setMessage(data.msg);
    }
    
  };

  const handleLoginClick = () => {
    console.log('Redirect to Login Page');
    navigate('/');
  };

  return (
    <div
      className="Signup"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: '#FFC8DD',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Welcome Header */}
      <div
        className="Welcome"
        style={{
          color: 'black',
          fontSize: '4vw',
          fontFamily: 'Italiana',
          fontWeight: '5',
          textAlign: 'center',
          marginBottom: '4vh',
          wordWrap: 'break-word',
        }}
      >
        SIGNUP!
      </div>

      {/* Username Field */}
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: '20%',
          maxWidth: '700px',
          height: '8vh',
          maxHeight: '100px',
          background: '#F5F5F5',
          borderRadius: '50px',
          marginBottom: '4vh',
          padding: '10px 20px',
          fontSize: '1vw',
          fontFamily: 'Jacques Francois',
          fontWeight: '400',
          border: 'none',
          outline: 'none',
        }}
      />

      {/* Password Field */}
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '20%',
          maxWidth: '700px',
          height: '8vh',
          maxHeight: '100px',
          background: '#F5F5F5',
          borderRadius: '50px',
          marginBottom: '4vh',
          padding: '10px 20px',
          fontSize: '1vw',
          fontFamily: 'Jacques Francois',
          fontWeight: '400',
          border: 'none',
          outline: 'none',
        }}
      />

      {/* Confirm Password Field */}
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{
          width: '20%',
          maxWidth: '700px',
          height: '8vh',
          maxHeight: '100px',
          background: '#F5F5F5',
          borderRadius: '50px',
          marginBottom: '4vh',
          padding: '10px 20px',
          fontSize: '1vw',
          fontFamily: 'Jacques Francois',
          fontWeight: '400',
          border: 'none',
          outline: 'none',
        }}
      />

      {/* Submit Button */}
      <button
        onClick={handleSignup}
        style={{
          width: '15%',
          maxWidth: '450px',
          height: '10vh',
          maxHeight: '100px',
          background: '#CDB4DB',
          borderRadius: '50px',
          marginTop: '4vh',
          marginBottom: '1vh',
          fontSize: '2vw',
          fontFamily: 'Jacques Francois',
          fontWeight: '400',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        SIGNUP
      </button>
      {(message && <div style={{
      color: 'red',
    }}>{message}</div>)}
      {/* Already Have an Account */}
      <div
        className="AlreadyHaveAnAccountLogin"
        style={{
          color: 'black',
          fontSize: '2vw',
          fontFamily: 'Jacques Francois',
          fontWeight: '400',
          textAlign: 'center',
        }}
      >
        <span>Already have an account? </span>
        <span
          onClick={handleLoginClick}
          style={{
            color: '#CDB4DB',
            fontSize: '2vw',
            fontFamily: 'Jacques Francois',
            fontWeight: '800',
            textAlign: 'center',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default Signup;

