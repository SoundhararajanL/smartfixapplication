import {  useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './smartfix.png';
import 'react-toastify/dist/ReactToastify.css';


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    const userData = {
      username: username,
      email: email,
      password: password,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };

    fetch('https://646b0c027d3c1cae4ce31370.mockapi.io/new', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        toast.success('User registered successfully!', { position: toast.POSITION.TOP_CENTER });
      })
      .catch((error) => {
        toast.error('Error occurred while registering user!', { position: toast.POSITION.TOP_CENTER });
      });
  };

  return (
    <div>
      <header>
        <div>
          <img src={logo} alt='logo' className='image' />
        </div>
      </header>
      <body>
        <div className='container'>
          <h1>User Registration</h1>
          <div>
            <input type='text' name='username' placeholder='Username' onChange={(e) => setUsername(e.target.value)} aria-required />
            <input type='email' name='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} aria-required />
            <input type='password' name='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} aria-required />
            <button className='button-29' onClick={handleSignup}>Submit</button>
          </div>
        </div>
      </body>
      <ToastContainer />
    </div>
  );
}

export default Signup;