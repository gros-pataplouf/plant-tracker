import axiosInstance from '../helpers/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TrackForm from './TrackForm';
import TrackMap from './TrackMap';


export default function Track() {

  const [location, setLocation] = useState([50, 10]);
  const [display, setDisplay] = useState('map');
  useEffect(() => {
    axiosInstance.get('token/authtest/')
    .then(res => {console.log(res)})
    .catch(err => {
        console.error(err);
        window.alert("You need to be logged in to submit data.")
        window.location.pathname=`/login?${currentURL.pathname.slice(1,)}`
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
} 
