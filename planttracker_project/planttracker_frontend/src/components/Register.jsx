import axiosInstance from '../helpers/axios';
import { useState } from 'react';
import { testMail, testPassword } from '../helpers/checks';

const classes = {
  wrapper: '',
  title: '',
  form: '', 
  input: '',
  label: '',
  error: ''
}

export default function Register() {
    const [ emailErr, setEmailErr ] =  useState('');
    const [ pwdErr, setPwdErr ] =  useState('');
    const [ incompleteErr, setIncompleteErr ] =  useState('');
    const [ pwdConfErr, setPwdConfErr ] =  useState('');
    const [ message, setMessage ] = useState('')
    const [success, setSuccess] = useState(false);
    const formData = new FormData();
    
    function validateForm() {
      setEmailErr('');
      setIncompleteErr('');
      setPwdErr('');
      setPwdConfErr('');

      let email = document.getElementById('email').value.trim();
      let username = document.getElementById('username').value.trim();
      let password =  document.getElementById('password').value.trim();
      let passwordConfirmation = document.getElementById('passwordConfirmation').value.trim();

      /// check for empty fields

      if (!email || !username || !password || !passwordConfirmation) {
        setIncompleteErr("Please fill out all required fields.")
        } 
      
      if ( email && !testMail(email)) {
        setEmailErr('Invalid email.')
 
      } 

      if (password && password !==  passwordConfirmation) {
        setPwdConfErr('Passwords must match.')
      }

      if (password && !testPassword(password)) {
        setPwdErr('Invalid password')
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

        axiosInstance.post('http://localhost:8000/api/register/', document.querySelector('#registrationForm'), {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {setMessage(res.data);
          setSuccess(true)})
          .catch(error => setMessage(error.response.data))}

    return (
      <div className="prose flex flex-col justify-center m-4">
      <h2 className='my-8'>Sign up and contribute 💚</h2>
      {!success && 
      <form className='flex flex-col' id='registrationForm' onSubmit={submitHandler} onChange={validateForm}>
        <label htmlFor='email'>Email<span className="text-red-800 italic"> {emailErr}</span></label>
        <input name='email' type='email' id='email' autoComplete='email' className={emailErr? "border-red-800 active:outline-red-800": 'undefined'} placeholder='required'/>
        <label className='mt-4' htmlFor='username'>Username</label>
        <input name='username' type='text' id='username' autoComplete='username' placeholder='required'/>
        <label htmlFor='password' className='mt-4'>Password {pwdErr && <span className="text-red-800 italic mr-0">{pwdErr}  
        <span>  
          <svg className='fill-red-800 inline absolute'
            onClick={()=>{
              const tooltip = document.querySelector("#tooltip");
              tooltip.classList.toggle("hidden")}}
          xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
            <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg></span></span>}
        </label>
        <input name='password' id='password' type='password' autoComplete='password' placeholder='required' className={pwdErr? "border-red-800": undefined}/>
         {pwdErr && <p className="text-red-800 italic hidden m-0 p-0 leading-none" id="tooltip">
          Passwords must be at least 8 characters long with 1 upper case, 1 lower case letter, 1 number and 1 special character.
        </p>}
        <label className='mt-4' htmlFor='passwordConfirmation'>Confirm password <span className="text-red-800 italic">{pwdConfErr}</span></label>
        <input name='passwordConfirmation' id='passwordConfirmation' type='password' placeholder='required'/>
        <button className="btn" type="submit">Create account</button>
        <p className="text-red-800 italic">{incompleteErr}</p>
     </form>}
     <p>Message{message}</p>
</div>

    )
}