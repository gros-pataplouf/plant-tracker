import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { debounce } from "../helpers/utils"
import { API_OSM_NOMINATIM, API_URL_LOCATIONS } from '../constants';


// location model
// class Location(models.Model):
//     location = models.PointField()
//     area = models.IntegerField()
//     image = models.ImageField(blank=True) #upload_to='users/%Y/%m/%d/', 
//     description = models.CharField(max_length=100)
//     author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
//     plant = models.ForeignKey(Plant, on_delete=models.PROTECT)


function Form({location}) {
  return (
    <form method="post">
      <input type="hidden" name="location" value={location} />
      <input type="number" name="area" />
      <input type="text" name="description" />
      <select name="plant" id="plant-selection">
          <option value="">Select a species</option>
          <option ></option>
          <option ></option>
          <option ></option>
          <option ></option>
          <option ></option>
          <option ></option>
      </select>
      <input type="submit" value="Submit" />
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
      
      function clickHandlerButton(e) {
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
  const {setDisplay} = props;
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
        setLocation(center);
      }
    })
    return (<Marker position={location}/>)
  }

export default function Track() {
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
    userDecisionTimeout: 5000,
    watchPosition: true
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
    <Form props={{location}}/>
  )
}} 
