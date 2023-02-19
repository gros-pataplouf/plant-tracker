import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_LOCATIONS } from '../constants';

// SRID=4326;POINT (9.86409912109375 54.06325355147857)

export default function Explore() {


    const [locationList, setLocationList] = useState([]);
    useEffect(() => {axios.get(API_URL_LOCATIONS).then(res => setLocationList(res.data))}, locationList);
    const markUp = locationList.map(location => {
        // let longlat = location.location.replace("SRID=4326;POINT (","").replace(")","").split(" ").reverse()

        return (
            <Marker key={location.id} position={location.location.replace("SRID=4326;POINT (","").replace(")","").split(" ").reverse()}>
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