import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import close from "../../assets/icons/close.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import home from "../../assets/icons/home.svg";

const classes = {
  wrapper: "absolute top-0 h-[10vh] bg-emerald-900 space-4 w-screen",
  mobileMenu:
    "bg-emerald-950 flex flex-col justify-center items-center p-4 fixed top-0 left-0 right-0 w-screen h-screen z-30 font-roboto-700 text-2xl [&>*:not(:first-child)]:my-8 [&>li]:text-yellow-50 [&>li]:text-4xl [&>li:not(:first-child)]:py-7",
  mobileMenuClose: "fixed p-2 top-2 right-2 bg-emerald-900 rounded-full",
  hamburger: "z-30 bg-emerald-950 p-2 rounded-full fixed top-2 right-2",
  title: "text-yellow-50 p-4 text-5xl",
  titleContainer: "flex pl-4",
  login:
    "pt-2 bg-emerald-950 [&>*]:text-yellow-50 [&>*]:font-bold h-[2.5rem] max-h-[8vh] min-h-[4vh]",
  button: "[&>*]:text-yellow-50 [&>*]:font-bold rounded-lg px-2",
  buttonHighlighted:
    "[&>*]:text-emerald-950 [&>*]:font-bold ml-6 bg-yellow-50 rounded-lg px-2",
  svg: "m-2",
};

export default function Header({ props }) {
  const { isLoggedIn, setIsLoggedIn } = props;
  const [displayNav, setDisplayNav] = useState(false);

  function toggleNav() {
    setDisplayNav(!displayNav);
  }

  return (
    <div className={classes.wrapper} id="header">
      {!isLoggedIn ? (
        <div className={classes.login}>
          <button className={classes.buttonHighlighted}>
            <Link to={"login/"}>Log in</Link>
          </button>
          <span> or</span>
          <button className={classes.button}>
            <Link to={"register/"}>Sign up</Link>
          </button>
        </div>
      ) : (
        <Logout props={{ isLoggedIn, setIsLoggedIn }} />
      )}

      <div id="titleContainer" className={classes.titleContainer}>
        <svg
          className={classes.svg}
          xmlns="http://www.w3.org/2000/svg"
          height="32"
          viewBox="0 96 960 960"
          width="32"
        >
          <path
            d="M196 898q-48.594-49-74.797-113.37Q95 720.26 95 654q0-75.984 27.5-140.992T203 395q45-45 111-71.5T459.5 285Q539 273 629 272t183 6q9 90 9.5 179.5T810 627.75q-12 80.75-39 149.063Q744 845.126 697 892q-50.936 51.961-114.331 79.98Q519.275 1000 447.696 1000 373 1000 311.5 977T196 898Zm125-26q25.678 17 58.339 25t68.06 8q50.887 0 98.744-21.5T632 823q34-35 53.5-89.5T714 616q9-63 10-128.5T722 366q-91-3-163.5 2t-128 17Q375 397 336 416t-62 43q-39 39-62 86.341-23 47.341-23 93.559 0 43.695 18 94.397Q225 784 255.288 815 302 723 373 649t162-124q-83 76-136 162.5T321 872Zm0 0Zm0 0Z"
            fill="#fefce8"
          />
        </svg>
        <h2 className={classes.title}>Planttracker</h2>
      </div>
      <img
        className={classes.hamburger}
        src={hamburger}
        alt=""
        onClick={toggleNav}
      />

      <nav className={displayNav ? "" : "hidden"}>
        <ul className={classes.mobileMenu}>
          <li className={classes.mobileMenuClose} onClick={toggleNav}>
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
            <Link to={"track/"}>Participate</Link>
          </li>
          {isLoggedIn && (
            <li onClick={toggleNav}>
              <Link to={"account/"}>My Account</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
