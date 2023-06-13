import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import { testMail } from "../../../../helpers/checks";
import { handleModal } from "../../../elements/Modal";
import AnimationLoading from "../../../elements/AnimationLoading";
import AnimationConfirm from "../../../elements/AnimationConfirm";

const classes = {
    button: "btn rounded-none",
    form: "flex flex-col", 
    message: "border-red-800 active:outline-red-800",
    buttonwrapper: "flex space-4",
    confirmModal: "flex flex-col"
}


export default function UpdateEmail({props}) {
    const {changes, setChanges } = props;
    const [ emailErr, setEmailErr ] =  useState('');
    const [ incompleteErr, setIncompleteErr ] =  useState('');
    const [ message, setMessage ] = useState('');
    const [ success, setSuccess] = useState(false);
    const [ submitting, setSubmitting ] = useState(false);
    const emailFormData = new FormData();
    function handleEmailChange() {
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
        if (emailErr || incompleteErr ) {
          return window.alert('Invalid form, please check the data provided!')
        }
        emailFormData.append('email', document.querySelector('#emailForm>#email').value.trim());
        setSubmitting(true)
        axiosInstance.patch('accounts/me/', {email: document.querySelector('#emailForm>#email').value.trim()})
        .then(res => {
            console.log(res);
            setSubmitting(false);
            setSuccess(true);
            setChanges('email');
            setTimeout(()=> {
                const currentModal = document.querySelector("dialog[open]");
                if (currentModal) {
                    currentModal.close();
                };
                setSuccess(false);
            }, 3000)
        })
        .catch(err => {
            setSubmitting(false);
            setSuccess(false);
            setMessage(err.response.data.email);
        })
    }
    
    return <div> 
    { !submitting && !success &&
    <form className={classes.form} action="" id="emailForm" onChange={handleEmailChange} onSubmit={handleEmailSubmit}>
    <div onClick={handleModal}><img src="" alt="" /></div>
        <label htmlFor="">New email</label>
        <input id='email' name='email' type="text" />
        {emailErr && 
        <p className={classes.message}>{emailErr}</p>
        }
        {incompleteErr && 
        <p className={classes.message}>{incompleteErr}</p>
        }
        {message && 
        <p className={classes.message}>{message}</p>
        }
        <div className={classes.buttonwrapper}>
        <button className={classes.button} value="default">Ok</button>
        <button className={classes.button} value="cancel" name="closeModal" formMethod="dialog" onClick={handleModal}>Cancel</button>
        </div>
    </form>}
    { submitting && 
    <AnimationLoading>
        <h4>Submitting...</h4>
    </AnimationLoading>}
    { success && 
    <div className={classes.confirmModal}>
        <AnimationConfirm>
            <h4>Succes!</h4>
        </AnimationConfirm>
        <button className={classes.button} name="closeModal" onClick={handleModal}>Close</button>
    </div>}
    </div>
}