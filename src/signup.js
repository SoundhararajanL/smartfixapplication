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
        toast.success('User registered successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
          onClose: () => {
            navigate('/login', { state: { loginSuccess: true } });
          }
        });
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
    //   <div>
    //     <header>
    //       <div>
    //         <img src={logo} alt='logo' className='image' />
    //       </div>
    //     </header>
    //     <body>
    //       <div className='signup-box'>
    //         <h1>User Registration</h1>
    //         <div>
    //           <input
    //             type='text'
    //             name='username'
    //             placeholder='Username'
    //             value={username}
    //             onChange={(e) => setUsername(e.target.value.trim())}
    //           />
    //           <input
    //             type='email'
    //             name='email'
    //             placeholder='Email'
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value.trim())}
    //           />
    //           <input
    //             type='password'
    //             name='password'
    //             placeholder='Password'
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //           />
    //           <button className='button-3' onClick={handleSignup}>
    //             Submit
    //           </button>
    //           <button className='button-3' onClick={handleReset}>
    //             Reset
    //           </button>
    //         </div>
    //       </div>
    //     </body>
    //     <ToastContainer position='top-center' /> 

    // </div>

    <div>
      <section class="vh-100" >
        <div class="container h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-12 col-xl-11">
              <div class="si-card">
                <div class="card-body p-md-5">
                  <div class="row justify-content-center">
                    <div class="sign-card">

                      <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                      <form class="mx-1 mx-md-4">

                        <div class="d-flex flex-row align-items-center mb-4">
                          <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="form3Example1c">Your Name</label>
                            <input type="text" id="form3Example1c"
                              value={username}
                              required
                              placeholder='Enter Your Name'
                              onChange={(e) => setUsername(e.target.value.trim())}
                              class="form-control" />

                            
                          </div>
                        </div>

                        <div class="d-flex flex-row align-items-center mb-4">
                          <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="form3Example3c">Your Email</label>
                            <input type="email" id="form3Example3c"
                              value={email}
                              placeholder='Enter Your Email'
                              onChange={(e) => setEmail(e.target.value.trim())}
                              class="form-control" />
                           
                          </div>
                        </div>

                        <div class="d-flex flex-row align-items-center mb-4">
                          <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="form3Example4c">Password</label>
                            <input type="password" id="form3Example4c"
                              value={password}
                              placeholder='Enter Your Password'
                              onChange={(e) => setPassword(e.target.value)}
                              class="form-control" />
                            
                          </div>
                        </div>



                        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button type="button" class="btn btn-success btn-lg mr-2"
                          onClick={handleSignup}
                          >Submit</button>
                          <button type="button" class="btn btn-danger btn-lg"
                          onClick={handleReset}
                          >Reset</button>
                        </div>



                      </form>

                    </div>
                    <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        class="sign-image" alt="Sample image" />

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer position='top-center' /> 
    </div>
  );
}

export default Signup;
