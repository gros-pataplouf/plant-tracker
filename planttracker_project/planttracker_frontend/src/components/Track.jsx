import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { debounce } from "../helpers/utils"
import { API_OSM_NOMINATIM } from '../constants';

function CenterAutomatically({location, setLocation}) {
  const map = useMap();

   useEffect(() => {
     map.setView(location);
     map.panTo(location);
     map.setZoom(10);
   }, [location]);
   return null;
 }
 
function LocatedMap({location, setLocation, coords}) {
  useEffect(() => {
    if (coords) {
      setLocation([coords.latitude, coords.longitude])
    }
  }, [coords])
  return(
  <MapContainer 
  id="map"
  center={location}
  zoom={5}
  scrollWheelZoom={true}
  >


  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
  />

  <DynamicMarker location={location}>
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
  <CenterAutomatically location={location} setLocation={setLocation} props={{location, setLocation}}/>

</MapContainer>
)
}


function SearchField({props}) {
  const {setLocation, location, coords}
  = props;
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
        setLocation([parseFloat(filtered.lat), parseFloat(filtered.lon)])
      }
      function clickHandlerButton(e) {
          setLocation([coords.latitude, coords.longitude])
      }

  return (
      <>
      <input id="inputfield" onInput={debounce(inputHandler)}/>
      {coords && <button onClick={clickHandlerButton} coords={coords}>Go Back to detected location</button>}
      {results.map(
              _ => {return <div dataindex={_.place_id} key={_.place_id} onClick={clickHandler}>{_.display_name}</div>}
          )}
 
      </>

  )
}


function DynamicMarker({children, location}) {
    const [position, setPosition] = useState(location);

    let center;
    useEffect(() => {setPosition(location)}, [location])
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
  const [location, setLocation] = useState([30, 0]);
  const {
    coords,
    getPosition,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
    }
    = useGeolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
});



return (!isGeolocationAvailable || !isGeolocationEnabled || coords) ? (
  <>
  <SearchField props={{setLocation, location, coords}}/>
  <LocatedMap setLocation={setLocation} location={location} coords={coords}/>
</>
) 
: (
  <div>Getting the location data&hellip; </div>
);
}
