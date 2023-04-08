import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL_LOCATIONS } from '../constants';

export default function Explore() {  

    const navigate = useNavigate();
    const location = useLocation();

    const [locationList, setLocationList] = useState([]);
    const accessToken = localStorage.getItem('planttrackerAccess');
    const refreshToken = localStorage.getItem('planttrackerRefresh');
    
    useEffect(() => {axios.get(
      API_URL_LOCATIONS, {
        headers: {
           Authorization: 'JWT ' + accessToken
        }
     }
      )
      .then(res => setLocationList(res.data))
      .catch(err => {
        window.alert("you need to be logged in to view this page!");
        return navigate(`/login?${location.pathname}`);

      })
    }, [])
;
    const markUp = locationList.map(location => {
        return (
            <Marker key={location.id} position={location.location.coordinates.reverse()}>
                <Popup> {location.area}m2 {location.plant} </Popup>
            </Marker>
        )
    })




    return (
    <MapContainer id="map" center={[54.06325355147857, 9.86409912109375]} zoom={8} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
{markUp}
</MapContainer>
)}