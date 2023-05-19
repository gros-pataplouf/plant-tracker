import axiosInstance from "../helpers/axios";
import { useState, useEffect } from "react";
import { testMail, testPassword } from '../helpers/checks';
import { Modal, closeModal, openModal } from "./Modal";

const classes = {
    account: "p-4 space-2",
    modal: "flex flex-col w-[95vw] justify-between m-auto p-8 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 bg-white",
    title: "bg-emerald-900 text-yellow-50 p-4", 
    paragraph: "mt-4 mb-2", 
    button: "btn rounded-none",
    dangerbutton: "btn bg-red-800 text-white",
    cancelbutton: "btn bg-yellow-50 text-emerald-950 border-solid border-2 border-emerald-800", 
    backdrop: "hidden flex flex-col justify-center bg-black/90 fixed h-[100vh] w-[100vw] top-0 right-0 z-32",
    form: "flex flex-col", 
    cancel: "",
    label: "", 
    input: "",
    dangertext: "text-red-800 font-bold",
    message: "border-red-800 active:outline-red-800",
    buttonwrapper: "flex space-4",
    dangercancelbutton: "btn bg-yellow-50 text-emerald-950 border-solid border-2 border-red-800"
}

export default function Account() {
    const [ user, setUser ] = useState();
    const [ emailErr, setEmailErr ] =  useState('');
    const [ pwdErr, setPwdErr ] =  useState('');
    const [ incompleteErr, setIncompleteErr ] =  useState('');
    const [ submissions, setSubmissions ] = useState([]);
    const [ message, setMessage ] = useState('')
    const [successEmail, setSuccessEmail] = useState(false);
    const [ successPwd, setSuccessPwd ] = useState(false);
    const emailFormData = new FormData();
    const passwordFormData = new FormData();
    useEffect(() => {
        axiosInstance.get('users/myaccount/')
        //backend filters out the right user
        .then(res => {
            const user = res.data
            setUser(user);
            axiosInstance.get(`locations?author=${user.id}`)
            .then(res => { setSubmissions(res.data); console.log(submissions)})
            .catch(err => console.error(err))
        })
        .catch(err => {
            console.log(err)
        }) 
    }, [])

    function updateEmailFormData() {
        setEmailErr('');
        setIncompleteErr('');
        emailFormData.append('email', document.querySelector('#emailForm>#email').value.trim());
        for (const entry of emailFormData.entries()) {
            if (!entry[1]) {
              setIncompleteErr("Please fill out all required fields")
              } 
            }
        if (! testMail(emailFormData.get('email')) && emailFormData.get('email')) {
            setEmailErr(`${emailFormData.get('email')} is no valid email address.`)
        
            }
    }

    function handleEmailSubmit(e) {
        e.preventDefault();
        if (emailErr || pwdErr || incompleteErr ) {
          return window.alert('Invalid form, please check the data provided!')
        }
        emailFormData.append('email', document.querySelector('#emailForm>#email').value.trim());
        console.log(emailFormData)
        axiosInstance.patch('myaccount/', emailFormData)
        .then(res => {
            console.log(res)
        })
        .catch(err => console.error(err))
        .finally(setTimeout(() => {closeModal(e)}, 2000))
    }

    function passwordChangeHandler() {
        setIncompleteErr('');
        setPwdErr('');
        passwordFormData.append('password', document.querySelector('#passwordForm>#password').value.trim());
        passwordFormData.append('password', document.querySelector('#passwordForm>#passwordConfirmation').value.trim());

        for (const entry of passwordFormData.entries()) {
            if (!entry[1]) {
              setIncompleteErr("Please fill out all required fields")
              } 
            }
            if (document.querySelector('#passwordForm>#password').value.trim() !==  document.querySelector('#passwordForm>#passwordConfirmation').value.trim()) {
              setPwdErr('Passwords must match')
            }
            if (!testPassword(passwordFormData.get('password'))) {
              setPwdErr('Passwords must contain at least 8 characters, one capital letter, one small letter, one number and one special character!')
            }
            } 
    // <form action="" id="passwordForm" onChange={passwordChangeHandler} onSubmit={passwordSubmitHandler}>

    function passwordSubmitHandler(e) {
        e.preventDefault();
        if (pwdErr || incompleteErr ) {
          return window.alert('Invalid form, please check the data provided!')
        }
        passwordFormData.append('password', document.querySelector('#passwordForm>#password').value.trim());
        axiosInstance.patch(`users/reset/${user.id}`, passwordFormData)
        .then(res => {
            console.log(res)
        })
    }

    function deleteHandler() {
        axiosInstance.delete('users/myaccount/')
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }


    return (
        <div className={classes.account}>
        <h3 className={classes.title}>My account settings</h3>
        <div>
            <p className={classes.paragraph}>Username</p>
            {user && <p>{user.username}</p>}
            
        </div>
        {/* Email */}
        <div>
            <p className={classes.paragraph}>Email</p>
            {user && <p className={classes.paragraph}>{user.email}</p>}
            <button className={classes.button} onClick={openModal}>Update</button>
            {/* Change email */}
            <Modal>
                <form className={classes.form} action="" id="emailForm" onChange={updateEmailFormData} onSubmit={handleEmailSubmit}>
                <div className={classes.cancel} onClick={closeModal}><img src="" alt="" /></div>
                    <label className={classes.label} htmlFor="">New email</label>
                    <input className={classes.input} id='email' name='email' type="text" />
                    {emailErr && 
                    <p className={classes.message}>{emailErr}</p>
                    }
                    {incompleteErr && 
                    <p className={classes.message}>{incompleteErr}</p>
                    }
                    <div className={classes.buttonwrapper}>
                    <button className={classes.button}>Ok</button>
                    <button className={classes.button} onClick={closeModal}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
        {/* Password change */}
        <div>
            <button className={classes.button} onClick={openModal}>Change password</button>
            <Modal>
                <form className={classes.form} action="" id="passwordForm" onChange={passwordChangeHandler} onSubmit={passwordSubmitHandler}>
                    <div className={classes.cancel} onClick={closeModal}><img src="" alt="" /></div>
                    <label className={classes.label} htmlFor="">New password</label>
                    <input className={classes.input} id='password' name='password' type="text" />
                    <label className={classes.label} htmlFor="">Confirm new password</label>
                    <input className={classes.input} id='passwordConfirmation' name='passwordConfirmation' type="text" />
                    <div className={classes.buttonwrapper}>
                    <button className={classes.button}>Ok</button>
                    <button className={classes.button} onClick={closeModal}>Cancel</button>
                    </div>
                </form>
                {pwdErr && 
                    <p>{pwdErr}</p>
                    }
                    {incompleteErr && 
                    <p>{incompleteErr}</p>
                    }
            </Modal>
        <div>
        
        {/* Delete account */}
        <button className={classes.button} onClick={openModal}>Delete account</button>
        <Modal>
            <form action="">
                        <p className={classes.dangertext}>Are you sure you want to delete your account? This cannot be undone!</p>
                        <div className={classes.buttonwrapper}>
                        <button className={classes.dangerbutton} onClick={deleteHandler}>Yes, I'm sure</button>
                        <button className={classes.dangercancelbutton} onClick={closeModal}>Cancel</button>
                        </div>
            </form>
        </Modal>
        </div>
        </div>

        <h3 className={classes.title}>My submissions</h3>
        <ul>
            {!submissions? <li>You have not submitted any data yet.</li> 
            : 
             submissions.map(submission => {
                return <li key={submission.id}>
                    🕙 {new Date(submission.created_at).toLocaleString('en-GB')}
                    </li>})}
        </ul>
        </div>
    )
}