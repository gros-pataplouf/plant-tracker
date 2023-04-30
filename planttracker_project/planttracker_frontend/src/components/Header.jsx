import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from '../helpers/axios';
import login from '../assets/icons/login.svg';
import logout from '../assets/icons/logout.svg';
import account from '../assets/icons/account.svg';
import hamburger from '../assets/icons/hamburger.svg';
import close from '../assets/icons/close.svg';


export default function Header ({props}) {
  const {isLoggedIn, setIsLoggedIn} = props;
  const [displayNav, setDisplayNav] = useState(false);


  function toggleNav() {
    setDisplayNav(!displayNav)

  }



  return (
    <div className="bg-emerald-950 space-4 fixed top-0 p-2 w-screen z-10" id="header">
      <nav className={displayNav ? '': 'hidden'}>
          <ul className="bg-emerald-950 text-cream flex flex-col justify-center items-center p-4 fixed top-0 left-0 right-0 w-screen h-screen z-10 font-roboto-700 text-2xl [&>*:not(:first-child)]:my-8">
              <li className="absolute top-4 right-4" onClick={toggleNav}><img src={close} alt="" /></li>
              <li onClick={toggleNav}><Link to={'/'}>Plant Info</Link></li>
              <li onClick={toggleNav}><Link to={'explore/'}>Explore</Link></li>
              <li onClick={toggleNav}><Link to={'track/'}>Participate</Link></li>
              {isLoggedIn && <li onClick={toggleNav}><Link to={'account/'}>My Account</Link></li>}
              
          </ul>
      </nav>
      
       <div className=" sm:invisible" onClick={toggleNav}><img className="ml-auto" src={hamburger} alt="" /></div>

    </div>
  )
}