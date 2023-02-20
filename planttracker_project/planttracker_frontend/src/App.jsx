import { useState } from "react"

import Explore from "./components/Explore"
import Header from "./components/Header"
import Home from "./components/Home"
import Track from "./components/Track"
import LocateButton from "./components/LocateButton"


function App() {
  return (
    <>
    <Header/>
    <LocateButton/>
    <Track/>
{/*     
    <Home/> */}

    </>
  )
}

export default App;
