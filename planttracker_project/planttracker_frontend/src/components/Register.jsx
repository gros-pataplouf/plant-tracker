import axios from 'axios';
import { useState } from 'react';


export default function Register() {
    const [message, setMessage] = useState('')

    function submitHandler(e) {
        e.preventDefault();
        axios.post('http://localhost:8000/api/register/', document.querySelector('#registrationForm'), {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => setMessage(res.data))
          .catch(error => setMessage(error.response.data))}

    return (
        <>
        <form id='registrationForm'>
            <label htmlFor='email'>Please enter your email</label>
            <input name='email' id='email'/>
            <label htmlFor='username'>Please enter a username</label>
            <input name='username' id='username' />
            <label htmlFor='password'>Please enter your password</label>
            <input name='password' id='password' />
            <button type="submit" onClick={submitHandler}>Create account</button>
         </form>
         <p>{message}</p>
         </>

    )
}