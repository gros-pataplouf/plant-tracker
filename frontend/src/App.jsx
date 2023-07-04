import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./components/elements/Header";

const classes = {
  wrapper: "relative",
  main: "absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 flex flex-col w-screen overflow-x-clip",
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("planttrackerAccess"))
  );
  function discardTooltips(e) {
    const openTooltips = document.querySelectorAll(
      "div[role=tooltip]:not(.hidden)"
    );
    openTooltips.forEach((elt) => {
      elt.classList.toggle("hidden");
    });
  }
  return (
    <div className={classes.wrapper} onClick={discardTooltips}>
      <Header props={{ isLoggedIn, setIsLoggedIn }} />
      <div className={classes.main} id="detail">
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </div>
    </div>
  );
}

export default App;
