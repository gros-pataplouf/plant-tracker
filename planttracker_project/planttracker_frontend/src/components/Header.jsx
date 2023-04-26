import { Link } from "react-router-dom";
import axiosInstance from '../helpers/axios';
import login from '../assets/icons/login.svg'
import logout from '../assets/icons/logout.svg'
import account from '../assets/icons/account.svg'

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
  return (
    <div className="bg-green2t flex-row">
      <nav>
          <ul className="font-roboto-700 text-2xl">
              <li><Link to={'/'}>Plant Info</Link></li>
              <li><Link to={'explore/'}>Explore</Link></li>
              <li><Link to={'track/'}>Participate</Link></li>
              <li><Link to={'about/'}>About</Link></li>
          </ul>
      </nav>
      <div>
        {isLoggedIn?
        <div>
        <Link to={'account/'}>
        <img src={account} alt="account" />
        </Link>

        <button onClick={logOutHandler}>
        <img src={logout} alt="logout" />
        </button>
        </div>
        :
        <Link to={'login/'}><button>
          <img src={login} alt="login" />
          </button></Link>}
      </div>

    </div>
  )
}