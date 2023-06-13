import { useState } from "react";
import { Link } from "react-router-dom";
import close from '../../assets/icons/close.svg';
import hamburger from '../../assets/icons/hamburger.svg';


const classes = {
  wrapper: 'absolute top-0 h-[10vh] bg-emerald-950 space-4 p-2 w-screen z-10"',
  mobileMenu: "bg-emerald-950 flex flex-col justify-center items-center p-4 fixed top-0 left-0 right-0 w-screen h-screen z-30 font-roboto-700 text-2xl [&>*:not(:first-child)]:my-8 [&>li]:text-yellow-50 [&>li]:text-4xl [&>li]:py-7",
  mobileMenuClose: "absolute top-4 right-4", 
  hamburger: " [&>img]:ml-auto"
}

export default function Header ({props}) {
  const {isLoggedIn, setIsLoggedIn} = props;
  const [displayNav, setDisplayNav] = useState(false);


  function toggleNav() {
    setDisplayNav(!displayNav)
  }



  return (
    <div className={classes.wrapper} id="header">
      <nav className={displayNav ? '': 'hidden'}>
          <ul className={classes.mobileMenu}>
              <li className={classes.mobileMenuClose} onClick={toggleNav}><img src={close} alt="" /></li>
              <li onClick={toggleNav}><Link to={'plants/'}>Plant Info</Link></li>
              <li onClick={toggleNav}><Link to={'explore/'}>Explore</Link></li>
              <li onClick={toggleNav}><Link to={'track/'}>Participate</Link></li>
              {isLoggedIn && <li onClick={toggleNav}><Link to={'account/'}>My Account</Link></li>}
          </ul>
      </nav>
      
       <div className={classes.hamburger} onClick={toggleNav}><img src={hamburger} alt="" /></div>

    </div>
  )
}