import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Explore from "./components/Explore"
import Track from "./components/Track"
import Login from "./components/Login"
import Register from "./components/Register"
import Activate from "./components/Activate"
import PlantList from './components/PlantList'
import PlantDetail from './components/PlantDetail';
import LocationDetail from './components/LocationDetail';
import Account from './components/Account';
import Reset from './components/Reset';
import Hero from './components/Hero';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
// 0.588235294118,
const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>, 
    children: [
      {
        path:'plants/',
        element: <PlantList/>, 
      },
      {
        path:'/',
        element: <Hero/>, 
      },
      {
        path: 'plants/:id/',
        element: <PlantDetail/>
      },
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
      {
        path: 'locations/:id/',
        element: <LocationDetail/>
      },
      {
        path:'reset/',
        element: <Reset/>
      },
      {
        path:'account/',
        element: <Account/>
      },
    ]
  }, 
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
