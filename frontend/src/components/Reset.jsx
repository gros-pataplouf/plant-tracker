import axiosInstance from '../helpers/axios';
import { useLocation, Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import info from '../assets/icons/info.svg';
import visibility from '../assets/icons/visibility.svg';
import visibility_off from '../assets/icons/visibility_off.svg';
import { testPassword } from '../helpers/checks';


const classes = {
  wrapper: 'flex flex-col justify-between w-[90vw] m-auto p-8 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4',
  title: 'py-8',
  form: 'flex flex-col ', 
  input: '',
  label: 'mt-4 mb-2',
  errorInput: 'border-red-800 active:outline-red-800',
  errorSpan:  "text-red-800 italic",
  tooltipIcon: "inline w-7 align-top",
  tooltipSpan: "relative",
  tooltipDiv: "absolute w-[80vw] bg-black top-4 p-4 border-spacing-2 border-2 rounded-3xl text-yellow-50 hidden m-4 leading-none z-10",
  btn: 'btn my-8',
  success: 'font-bold my-[50%]',
  failure: 'font-bold text-red-800', 
  passwordWrapper: 'flex relative [&>button]:absolute [&>button]:top-2 [&>button]:right-2 [&>input]:grow',
  visibilitySvg: 'h-6', 
  info: 'mt-4', 
  link: 'block pt-2 mr-10 text-emerald-900 font-bold active:decoration-solid'

}


export default function Reset() {
    let uuid = window.location.search.slice(1,)
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [ message, setMessage ] = useState('');
    const [ pwdErr, setPwdErr ] =  useState('');
    const [ incompleteErr, setIncompleteErr ] =  useState('');
    const [ pwdConfErr, setPwdConfErr ] =  useState('');
 
    const location = useLocation();
    const [ showPwd, setShowPwd ] = useState(false);
    const [ showPwdConf, setShowPwdConf ] = useState(false);
    const [ success, setSuccess ] = useState(false);
    function validateForm() {
      setIncompleteErr('');
      setPwdErr('');
      setPwdConfErr('');

      let password =  document.getElementById('password').value.trim();
      let passwordConfirmation = document.getElementById('passwordConfirmation').value.trim();

      /// check for empty fields

      if (!password || !passwordConfirmation) {
        setIncompleteErr("Please fill out all required fields.")
        } 
     

      if (password && password !==  passwordConfirmation) {
        setPwdConfErr('Passwords must match.')
      }

      if (password && !testPassword(password)) {
        setPwdErr('Invalid password. ')
     }

    }

    function submitHandler(e) {
        e.preventDefault();
        if (!document.querySelector('input#password').value) {
          setMessage("Cannot submit empty form. ⛔");
          return null;
        };
        axiosInstance.post(`reset/${uuid}`, document.querySelector('#resetForm'))
          .then(res => {
            setMessage("Your password has been reset ✅");
            setTimeout(() => {
              window.location.href = '/login'
            }, 5000)
            })
          .catch(
            error =>{
            console.error(error.response);
            setMessage("Invalid reset link ⛔")})
    }
    return (
        <div className={classes.wrapper}>
        <h3 className={classes.title}>Password reset ✍️</h3>
        {!success && 
      <form className={classes.form} id='resetForm' onSubmit={submitHandler} onChange={validateForm}>
        <label className={classes.label} htmlFor='password'>Password {pwdErr && <span className={classes.errorSpan}>{pwdErr}  
        <span className={classes.tooltipSpan} onClick={()=>{
              const tooltip = document.querySelector("#tooltip");
              tooltip.classList.toggle("hidden")}}><img className={classes.tooltipIcon} src={info} />
        <div className={classes.tooltipDiv} id="tooltip">
          Passwords must be at least 8 characters long with 1 upper case, 1 lower case letter, 1 number and 1 special character.
        </div>
        </span>
        </span>
        }
        </label>
        <div className={classes.passwordWrapper}>
            <input id="password" name="password" type="password" autoComplete='password' placeholder='required' className={pwdErr? "border-red-800": undefined}/>
            <button onClick={(e) => { 
              e.preventDefault(); 
              document.querySelector('#password').setAttribute('type', showPwd? 'password':'text');
              setShowPwd(!showPwd)}}>
            <img className={classes.visibilitySvg} src={showPwd? visibility : visibility_off} alt="" />
            </button>
            </div>

        <label className={classes.label} htmlFor='passwordConfirmation'>Confirm password <span className={classes.errorSpan}>{pwdConfErr}</span></label>
        <div className={classes.passwordWrapper}>
            <input name='passwordConfirmation' id='passwordConfirmation' type='password' placeholder='required'/>
            <button onClick={(e) => { 
              e.preventDefault(); 
              document.querySelector('#passwordConfirmation').setAttribute('type', showPwdConf? 'password':'text');
              setShowPwdConf(!showPwdConf)}}>
            <img className={classes.visibilitySvg} src={showPwdConf? visibility : visibility_off} alt="" />
            </button>
            </div>

        <button className={classes.btn} type="submit">Reset password</button>
        <p className={classes.errorSpan}>{incompleteErr}</p>
     </form>}
         <div>
          <p className={classes.failure}>{message}</p>

          <p className={classes.info}>  Want to login? </p>
          <Link className={classes.link} to='/login'> 👉 Login page</Link>
          <p className={classes.info}>No account yet?</p>
          <Link  className={classes.link} to='/register'> 👉 Register</Link>
 
         </div>
        </div>

    )
}
