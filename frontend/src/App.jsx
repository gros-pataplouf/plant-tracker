import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/elements/Header";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("planttrackerAccess"))
  );
  window.addEventListener("storage", () => {
    setIsLoggedIn(Boolean(localStorage.getItem("planttrackerAccess")));
  });
  function discardTooltips(e) {
    const openTooltips = document.querySelectorAll(
      "div[role=tooltip]:not(.hidden)"
    );
    openTooltips.forEach((elt) => {
      elt.classList.toggle("hidden");
    });
  }

  return (
    <div className="relative" onClick={discardTooltips}>
      <Header props={{ isLoggedIn, setIsLoggedIn }} />
      <div
        className="absolute top-[10vh] min-h-[90vh] flex flex-col w-screen overflow-x-clip background bg-cover"
        id="detail"
      >
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </div>
    </div>
  );
}

export default App;
