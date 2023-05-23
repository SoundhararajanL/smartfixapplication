import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './smartfix.png';
import { Link } from 'react-router-dom';

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

    if (!username || !password) {
      toast.error('Please fill in all the required fields.', { position: toast.POSITION.TOP_CENTER });
      return;
    }
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
            <input type='text' name='username' placeholder='Username' onChange={(e) => setUsername(e.target.value.trim())}  />
            <input type='password' name='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}  />
            <button className='button-3' onClick={handleLogin}>Login</button>
          </div>
          <div>
            <Link className='text' to='/signup'><h5>Or sign Up Using</h5></Link>
          </div>
        </div>
      </body>
      <ToastContainer />
    </div>
  );
}

export default Login;
