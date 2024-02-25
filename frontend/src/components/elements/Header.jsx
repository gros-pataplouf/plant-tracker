import { useState } from "react";
import { Link } from "react-router-dom";
import close from "../../assets/icons/close.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import home from "../../assets/icons/home.svg";
import Logout from "./Logout";

export default function Header({ props }) {
  const { isLoggedIn, setIsLoggedIn } = props;
  const [displayNav, setDisplayNav] = useState(false);

  function toggleNav() {
    setDisplayNav(!displayNav);
  }

  return (
    <div
      className="absolute top-0 h-[10vh] bg-emerald-950 space-4 w-screen"
      id="header"
    >
      {!isLoggedIn ? (
        <div className="py-2 md:py-4 bg-emerald-950 h-[4vh] flex items-center">
          <button className="px-2 ml-6 font-bold rounded-lg md:text-3xl text-emerald-950 bg-yellow-50">
            <Link data-testid="loginLink" to={"login/"}>Log in</Link>
          </button>
          <span className="ml-3 text-yellow-50 md:text-3xl"> or</span>
          <button className="px-2 font-bold rounded-lg md:text-3xl text-yellow-50">
            <Link to={"register/"}>Sign up</Link>
          </button>
        </div>
      ) : (
        <Logout props={{ isLoggedIn, setIsLoggedIn }} />
      )}

      <nav id="titleContainer" className="flex items-center">
        <ul className="z-30 flex w-screen [&>li]:text-4xl [&>li]:flex [&>li]:justify-start [&>li]:items-center text-white [&>li:not(:first-child)]:mx-auto bg-emerald-950 font-roboto-700">
          <li className="flex">
            <Link to={"/"}>
              <svg
                className="ml-4"
                xmlns="http://www.w3.org/2000/svg"
                height={window.innerHeight < 768 ? 32 : 48}
                viewBox="0 96 960 960"
                width={window.innerHeight < 768 ? 32 : 48}
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                <path
                  d="M196 898q-48.594-49-74.797-113.37Q95 720.26 95 654q0-75.984 27.5-140.992T203 395q45-45 111-71.5T459.5 285Q539 273 629 272t183 6q9 90 9.5 179.5T810 627.75q-12 80.75-39 149.063Q744 845.126 697 892q-50.936 51.961-114.331 79.98Q519.275 1000 447.696 1000 373 1000 311.5 977T196 898Zm125-26q25.678 17 58.339 25t68.06 8q50.887 0 98.744-21.5T632 823q34-35 53.5-89.5T714 616q9-63 10-128.5T722 366q-91-3-163.5 2t-128 17Q375 397 336 416t-62 43q-39 39-62 86.341-23 47.341-23 93.559 0 43.695 18 94.397Q225 784 255.288 815 302 723 373 649t162-124q-83 76-136 162.5T321 872Zm0 0Zm0 0Z"
                  fill="#fefce8"
                />
              </svg>
            </Link>

            <Link to={"/"}>
              <h1 className="self-center h-full p-4 text-5xl font-normal text-yellow-50 md:text-5xl hover:underline">
                Plant-Tracker
              </h1>
            </Link>
          </li>
          <li className="hidden md:inline-block">
            <Link
              id="#"
              className="hidden md:inline-block hover:underline decoration-yellow-200"
              to={"plants/"}
            >
              Plant Info
            </Link>
          </li>
          <li className="hidden md:inline-block">
            <Link
              className="hidden md:inline-block hover:underline decoration-red-200"
              to={"explore/"}
            >
              Explore
            </Link>
          </li>
          <li className="hidden md:inline-block">
            <Link
              className="hidden md:inline-block hover:underline decoration-purple-200"
              to={"track/"}
            >
              Participate
            </Link>
          </li>
          {isLoggedIn && (
            <li className="hidden md:inline-block">
              <Link
                className="hidden md:inline-block hover:underline decoration-blue-200"
                to={"account/"}
              >
                My Account
              </Link>
            </li>
          )}
        </ul>
      </nav>

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
