import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({setIsAuthenticated}) => {
  const[username,setUserName]= useState('');
  const[password,setPassword]= useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  


  const handlelogin = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log('Logging in with:', username, password);

    const response = await fetch('/',
       {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    const data = await response.json();
    

    if (response.ok) {
      setIsAuthenticated(true);
      setMessage(data.msg);
      navigate('/dashboard'); // Redirect to dashboard or home page after successful login
    } else {
      setMessage(data.msg);
    }
  };
  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
<div className="Login"style={{width: '100vw', 
  height: '100vh', 
  position: 'relative', 
  background: '#FFC8DD',
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center'
}}><div className="Welcome" style={{
    color: 'black', 
    fontSize: '4vw', 
    fontFamily: 'Italiana', 
    fontWeight: '5', 
    textAlign: 'center', 
    marginBottom: '4vh',
    wordWrap:'break-word',
  }}>WELCOME!</div><input 
    type="text" 
    placeholder="Username" 
    onChange={(e)=>{setUserName(e.target.value)}}
    style={{
      width: '30%', 
      maxWidth: '700px', 
      height: '10vh', 
      maxHeight: '100px', 
      background: '#F5F5F5', 
      borderRadius: '50px', 
      marginBottom: '4vh', 
      padding: '10px 20px', 
      fontSize: '3vw', 
      fontFamily: 'Jacques Francois', 
      fontWeight: '400',
      border: 'none',
      outline: 'none'
    }} 
  /><input 
    type="password" 
    placeholder="Password" 
    onChange={(e)=>{setPassword(e.target.value)}}
    style={{
      width: '30%', 
      maxWidth: '700px', 
      height: '10vh', 
      maxHeight: '100px', 
      background: '#F5F5F5', 
      borderRadius: '50px', 
      marginBottom: '4vh', 
      padding: '10px 20px', 
      fontSize: '3vw', 
      fontFamily: 'Jacques Francois', 
      fontWeight: '400',
      border: 'none',
      outline: 'none'
    }} 
  /><button  onClick={handlelogin} style={{
    width: '15%', 
    maxWidth: '450px', 
    height: '10vh', 
    maxHeight: '100px', 
    background: '#CDB4DB', 
    borderRadius: '50px',
    marginTop:'4vh' ,
    marginBottom: '1vh',
    fontSize: '2vw', 
    fontFamily: 'Jacques Francois', 
    fontWeight: '400',
    border: 'none',
    outline: 'none',
    cursor: 'pointer'
  }}>SUBMIT</button>
  <div className="AlreadyHaveAnAccountSignup" style={{
  color: 'black', 
  fontSize: '2vw', 
  fontFamily: 'Jacques Francois', 
  fontWeight: '400', 
  textAlign: 'center',
}}>
  <span>Already have an account? </span><span 
    onClick={handleSignUpClick} 
    style={{
      color:  '#CDB4DB', 

      fontSize: '2vw', 
      fontFamily: 'Jacques Francois', 
      fontWeight: '800', 
      textAlign: 'center', 
      textDecoration: 'underline', 
      cursor: 'pointer',
    }}>
    Signup
  </span>
</div>

    </div>
  );
};

export default Login;
