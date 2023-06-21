import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./components/elements/Header";

const classes = {
  wrapper: "relative",
  main: "absolute top-[10vh] flex flex-col w-screen overflow-x-clip",
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
