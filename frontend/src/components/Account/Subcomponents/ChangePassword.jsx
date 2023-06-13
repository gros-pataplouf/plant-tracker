import axiosInstance from "../../../helpers/axios";
import { useState, useEffect } from "react";
import { testPassword } from "../../../helpers/checks";
import { Modal, handleModal } from "../../Modal";
import AnimationLoading from "../../AnimationLoading";
import AnimationConfirm from "../../AnimationConfirm";

const classes = {
    button: "btn rounded-none",
    form: "flex flex-col", 
    message: "border-red-800 active:outline-red-800",
    buttonwrapper: "flex space-4",
    confirmModal: "flex flex-col"
}

const passwordFormData = new FormData();


export default function ChangePassword() {
    const [errMessage, setErrMessage] = useState("");
    const [ submitting, setSubmitting ] = useState("");
    const [ success, setSuccess ] = useState(false);
    
    function handlePasswordChange() {
        setErrMessage("")
        const password = document.querySelector('#passwordForm>#password').value.trim();
        const passwordConf = document.querySelector('#passwordForm>#passwordConfirmation').value.trim();

        if (password && !testPassword(password)) {
            setErrMessage("Passwords must contain at least 8 characters, one capital letter, one small letter, one number and one special character!")
            return null;
          }
        if (password !== passwordConf) {
            setErrMessage("Passwords must match.");
            return null;
            }
        if (!password || !passwordConf) {
            setErrMessage("Empty fields.");
            return null;
            }
    }
    
    function handlePasswordSubmit(e) {
        e.preventDefault();
        if (errMessage.length) {
        return window.alert('Invalid form, please check the data provided!')
        }
        setSubmitting(true);
        passwordFormData.append('password', document.querySelector('#passwordForm>#password').value.trim());
        axiosInstance.patch('accounts/me/', passwordFormData)
        .then(res => {
            console.log(res);
            setSubmitting(false);
            setSuccess(true);
            setTimeout(()=> {
                const currentModal = document.querySelector("dialog[open]");
                if (currentModal) {
                    currentModal.close();
                };
                setSuccess(false);
            }, 3000)
        })
        .catch(err =>{
            console.error(err);
            window.alert(err.data.password);
        })
    }

    return  <div>
        {!submitting && !success &&
            <div>
                <form className={classes.form} action="" id="passwordForm" onChange={handlePasswordChange} onSubmit={handlePasswordSubmit}>
                    <label htmlFor="">New password</label>
                    <input id='password' name='password' type="text" />
                    <label htmlFor="">Confirm new password</label>
                    <input id='passwordConfirmation' name='passwordConfirmation' type="text" />
                    <div className={classes.buttonwrapper}>
                        <button className={classes.button}>Ok</button>
                        <button className={classes.button} name="closeModal" onClick={handleModal}>Cancel</button>
                    </div>
                </form>
            { errMessage && <p> {errMessage} </p>}
            </div> }
        {submitting && 
        <AnimationLoading>
            <p>Submitting</p>
        </AnimationLoading> }
        {success && 
        <AnimationConfirm>
            <p>Password updated!</p>
        </AnimationConfirm> }
        </div>
}