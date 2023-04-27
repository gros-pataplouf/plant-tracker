import { Link } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from '../helpers/axios';
import login from '../assets/icons/login.svg';
import logout from '../assets/icons/logout.svg';
import account from '../assets/icons/account.svg';
import hamburger from '../assets/icons/hamburger.svg';
import close from '../assets/icons/close.svg';

export default function Header ({props}) {
  const {isLoggedIn, setIsLoggedIn} = props;
  function logOutHandler(e) {
    axiosInstance.post('token/blacklist/', {
      'refresh': localStorage.getItem("planttrackerRefresh"),

    })
    .then(res => { console.log(res);
    localStorage.removeItem('planttrackerAccess');
    localStorage.removeItem('planttrackerRefresh');
    setIsLoggedIn(false);
    return window.location.href = '/'
  })

  }

  function toggleNav() {
    const nav = document.querySelector('nav');
    const map = document.querySelector('#map');
    nav.classList.toggle('hidden');
    //hide map bc high z index and pos absolute goes over nav div, does not work properly
    map.classList.toggle('hidden');

  }


  // as the header has fixed positining, the element directly following the sibling needs an additionnal padding of more than the height of the header. 

  // useEffect(() => {
  //   if (document.getElementById("header")) {
  //     const header = document.getElementById("header");
  //     const height = header.getBoundingClientRect().height;
  //     const headerSibling = header.nextElementSibling;
  //     headerSibling.setAttribute("style", `margin-top: ${2*height}px`)
  //   }
  // }, [])


  return (
    <div className="bg-kaki space-4 fixed top-0 p-2 w-screen z-10" id="header">
      <nav className="">
          <ul className="bg-kaki text-cream flex flex-col justify-center items-center p-4 fixed top-0 left-0 right-0 w-screen h-screen z-10 font-roboto-700 text-2xl [&>*:not(:first-child)]:my-8">
              <li className="absolute top-4 right-4" onClick={toggleNav}><img src={close} alt="" /></li>
              <li onClick={toggleNav}><Link to={'/'}>Plant Info</Link></li>
              <li onClick={toggleNav}><Link to={'explore/'}>Explore</Link></li>
              <li onClick={toggleNav}><Link to={'track/'}>Participate</Link></li>
              {isLoggedIn && <li onClick={toggleNav}><Link to={'account/'}>My Account</Link></li>}
              
          </ul>
      </nav>
      <div className="flex justify-between">
        {isLoggedIn?
        <div className="flex justify-end">
        <button onClick={logOutHandler}>
        <img  src={logout} alt="logout" />
        </button>
        </div>
        :
        <Link to={'login/'}><button>
          <img src={login} alt="login" />
          </button></Link>}
        
        <div className="sm:invisible" onClick={toggleNav}><img src={hamburger} alt="" /></div>
      </div>
    </div>
  )
}