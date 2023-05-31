import axiosInstance from '../helpers/axios';
import { useLocation, Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import visibility from '../assets/icons/visibility.svg';
import visibility_off from '../assets/icons/visibility_off.svg';
import { Modal, openModal, closeModal } from './Modal';
import { testMail } from '../helpers/checks';

const classes = {
  wrapper: 'flex flex-col justify-between w-[70vw] m-auto p-8 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4',
  title: 'py-8',
  form: 'flex flex-col ', 
  input: '',
  label: 'mt-4 mb-2',
  errorInput: 'border-red-800 active:outline-red-800',
  btn: 'btn my-8',
  success: 'font-bold my-[50%]',
  failure: 'font-bold text-red-800', 
  passwordWrapper: 'flex relative [&>button]:absolute [&>button]:top-2 [&>button]:right-2 [&>input]:grow',
  visibilitySvg: 'h-6', 
  info: 'mt-4', 
  link: 'block pt-2 mr-10 text-emerald-900 font-bold active:decoration-solid'

}


export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [ message, setMessage ] = useState();
    const location = useLocation();
    const [ showPwd, setShowPwd ] = useState(false);
    function submitHandler(e) {
        e.preventDefault();      
        if (!document.querySelector('input#username').value || !document.querySelector('input#password').value) {
          setMessage("Cannot submit empty form. ⛔");
          return null;
        };

          
        axiosInstance.post('accounts/token/', document.querySelector('#loginForm'))
          .then(res => {
            localStorage.setItem('planttrackerAccess', res.data.access);
            localStorage.setItem('planttrackerRefresh', res.data.refresh);
            setIsLoggedIn(true);
            setMessage("Login successful ✅")
            if (location.search) {
              return window.location.href =(`/${location.search.slice(1,)}`);
          } else {
            return window.location.href = '/';
          }})
          .catch(
            error =>{
            console.error(error.response);
            setMessage("Login unsuccessful ⛔")})
    }
    function getResetLink(e) {
      e.preventDefault();
      console.log(document.querySelector('input#email').value)  
      if (!document.querySelector('input#email').value) {
        console.log("empty")
        window.alert("Cannot submit empty form. ⛔");
        return null;
      };

        
      axiosInstance.post('accounts/reset/', document.querySelector('#getResetLink'))
        .then(res => { console.log(res)

          if (location.search) {
            return window.location.href =(`/${location.search.slice(1,)}`);
        } else {
          return window.location.href = '/';
        }})
        .catch(
          error =>{
          console.error(error.response);
          setMessage("Login unsuccessful ⛔")})

    }

    return (
        <div className={classes.wrapper}>
        <h3 className={classes.title}>Log in</h3>
        <form className={classes.form} id="loginForm" onSubmit={submitHandler}>
            <label htmlFor="username">Username</label>
            <input className={classes.label} id="username" name="username" type="text" />
            <label className={classes.label} htmlFor="password">Password</label>
            <div className={classes.passwordWrapper}>
            <input id="password" name="password" type="password"/>
            <button onClick={(e) => { 
              e.preventDefault(); 
              document.querySelector('#password').setAttribute('type', showPwd? 'password':'text');
              setShowPwd(!showPwd)}}>
            <img className={classes.visibilitySvg} src={showPwd? visibility : visibility_off} alt="" />
            </button>
            </div>
            
            <button className={classes.btn} type="submit">Submit</button>
         </form>
         <div>
          <p className={classes.failure}>{message}</p>

          <p className={classes.info}>  Password forgotten? </p>
          <button className={classes.link} onClick={openModal}> 👉 Reset password</button>

          <Modal>
          <div>
          <h3 className={classes.title}>Request a password reset link</h3>
          <form className={classes.form} id="getResetLink" onSubmit={getResetLink}>
              <label htmlFor="email">Email</label>
              <input className={classes.input} id="email" name="email" type="text" />
              <button className={classes.btn} type="submit">Get Reset Link</button>
          </form>
          </div>
          </Modal>

          <p className={classes.info}>No account yet?</p>
          <Link  className={classes.link} to='/register'> 👉 Register</Link>
         </div>
        </div>

    )
}