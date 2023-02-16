import axios from 'axios';
import { API_URL_LOCATIONS } from '../constants';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { useGeolocated } from "react-geolocated";




function DynamicMarker({children, location}) {
    const [position, setPosition] = useState(location);

    let center;
    const map = useMapEvents({
      drag() {
        center = map.getCenter();
        setPosition(center);
      },
      click() {
        center = map.getCenter();
        setPosition(center);
      }
    })
    return !position? 
null
     : (
    <Marker position={position}>
        {children}
    </Marker>);
  }
  

export default function Track() {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
            useGeolocated({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                userDecisionTimeout: 5000,
            });


    return (!isGeolocationAvailable ? (
                <div>Your browser does not support Geolocation</div>
            ) : !isGeolocationEnabled ? (
                <div>Geolocation is not enabled</div>
            ) : coords ? (

                <MapContainer 
                id="map"
                center={[coords.latitude, coords.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                
                >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />

                <DynamicMarker location={[coords.latitude, coords.longitude]}>
                    <Popup>blah</Popup>
                </DynamicMarker>
              </MapContainer>

            ) : (
                <div>Getting the location data &hellip; </div>
            )
        



    )}
