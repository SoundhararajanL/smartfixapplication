import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './smartfix.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!username || !email || !password) {
      toast.error('Please fill in all the required fields.', { position: toast.POSITION.TOP_CENTER });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{1,})?$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', { position: toast.POSITION.TOP_CENTER });
      return;
    }

    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long.', { position: toast.POSITION.TOP_CENTER });
      return;
    }

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    axios
      .post('http://localhost:3000/persons/signup', userData)
      .then((response) => {
        toast.success('User registered successfully!', { position: toast.POSITION.TOP_CENTER });
        navigate('/login', { state: { signupsuccess: true } });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error occurred while registering user!', { position: toast.POSITION.TOP_CENTER });
      });
  };

  const handleReset = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <header>
        <div>
          <img src={logo} alt='logo' className='image' />
        </div>
      </header>
      <body>
        <div className='signup-box'>
          <h1>User Registration</h1>
          <div>
            <input
              type='text'
              name='username'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='button-3' onClick={handleSignup}>
              Submit
            </button>
            <button className='button-3' onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </body>
      <ToastContainer position='top-center' />
    </div>
  );
}

export default Signup;
