import { Link } from "react-router-dom";
import { axiosInstance } from '../helpers/axios';
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
    <div>
      <nav>
          <ul>
              <li><Link to={'/'}>Plant Info</Link></li>
              <li><Link to={'explore/'}>Explore</Link></li>
              <li><Link to={'track/'}>Participate</Link></li>
              <li><Link to={'about/'}>About</Link></li>
          </ul>
      </nav>
      <div>
        {isLoggedIn?<button onClick={logOutHandler}>Log out</button>:<Link to={'login/'}><button>Log in</button></Link>}
      </div>

    </div>
  )
}