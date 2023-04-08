import axios from 'axios';
import { axiosInstance } from '../helpers/axios';
import { useNavigate, useLocation, Link, redirect } from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    function submitHandler(e) {
        e.preventDefault();
        axiosInstance.post('token/', document.querySelector('#loginForm'))
          .then(res => {
            localStorage.setItem('planttrackerAccess', res.data.access);
            localStorage.setItem('planttrackerRefresh', res.data.refresh);
            console.log(location.search.slice(1,))
            return navigate(`/${location.search.slice(1,)}`);
          })
          .catch(error => console.error(error.response.data))
    }

    return (
        <>
        <form id="loginForm" onSubmit={submitHandler}>
            <label htmlFor="username">Please enter your username</label>
            <input id="username" name="username" type="text" />
            <label htmlFor="password">Please enter your password</label>
            <input id="password" name="password" type="text" />
            <button type="submit">Submit</button>
         </form>
         <div>
          <p>No account yet?</p>
          <Link to='/register'>Register</Link>
         </div>
      
         </>

    )
}