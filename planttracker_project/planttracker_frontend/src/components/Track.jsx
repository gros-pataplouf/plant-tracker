import { axiosInstance } from '../helpers/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TrackForm from './TrackForm';
import TrackConfirm from './TrackConfirm';
import TrackMap from './TrackMap';


export default function Track() {
  const navigate = useNavigate();
  const currentURL = useLocation();
  useEffect(() => {
  
  axiosInstance.get('token/authtest/')
  .then(res => {console.log(res)})
  .catch(err => {
    if (err.response.status === 401) {
      window.alert("You need to be logged in to submit data.")
      return navigate(`/login?${currentURL.pathname.slice(1,)}`)
    }
  })
}, [])
  const [location, setLocation] = useState([50, 10]);
  const [display, setDisplay] = useState('map');
  console.log(display);


if (display === "map"){
  return (<TrackMap props={{location, setLocation, setDisplay}}/>)
;
} else if (display === "form") {
  return (
    <TrackForm props={{location, setDisplay}}/>
  )
}
else if (display === "confirm") {
  return (
  <TrackConfirm/>
  )
}
} 
