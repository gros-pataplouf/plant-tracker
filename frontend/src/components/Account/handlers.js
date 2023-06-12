export function handleEmailChange() {
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

export function handleEmailSubmit(e) {
    e.preventDefault();
    if (emailErr || incompleteErr ) {
      return window.alert('Invalid form, please check the data provided!')
    }
    emailFormData.append('email', document.querySelector('#emailForm>#email').value.trim());
    console.log(emailFormData)
    setSubmitting(true)
    axiosInstance.patch('accounts/me/', {email: document.querySelector('#emailForm>#email').value.trim()})
    .then(res => {
        console.log(res)
        setSubmitting(false);
        setSuccess(true);
    })
    .catch(err => {
        console.error(err.response);
        setSubmitting(false);
        setSuccess(false);
        setMessage(err.response.data.email)
        console.log(message)})

    .finally(setTimeout(() => {
        closeModal(e);
        setSuccess(false);
    
    }, 2000))
}

export function handlePasswordChange() {
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
// <form action="" id="passwordForm" onChange={passwordChangeHandler} onSubmit={passwordSubmitHandler}>

export function handlePasswordSubmit(e) {
    e.preventDefault();
    if (pwdErr || incompleteErr ) {
      return window.alert('Invalid form, please check the data provided!')
    }
    passwordFormData.append('password', document.querySelector('#passwordForm>#password').value.trim());
    axiosInstance.patch(`accounts/me/`, passwordFormData)
    .then(res => {
        console.log(res)
    })
}

export function handleDelete() {
    axiosInstance.delete('accounts/me/')
    .then(res => console.log(res))
    .catch(err => console.error(err))
}
