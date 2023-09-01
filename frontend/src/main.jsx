import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Account from "./components/scenes/Account/Account";
import Activate from "./components/scenes/Activate/Activate";
import ErrorPage from "./components/scenes/ErrorPage/ErrorPage";
import Explore from "./components/scenes/Explore/Explore";
import Hero from "./components/scenes/Hero/Hero";
import LocationDetail from "./components/scenes/LocationDetail/LocationDetail";
import Login from "./components/scenes/Login/Login";
import PlantDetail from "./components/scenes/PlantDetail/PlantDetail";
import PlantList from "./components/scenes/PlantList/PlantList";
import Register from "./components/scenes/Register/Register";
import Reset from "./components/scenes/Reset/Reset";
import Track from "./components/scenes/Track/Track";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "plants/",
        element: <PlantList />,
      },
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "plants/:id/",
        element: <PlantDetail />,
      },
      {
        path: "register/",
        element: <Register />,
      },
      {
        path: "login/",
        element: <Login />,
      },
      {
        path: "track/",
        element: <Track />,
      },
      {
        path: "activate/",
        element: <Activate />,
      },
      {
        path: "explore/",
        element: <Explore />,
      },
      {
        path: "locations/:id/",
        element: <LocationDetail />,
      },
      {
        path: "reset/",
        element: <Reset />,
      },
      {
        path: "account/",
        element: <Account />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
