import axios from 'axios';
import { axiosInstance } from '../helpers/axios';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { debounce } from "../helpers/utils"
import { API_OSM_NOMINATIM, API_URL_LOCATIONS, API_URL_PLANTS } from '../constants';

// const selection = document.getElementById('plant');
// console.log(selection.options[selection.selectedIndex].dataindex);

function Form(props) {
  const {location} = props.location;
  const [lat, lng] = location;
  const [plantList, setPlantList] = useState([]);
  useEffect(() => {
    axiosInstance.get('plants/').then(res => setPlantList(res.data))}, []);
  function submitHandler(e){
    e.preventDefault();
    const selection = document.getElementById('plant');
    axiosInstance.post('locations/', {
      author: 1,
      plant: selection.options[selection.selectedIndex].id,
      location: {
        type: "Point",
        coordinates: [lat, lng]
    },
      area: parseInt(document.getElementById('area').value),
      description: document.getElementById('description').value,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  return (
    <form method="post">
      <label htmlFor="location">Surface</label>
      <input type="number" name="area" id="area" />
      <label htmlFor="description">Add a comment</label>
      <input type="text" name="description" id="description" />
      <select name="plant" id="plant">
          <option value="">Select a species</option>
          {plantList.map(plant => {
            return (
          <option key={plant.id} id={plant.id} name={plant.common_name_en}>{plant.common_name_en}</option>)})}
      </select>
      <button type="submit" value="Submit" onClick={submitHandler}>Submit</button>
    </form>
  )
}

function CenterAutomatically({location, setLocation}) {
  const map = useMap();
   useEffect(() => {
    map.flyTo(location, map.getZoom())
   }, [location]);
   return null;
 }


function Map({props}) {
  const  {location, setLocation, coords} = props;
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
  >  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
  />

  <DynamicMarker location={location} setLocation={setLocation}/>
  <CenterAutomatically location={location} setLocation={setLocation} props={{location, setLocation}}/>

</MapContainer>
)
}


function SearchField({props}) {
  const {setLocation, location, coords} = props;
  const [results, setResults] = useState([]);
  const inputField = document.querySelector("input");

  function inputHandler() {
    const url = `${API_OSM_NOMINATIM}?q=${inputField.value}&limit=5&format=json`;
      axios.get(url)
      .then(res => {
          setResults(res.data);

      })
      .catch(e => console.log(e))}

      function clickHandler(e) {
        const dataindex = parseInt(e.target.getAttribute("dataindex"));
        const [filtered] = results.filter(i => i.place_id == dataindex);
        setLocation([parseFloat(filtered.lat), parseFloat(filtered.lon)]);
        setResults([]);
        inputField.value = "";
      }
      
      function clickHandlerButton() {
        inputField.value = "";
        setResults([]);
        setLocation([coords.latitude, coords.longitude]);
      }

  return (
      <>
      <input id="inputfield" onChange={debounce(inputHandler)}/>
      {coords && <button onClick={clickHandlerButton} coords={coords}>Go Back to detected location</button>}
      {results.map(
              _ => {return <div dataindex={_.place_id} key={_.place_id} onClick={clickHandler}>{_.display_name}</div>}
          )}
      </>
  )
}

function ContinueButton({props}) {
  const {location, setDisplay} = props;
  function clickHandler() {
    setDisplay("form");
  }
  return (
    <button onClick={clickHandler}>Continue</button>
  )
}

function BackButton({props}) {
  const {setDisplay} = props;
  function clickHandler() {
    setDisplay("map");
  }
  return (
    <button onClick={clickHandler}>Back</button>
  )
}


function DynamicMarker(props) {
    const {location, setLocation} = props;
    let center;
    const map = useMapEvents({
      drag() {
        center = map.getCenter();
        setLocation([center.lat, center.lng]);
      }
    })
    return (<Marker position={location}/>)
  }

export default function Track() {
  const navigate = useNavigate();
  const currentURL = useLocation();
  useEffect(() => {axiosInstance.get('token/authtest/')
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
    userDecisionTimeout: 5000
});

if (display === "map"){
  return (!isGeolocationAvailable || !isGeolocationEnabled || coords) ? (
  <>
  <SearchField props={{setLocation, location, coords}}/>
  <Map props={{location, setLocation, coords}}/>
  <ContinueButton props={{location, setDisplay}}/>
</>
) 
: (
  <div>Getting the location data&hellip; </div>
);
} else if (display === "form") {
  return (
    <Form location={{location}}/>
  )
}} 
