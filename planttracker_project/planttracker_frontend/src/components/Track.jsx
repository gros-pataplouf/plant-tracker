import axios from 'axios';
import { API_URL_LOCATIONS } from '../constants';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useGeolocated } from "react-geolocated";
import {debounce} from "../helpers/utils"

import { API_OSM_NOMINATIM } from '../constants';

function useLocation(initialValue) {
const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });
    if (coords) {
      console.log(coords);
      initialValue = [coords.latitude, coords.longitude];
      
    }
    return initialValue;

}


function SearchField(props) {
  const {position} = props;
  const [results, setResults] = useState([]);


  function inputHandler() {
      const input = document.querySelector("#inputfield")
      const url = `${API_OSM_NOMINATIM}?q=${input.value}&limit=5&format=json`;
      axios.get(url)
      .then(res => {
          setResults(res.data);

      })
      .catch(e => console.log(e))}

      function clickHandler(e) {
        const dataindex = parseInt(e.target.getAttribute("dataindex"));
        const [filtered] = results.filter(i => i.place_id == dataindex);
        console.log([filtered.lon, filtered.lat])
      }


  

  return (
      <>
      <h2></h2>
      <input id="inputfield" onInput={debounce(inputHandler)}/>
      {results.map(
              _ => {return <div dataindex={_.place_id} key={_.place_id} onClick={clickHandler}>{_.display_name}</div>}
          )}
 
      </>

  )
}


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

  const coords = useLocation([50, 10]);
  console.log(coords);


    return (                <>
                <SearchField position={coords}/>
                <MapContainer 
                id="map"
                center={coords}
                zoom={5}
                scrollWheelZoom={true}
                
                >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />

                <DynamicMarker location={coords}>
                    <Popup>
                    <form class="formdata" method="post">
                    <label for="name">Name</label>
                      <input name="name" id="name"/>
                      <label for="location">Location</label>
                      <input name="location" id="location"/>
                      <div id="camcontainer">
                      <button id="cam">Cam</button>
                      <video class='hidden'></video>
                      <button class="take_photo"><img height="20px" width="20px" src="./public/icons/camera_material.svg" alt=""/></button>
                      </div>
                      <div id="imageSrc"><img src="" class="blob" alt=""/></div>
                      <button>Abschicken</button>

                    </form>
                    </Popup>
                </DynamicMarker>
              </MapContainer>
              </>
            )}
