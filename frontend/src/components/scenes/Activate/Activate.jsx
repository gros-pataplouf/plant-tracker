import axiosInstance from "../../../helpers/axios";

export default function Activate() {
    let activationToken = window.location.href.trim("/").split("?").at(-1);
    axiosInstance.get(`accounts/activate/${activationToken}`)
    .then(res => {
        if (res.status === 204) {
            window.alert("Your account has been activated, please log in.")
            return window.location.href = '#login/'
        }
    })

    return (
        <>
        <h1>Activation Page </h1>
        </>
    )
}