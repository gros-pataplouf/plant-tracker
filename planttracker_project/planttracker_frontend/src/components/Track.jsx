import axios from 'axios';
import { API_URL_LOCATIONS } from '../constants';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useGeolocated } from "react-geolocated";



export default function Track() {

const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    return (!isGeolocationAvailable ? (
                <div>Your browser does not support Geolocation</div>
            ) : !isGeolocationEnabled ? (
                <div>Geolocation is not enabled</div>
            ) : coords ? (

                <MapContainer id="map" center={[9.86409912109375, 54.06325355147857]} zoom={8} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                                <Marker position={[coords.longitude, coords.longitude]}>
                <Popup> "Hello" </Popup>
            </Marker>


              </MapContainer>

            ) : (
                <div>Getting the location data&hellip; </div>
            )
        



    )}
