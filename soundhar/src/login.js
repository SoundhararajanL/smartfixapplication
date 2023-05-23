import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './smartfix.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch('https://646b0c027d3c1cae4ce31370.mockapi.io/new')
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  const handleLogin = () => {
    const user = userData.find((user) => user.username === username && user.password === password);

    if (user) {
      toast.success('Login successful!', { position: toast.POSITION.TOP_CENTER });
    } else {
      toast.error('Invalid input', { position: toast.POSITION.TOP_CENTER });
    }
  };

  return (
    <div>
      <div>
        <div>
          <img src={logo} className='image' alt='Logo' />
        </div>
      </div>
      <body>
        <div className='container'>
          <h1>User Login</h1>
          <div>
            <input type='text' name='username' placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
            <input type='password' name='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
            <button className='button-29' onClick={handleLogin}>Login</button>
          </div>
          <div></div>
        </div>
      </body>
      <ToastContainer />
    </div>
  );
}

export default Login;
