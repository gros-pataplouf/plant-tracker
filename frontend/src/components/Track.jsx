import axiosInstance from '../helpers/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TrackForm from './TrackForm';
import TrackMap from './TrackMap';


export default function Track() {

  const [location, setLocation] = useState([50, 10]);
  const [display, setDisplay] = useState('map');
  useEffect(() => {
    axiosInstance.get('accounts/me/')
    .then(res => {console.log(res)})
    .catch(err => {
        console.error(err);
        window.alert("You need to be logged in to submit data.")
        window.location.href=`/login?${window.location.pathname.slice(1,)}`
    })
  
  }, [])


if (display === "map"){
  return (<TrackMap props={{location, setLocation, setDisplay}}/>)
;
} else if (display === "form") {
  return (
    <TrackForm props={{location, setDisplay}}/>
  )
}
else if (display === "success") {
  return (
    <div>
      <p>
      Thanks for submitting your data ✅
      </p>
      <p>View submission: 
        <Link to></Link>
      </p>


      </div>
  )
}
} 