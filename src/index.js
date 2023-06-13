import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import Home from './home';
import TemplateList from './display';
import FormPage from './form';
import FormData from './formData';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/display" element={<TemplateList />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/formdata" element={<FormData/>}/>
      
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
