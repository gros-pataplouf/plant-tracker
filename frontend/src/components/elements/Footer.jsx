import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../helpers/axios";
import home from '../../assets/icons/home.svg';
import login from '../../assets/icons/login.svg';
import logout from '../../assets/icons/logout.svg';

const classes = {
  wrapper: 'absolute z-20 top-[90vh] h-[10vh] bg-emerald-950 text-cream flex justify-between space-4 p-2 w-screen'
}

export default function Header ({props}) {
  const {isLoggedIn, setIsLoggedIn} = props;
  const [displayNav, setDisplayNav] = useState(false);
  function logOutHandler(e) {
    axiosInstance.post('accounts/token/blacklist/', {
      'refresh': localStorage.getItem("planttrackerRefresh"),
    })
    .then(res => {
    console.log(res);
    localStorage.removeItem('planttrackerAccess');
    localStorage.removeItem('planttrackerRefresh');
    setIsLoggedIn(false);
    return window.location.href = '/'
  })
}

  return (
    <div className={classes.wrapper} id="footer">
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