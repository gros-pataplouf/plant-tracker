import React from "react";
import { lazy, Suspense } from 'react';
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import AnimationLoading from "./components/elements/AnimationLoading";
const Account = lazy(() => import("./components/scenes/Account/Account"));
const PlantList = lazy(() => import("./components/scenes/PlantList/PlantList"));
const Activate = lazy(() => import ("./components/scenes/Activate/Activate"));
const ErrorPage = lazy(() => import ("./components/scenes/ErrorPage/ErrorPage"));
const Explore = lazy(() => import ("./components/scenes/Explore/Explore"));
const Hero = lazy(() => import("./components/scenes/Hero/Hero"));
const LocationDetail = lazy(() => import("./components/scenes/LocationDetail/LocationDetail"));
const Login = lazy(() => import("./components/scenes/Login/Login"));
const PlantDetail = lazy(() => import("./components/scenes/PlantDetail/PlantDetail"));
const Register = lazy(() => import("./components/scenes/Register/Register"));
const Reset = lazy(() => import("./components/scenes/Reset/Reset"));
const Track = lazy(() => import ("./components/scenes/Track/Track"));

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "plants/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <PlantList />,
        </Suspense>
      },
      {
        path: "/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Hero />,
        </Suspense>
      },
      {
        path: "plants/:id/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <PlantDetail />,
        </Suspense>
      },
      {
        path: "register/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Register />,
        </Suspense>
      },
      {
        path: "login/",
        element:
        <Suspense fallback={<AnimationLoading/>}>
        <Login />
        </Suspense>
      },
      {
        path: "track/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Track />,
        </Suspense>
      },
      {
        path: "activate/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Activate />,
        </Suspense>
      },
      {
        path: "explore/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Explore />,
        </Suspense>
      },
      {
        path: "locations/:id/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <LocationDetail />,
        </Suspense>
      },
      {
        path: "reset/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Reset />,
        </Suspense>
      },
      {
        path: "account/",
        element: 
        <Suspense fallback={<AnimationLoading/>}>
          <Account />,
        </Suspense>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
