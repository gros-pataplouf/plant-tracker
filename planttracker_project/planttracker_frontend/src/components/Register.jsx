import axios from 'axios';
import { useState } from 'react';
import { testMail, testPassword } from '../helpers/checks';


export default function Register() {
    const [ emailErr, setEmailErr ] =  useState('');
    const [ pwdErr, setPwdErr ] =  useState('');
    const [ incompleteErr, setIncompleteErr ] =  useState('');
    const [ message, setMessage ] = useState('')

    const [success, setSuccess] = useState(false);
    const formData = new FormData();
    
    function updateFormData() {
      setEmailErr('');
      setIncompleteErr('');
      setPwdErr('');

      for (const key of formData.keys()) {
        formData.delete(key);
      }

      formData.append('email', document.getElementById('email').value.trim());
      formData.append('username', document.getElementById('username').value.trim());
      formData.append('password', document.getElementById('password').value.trim());
      formData.append('passwordConfirmation', document.getElementById('passwordConfirmation').value.trim());

      /// check for emty fields

      for (const entry of formData.entries()) {
      if (!entry[1]) {
        setIncompleteErr("Please fill out all required fields")
        } 
      }

      if (! testMail(formData.get('email')) && formData.get('email')) {
        setEmailErr(`${formData.get('email')} is no valid email address.`)
  
      } 

      if (formData.get('password') && formData.get('passwordConfirmation') && formData.get('password') !==  formData.get('passwordConfirmation')) {
        console.log(formData.get('password'));
        console.log(formData.get('passwordConfirmation'))
        setPwdErr('Passwords must match')

      }

      if (!testPassword(formData.get('password'))) {

        setPwdErr('Passwords must contain at least 8 characters, one capital letter, one small letter, one number and one special character!')

      }

    }
    function submitHandler(e) {
        e.preventDefault();
        if (emailErr || pwdErr || incompleteErr ) {
          return window.alert('Invalid form, please check the data provided!')
        }
        formData.append('email', document.getElementById('email').value);
        formData.append('username', document.getElementById('username').value);

        formData.append('password', document.getElementById('password').value);
        formData.append('passwordConfirmation', document.getElementById('passwordConfirmation').value);

        // requirements: valid email address by regex, password min 8 char, 



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
        <form id='registrationForm' onSubmit={submitHandler} onChange={updateFormData}>
        <label htmlFor='email'>Email</label>
        <input name='email' id='email' placeholder='required'/>
        <label htmlFor='username'>Username</label>
        <input name='username' id='username' placeholder='required'/>
        <label htmlFor='password'>Password</label>
        <input name='password' id='password' type='text' placeholder='required'/>
        <label htmlFor='passwordConfirmation'>Password confirmation</label>
        <input name='passwordConfirmation' id='passwordConfirmation' type='password' placeholder='required'/>
        <button type="submit">Create account</button>
     </form>}

     <p>{pwdErr}</p>
     <p>{incompleteErr}</p>
     <p>{emailErr}</p>
     <p>{message}</p>



         
         </>

    )
}