import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import axiosInstance from '../helpers/axios';

export default function Explore() {  

    const [locationList, setLocationList] = useState([]);
    
    useEffect(() => {axiosInstance.get('locations/')
      .then(res => setLocationList(res.data))
      .catch(err => {
        console.error(err);
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