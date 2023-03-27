import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_LOCATIONS } from '../constants';

export default function Explore() {


    const [locationList, setLocationList] = useState([]);
    
    useEffect(() => {axios.get(API_URL_LOCATIONS).then(res => setLocationList(res.data))}, []);
    console.log(locationList);
    const markUp = locationList.map(location => {
        return (
            <Marker key={location.pk} position={location.location.coordinates.reverse()}>
                <Popup> {location.author} {location.area} {location.plant} </Popup>
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