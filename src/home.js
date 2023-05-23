import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const location = useLocation();
  const loginSuccess = location.state?.loginSuccess;

  useEffect(() => {
    if (loginSuccess) {
      toast.success('Login successful!', { position: toast.POSITION.TOP_CENTER });
    }
  }, [loginSuccess]);

  return (
    <div>
      {/* Home page content */}
      <h1>Hello</h1>
      <ToastContainer />
    </div>
  );
}

export default Home;
