import axiosInstance from "../helpers/axios";
import { useState, useEffect } from "react";
import { testMail, testPassword } from '../helpers/checks';


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
        axiosInstance.patch('users/myaccount/', emailFormData)
        .then(res => {
            console.log(res)
        })
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
        console.log(emailFormData)
        axiosInstance.patch('users/myaccount/', passwordFormData)
        .then(res => {
            console.log(res)
        })
    }

    function deleteHandler() {
        axiosInstance.delete('users/myaccount/')
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }

/// functions for opening and closing modals 

    function cancelModal(e) {
        return null
    }

    function openModal(e) {
        return null
    }



    return (
        <>
        <h1>My account settings</h1>
        <div>
            <p>Username</p>
            {user && <p>{user.username}</p>}
            
        </div>
        <div>
            <p>Email</p>
            {user && <p>{user.email}</p>}

            <button onClick={openModal}>Update</button>
            {/* Backdrop */}
            <div> 
                {/* Modal */}
                <div>
                    <form action="" id="emailForm" onChange={updateEmailFormData} onSubmit={handleEmailSubmit}>
                    <div onClick={cancelModal}><img src="" alt="" /></div>
                        <label htmlFor="">New email</label>
                        <input id='email' name='email' type="text" />
                        {emailErr && 
                        <p>{emailErr}</p>
                        }
                        {incompleteErr && 
                        <p>{incompleteErr}</p>
                        }
                        <button>Ok</button>
                        <button onClick={cancelModal}>Cancel</button>
                    </form>
                </div>
                {/* End modal */}
            </div>
            {/* End Backdrop */}
        </div>
{/* Password change */}
        <div>
        <button onClick={openModal}>Change password</button>
            {/* Backdrop */}
            <div> 
                {/* Modal */}
                <div>
                    <form action="" id="passwordForm" onChange={passwordChangeHandler} onSubmit={passwordSubmitHandler}>
                        <div onClick={cancelModal}><img src="" alt="" /></div>
                        <label htmlFor="">New password</label>
                        <input id='password' name='password' type="text" />
                        <label htmlFor="">Confirm new password</label>
                        <input id='passwordConfirmation' name='passwordConfirmation' type="text" />
                        <button>Ok</button>
                        <button onClick={cancelModal}>Cancel</button>
                    </form>
                    {pwdErr && 
                        <p>{pwdErr}</p>
                        }
                        {incompleteErr && 
                        <p>{incompleteErr}</p>
                        }
                </div>
                {/* End modal */}
            </div>
            {/* End backdrop */}
        </div>



        <h1>My submissions</h1>
        <ul>
            {!submissions? <li>You have not submitted any data yet.</li> 
            : 
             submissions.map(submission => {
                let date = new Date(submission.created_at);
                let minutes = date.getMinutes()
                return <li key={submission.id}>
                    🕙 {date.getFullYear()}-{date.getMonth()}-{date.getDate()} at {date.getHours()}:
                    {minutes < 10? `0${minutes}` :  minutes} <img src={submission.image} alt="" />
                    </li>})}
        </ul>
    {/* Account deletion */}
    <div>
        <button>Delete account</button>
                {/* Backdrop */}
                <div> 
                {/* Modal */}
                <div>
                    <form action="">
                        <p>Are you sure you want to delete your account? This cannot be undone!</p>
                        <button onClick={deleteHandler}>Yes, I'm sure</button>
                        <button onClick={cancelModal}>Cancel</button>
                    </form>
                </div>
                {/* End modal */}
            </div>
            {/* End Backdrop */}
    </div>

        </>
    )
}