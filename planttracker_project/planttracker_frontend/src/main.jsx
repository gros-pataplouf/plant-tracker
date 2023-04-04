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
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>, 
    children: [
      {
        path:'register/',
        element: <Register/>
      },
      {
        path:'login/',
        element: <Login/>
      },
      {
        path:'track/',
        element: <Track/>
      },
      {
        path:'activate/',
        element: <Activate/>
      },
      {
        path:'explore/',
        element: <Explore/>
      },
    ]
  }, 
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
