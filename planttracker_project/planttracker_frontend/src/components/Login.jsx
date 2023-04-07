import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    function submitHandler(e) {
        e.preventDefault();
        axios.post('http://localhost:8000/api/token/', document.querySelector('#loginForm'), {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
            localStorage.setItem('planttrackerAccess', res.data.access);
            localStorage.setItem('planttrackerRefresh', res.data.refresh);
            return navigate('/');
          })
          .catch(error => console.log(error.response.data))
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