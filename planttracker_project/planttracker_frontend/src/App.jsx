import { useState } from "react"

import Explore from "./components/Explore"
import Header from "./components/Header"
import Home from "./components/Home"
import Track from "./components/Track"
import Login from "./components/Login"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <> M *

    <Header/>
    {/* <Explore/> */}
    {!isLoggedIn? <Track/>:<Login/> }
{/*     
    <Home/> */}

    </>
  )
}

export default App;
