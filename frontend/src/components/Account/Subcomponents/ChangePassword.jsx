import axiosInstance from "../../../helpers/axios";
import { useState, useEffect } from "react";
import { testPassword } from "../../../helpers/checks";
import { Modal, handleModal } from "../../Modal";
import AnimationLoading from "../../AnimationLoading";

const classes = {
    button: "btn rounded-none",
    form: "flex flex-col", 
    cancel: "",
    label: "", 
    input: "",
    message: "border-red-800 active:outline-red-800",
    buttonwrapper: "flex space-4",
    confirmModal: "flex flex-col"
}

const passwordFormData = new FormData();


export default function ChangePassword() {
    const [pwdErr, setPwdErr] = useState('');
    const [incompleteErr, setIncompleteErr] = useState('');
    function handlePasswordChange() {
        setIncompleteErr('');
        setPwdErr('');
        const password = document.querySelector('#passwordForm>#password').value.trim()
        const passwordConf = document.querySelector('#passwordForm>#passwordConfirmation').value.trim();
        console.log(password, passwordConf)
        if (!password || !passwordConf) {
            setIncompleteErr("Please fill out all required fields")
            } 
        if (!testPassword(password)) {
            setPwdErr('Passwords must contain at least 8 characters, one capital letter, one small letter, one number and one special character!')
        }
        if (password !== passwordConf) {
            setPwdErr('Passwords must match.')
        }
    }
    
    function handlePasswordSubmit(e) {
        e.preventDefault();
        if (pwdErr || incompleteErr ) {
        return window.alert('Invalid form, please check the data provided!')
        }
        passwordFormData.append('password', document.querySelector('#passwordForm>#password').value.trim());
        axiosInstance.patch(`accounts/me/`, passwordFormData)
        .then(res => {
            console.log(res);
        })
    }
    

    return (
        <div>
            <form className={classes.form} action="" id="passwordForm" onChange={handlePasswordChange} onSubmit={handlePasswordSubmit}>
                <label className={classes.label} htmlFor="">New password</label>
                <input className={classes.input} id='password' name='password' type="text" />
                <label className={classes.label} htmlFor="">Confirm new password</label>
                <input className={classes.input} id='passwordConfirmation' name='passwordConfirmation' type="text" />
                <div className={classes.buttonwrapper}>
                    <button className={classes.button}>Ok</button>
                    <button className={classes.button} onClick={handleModal}>Cancel</button>
                </div>
            </form>
            {pwdErr && <p>{pwdErr}</p>
            }
            {incompleteErr && 
            <p>{incompleteErr}</p>
            }
        </div>

    )
    
}