import axios from 'axios';
import { useState } from 'react';


export default function Register() {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    function submitHandler(e) {
        e.preventDefault();
        axios.post('http://localhost:8000/api/register/', document.querySelector('#registrationForm'), {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {setMessage(res.data);
          setSuccess(true)})
          .catch(error => setMessage(error.response.data))}

    return (
        <>{!success && 
        <form id='registrationForm' onSubmit={submitHandler}>
        <label htmlFor='email'>Please enter your email</label>
        <input name='email' id='email'/>
        <label htmlFor='username'>Please enter a username</label>
        <input name='username' id='username' />
        <label htmlFor='password'>Please enter your password</label>
        <input name='password' id='password' />
        <button type="submit">Create account</button>
     </form>}

         <p>{message}</p>
         </>

    )
}