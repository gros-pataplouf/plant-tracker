import { useState, useEffect } from "react";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";

export default function Header({ props }) {
  const { isLoggedIn, setIsLoggedIn } = props;
  const [ isDesktop, setIsDesktop ] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsDesktop(false);
    }
  }, [])
  return (
    <div
      className="absolute top-0 h-[10vh] bg-emerald-950 space-4 w-screen"
      id="header"
    >
      {
        isDesktop ?
        <NavDesktop isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        :
        <NavMobile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      }
    </div>
  );
}
