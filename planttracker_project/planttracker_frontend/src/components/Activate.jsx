import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export default function Activate() {
    const navigate = useNavigate();
    let activationToken = window.location.search.slice(1);
    axios.get(`http://localhost:8000/api/activate/${activationToken}`)
    .then(res => {
        if (res.status === 204) {
            window.alert("Your account has been activated, please log in.")
            return navigate('/login')
        };
    })

    return (
        <h1>Activation Page </h1>

    )
}