import { Link } from "react-router-dom";
import { useState } from "react";
import close from "../../assets/icons/close.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import home from "../../assets/icons/home.svg";


export default function NavMobile(props) {
    const [displayNav, setDisplayNav] = useState(false);
    const {isLoggedIn, setIsLoggedIn} = props;
    function toggleNav() {
        setDisplayNav(!displayNav);
      }
    return (<>
          <img
        className="fixed z-30 p-2 rounded-full md:hidden bg-emerald-900 top-2 right-2"
        src={hamburger}
        alt="hamburger menu"
        onClick={toggleNav}
      />

      <nav className={displayNav ? "md:hidden" : "hidden"}>
        <ul className="bg-emerald-950 flex flex-col justify-center items-center p-4 fixed top-0 left-0 right-0 w-screen h-screen z-30 font-roboto-700 text-2xl [&>*:not(:first-child)]:my-8 [&>li]:text-yellow-50 [&>li]:text-4xl [&>li:not(:first-child)]:py-7">
          <li
            className="fixed p-2 rounded-full top-2 right-2 bg-emerald-900"
            onClick={toggleNav}
          >
            <img src={close} alt="" />
          </li>
          <li
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <img src={home} alt="" />
          </li>
          <li onClick={toggleNav}>
            <Link to={"plants/"}>Plant Info</Link>
          </li>
          <li onClick={toggleNav}>
            <Link to={"explore/"}>Explore</Link>
          </li>
          <li onClick={toggleNav}>
            <Link 
            onClick={() => {!isLoggedIn && window.alert("Please login or create an account to submit your data."); window.location.href = '/login?track'}}
            to={"track/"}>Participate</Link>
          </li>
          {isLoggedIn && (
            <li onClick={toggleNav}>
              <Link to={"account/"}>My Account</Link>
            </li>
          )}
        </ul>
      </nav>

    
    </>)
}