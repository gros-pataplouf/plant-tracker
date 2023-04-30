import { Link } from "react-router-dom";
import { useState } from "react";
import axiosInstance from '../helpers/axios';
import login from '../assets/icons/login.svg';
import logout from '../assets/icons/logout.svg';
import home from '../assets/icons/home.svg';


export default function Header ({props}) {
  const {isLoggedIn, setIsLoggedIn} = props;
  const [displayNav, setDisplayNav] = useState(false);
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




  return (
    <div className="bg-emerald-950 text-cream flex justify-between space-4 fixed bottom-0 p-2 w-screen z-10" id="header">
        <div className="sm:invisible" onClick={() => {window.location.href='/'}}><img src={home} alt="" /></div>
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
        
    </div>
  )
}