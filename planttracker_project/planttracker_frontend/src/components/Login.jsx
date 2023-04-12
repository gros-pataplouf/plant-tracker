import { axiosInstance } from '../helpers/axios';
import { useNavigate, useLocation, Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [ message, setMessage ] = useState();
    
    const navigate = useNavigate();
    const location = useLocation();
    function submitHandler(e) {
        e.preventDefault();
        axiosInstance.post('token/', document.querySelector('#loginForm'))
          .then(res => {
            localStorage.setItem('planttrackerAccess', res.data.access);
            localStorage.setItem('planttrackerRefresh', res.data.refresh);
            setIsLoggedIn(true);
            if (location.search) {return navigate(`/${location.search.slice(1,)}}`);
          }})
          .catch(
            error =>{
            console.error(error.response.data);
            setMessage("Login unsuccessful ⛔")})
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
          <p>{message}</p>
          <p>No account yet?</p>
          <Link to='/register'>Register</Link>
         </div>
      
         </>

    )
}