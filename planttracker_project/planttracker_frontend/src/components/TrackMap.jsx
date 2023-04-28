import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useGeolocated } from "react-geolocated";
import { debounce } from "../helpers/utils"
import { API_OSM_NOMINATIM } from '../constants';
import { useState, useEffect } from 'react';
import { leafletLowZIndex } from '../helpers/leafletHelpers';



// the actual map   
function Map({props}) {
    const  {location, setLocation, coords} = props;
    useEffect(() => {
        if (coords) {
        setLocation([coords.latitude, coords.longitude])
        }
    }, [coords])
    return(
    <MapContainer id="map" center={location} zoom={5} scrollWheelZoom={true} whenReady={leafletLowZIndex}>
        <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
    <DynamicMarker location={location} setLocation={setLocation}/>
    <CenterAutomatically location={location} setLocation={setLocation} props={{location, setLocation}}/>

    </MapContainer>
    )
}

// Map components
//thanks to the dynamic marker, the user can drag the map under the marker, the location in state is updated accordingly

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
  };

//CenterAutomatically is a pseudo component allowing the map to center to any new location, thus allowing the user to set a location through the SearchField
function CenterAutomatically({location}) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(location, map.getZoom())
     }, [location]);
     return null;
   }

  
function SearchField({props}) {
    const {setLocation, location, coords} = props;
    const [results, setResults] = useState([]);
    const inputField = document.querySelector("input");

    function inputHandler() {

        // get list of possible geolocation data for search string from OSM API
        const url = `${API_OSM_NOMINATIM}?q=${inputField.value}&limit=5&format=json`;
        axios.get(url)
        .then(res => {
            setResults(res.data);

        })
        .catch(e => console.error(e))}

        // empty search field, search results in state and go to selected result
        function goToResult(e) {
            const dataindex = parseInt(e.target.getAttribute("dataindex"));
            const [filtered] = results.filter(i => i.place_id == dataindex);
            setLocation([parseFloat(filtered.lat), parseFloat(filtered.lon)]);
            setResults([]);
            inputField.value = "";
        }
        
        // empty search field, search results in state and reset location to detected coords
        function goBack() {
            inputField.value = "";
            setResults([]);
            setLocation([coords.latitude, coords.longitude]);
        }

    return (
        <>
        <input id="inputfield" onChange={debounce(inputHandler)}/>
        {coords && <button onClick={goBack} coords={coords}>Go Back to detected location</button>}
        {results.map(
                _ => {return <div dataindex={_.place_id} key={_.place_id} onClick={goToResult}>{_.display_name}</div>}
            )}
        </>
    )
}
  
  function GoToFormButton({props}) {
    const {location, setDisplay} = props;
    function clickHandler() {
      setDisplay("form");
    }
    return (
      <button onClick={clickHandler}>Continue</button>
    )
  }

  


export default function TrackMap({props}) {
    const {location, setLocation, setDisplay} = props;
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
    return (!isGeolocationAvailable || !isGeolocationEnabled || coords) ? (
        <>
      
        <SearchField props={{setLocation, location, coords}}/>
        <Map props={{location, setLocation, coords}}/>
        <GoToFormButton props={{location, setDisplay}}/>
      </>
      ) 
      : (
        <div>Getting the location data&hellip; </div>
      )

}