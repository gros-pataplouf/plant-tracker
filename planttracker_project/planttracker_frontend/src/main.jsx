import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Explore from "./components/Explore"
import Header from "./components/Header"
import Track from "./components/Track"
import Login from "./components/Login"
import Register from "./components/Register"
import Activate from "./components/Activate"


import './index.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';



const routing = 
  <Router>
  <React.StrictMode>
      <Header/>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="register/" element={<Register/>}/>
        <Route path="login/" element={<Login/>}/>
        <Route path="track/" element={<Track/>}/>
        <Route path="activate/" element={<Activate/>}/>

      </Routes>
    </React.StrictMode>
  
  </Router>

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(routing);
