import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./components/elements/Header";

const classes = {
  wrapper: "relative 100vh touch-none",
  main: "absolute top-[10vh] flex flex-col h-[80vh] w-screen overflow-x-clip",
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("planttrackerAccess"))
  );
  return (
    <div className={classes.wrapper}>
      <Header props={{ isLoggedIn, setIsLoggedIn }} />
      <div className={classes.main} id="detail">
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </div>
    </div>
  );
}

export default App;
