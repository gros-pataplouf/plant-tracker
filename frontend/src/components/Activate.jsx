import axiosInstance from '../helpers/axios';
import {useNavigate} from 'react-router-dom';


export default function Activate() {
    const navigate = useNavigate();
    let activationToken = window.location.search.slice(1);
    axiosInstance.get(`accounts/activate/${activationToken}`)
    .then(res => {
        if (res.status === 204) {
            window.alert("Your account has been activated, please log in.")
            return window.location.href = 'login/'
        }
    })

    return (
        <>
        <h1>Activation Page </h1>
        </>
    )
}