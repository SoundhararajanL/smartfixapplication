import './App.css';
import Login from './login';
import Home from './home';
import FormPage from './form';
import TemplateList from './display';
import { Form } from 'react-router-dom';
function App() {
  return (
   <div>
     {/* <Login /> */}
     {/* < Home /> */}
     {/* <TemplateList /> */}
     <FormPage /> 
    </div>
  );
}

export default App;