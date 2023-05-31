import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import mylocation from '../assets/icons/mylocation.svg';
import { Marker, Popup } from "react-leaflet";
import { debounce } from "../helpers/utils"
import { API_OSM_NOMINATIM } from '../constants';
import axiosInstance from "../helpers/axios";
import L from 'leaflet';
import { Link } from "react-router-dom";


const classes = {
    goBackButton: 'z-10 bg-white p-[5px] mt-[80px] ml-[10px] leaflet-bar leaflet-control h-[34px] w-[34px]',
    searchModule: 'z-10 absolute top-[10px] right-2 leaflet-bar leaflet-control w-[80%] max-h-[66%] overflow-scroll',
    searchInput: 'bg-white p-[5px] h-[30px] w-full',
    searchResult: 'border-2 border-slate-50 bg-white p-[3px] w-[100%]',
    legend: 'absolute z-20 bg-slate-100 right-0 p-2 rounded-2xl', 
    legendItem: 'flex p-2',
    input: 'h-6 w-6 my-auto'
}


//a control element of the map. Clicking on it resets center and dynamic marker to detected location. Hidden if geolocation disabled.
export function GoBackButton({props}) {
    const {coords, setResults, setLocation} = props;
    const map = useMap();

    function goBack() {
        const inputfield = document.querySelector('#inputfield');
        inputfield.value = "";
        map.flyTo([coords.latitude, coords.longitude])
        setResults([]);
        setLocation([coords.latitude, coords.longitude]);
    }
    if (coords) {
        return (<button className={classes.goBackButton} onClick={goBack}><img src={mylocation} alt="" /></button>)}
    return null;
}

//thanks to the dynamic marker, the user can drag the map under the marker, the location in state is updated accordingly
export function DynamicMarker({props}) {
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
export function CenterAutomatically({location}) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(location, map.getZoom())
     }, [location]);
     return null;
   }


// users can search for address and map fliess to selected location    
export function Search({props}) {
    const {setLocation, location, coords, results, setResults} = props;
    const inputField = document.querySelector("input");
    const map = useMap();


    function inputHandler() {
        // get list of possible geolocation data for search string from OSM API
        const url = `${API_OSM_NOMINATIM}?q=${inputField.value}&limit=8&format=json`;
        axiosInstance.get(url)
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
            map.setZoom(17);
            inputField.value = "";
        }
    return (
        <div className={classes.searchModule} >
        <input className={classes.searchInput} id="inputfield" onChange={debounce(inputHandler)} placeholder='search address' />
        {results.map(
            _ => {return <div className={classes.searchResult} dataindex={_.place_id} key={_.place_id} onClick={goToResult}>{_.display_name}</div>}
            )}
        </div>
    )
}

//generates an svg of desired color 
function svgFile(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480.089 566Q509 566 529.5 545.411q20.5-20.588 20.5-49.5Q550 467 529.411 446.5q-20.588-20.5-49.5-20.5Q451 426 430.5 446.589q-20.5 20.588-20.5 49.5Q410 525 430.589 545.5q20.588 20.5 49.5 20.5ZM480 976Q319 839 239.5 721.5T160 504q0-150 96.5-239T480 176q127 0 223.5 89T800 504q0 100-79.5 217.5T480 976Z" stroke=${color} fill="hsl(${color}, 50%, 50%)"></svg>`
}

export function markers (plants, locations) {
    return locations.map(location => {
        const customIcon = new L.divIcon({
            html: svgFile(360/plants.length*(location.plant-1-plants.length)),
            popupAnchor:  [-0, -0],
            iconSize: [26,36],
            className: ''
          });
        const currentPlant = plants.filter(plant => {
            return plant.id === location.plant;
        })
        {/* PostGis PointField has coordinates [lat, long], while leaflet needs [lng, lat].
        Therefore, deepcopy (structuresClone(arr) must be made and coordinates reversed
            in: Marker */}

        return (
            <Marker key={location.id} position={structuredClone(location.location.coordinates).reverse()} icon={customIcon}>
            <Popup > {currentPlant[0].common_name_en} <br/>
            {location.area} m² <Link to={`/locations/${location.id}`}>View</Link></Popup>
            </Marker>
          )
      })
}


export function Legend({props}) {
    const [plantList, setPlantList] = useState([]);
    const {locationList, setLocationList, initialLocationList} = props;
      
    useEffect(() => {axiosInstance.get('api/plants/')
      .then(res => setPlantList(res.data))
      .catch(err => {
        console.error(err);
      })
    }, []);
   
  
    return (
    <form id='selectionForm' className={classes.legend}>
    <p>Filter by species</p>
    {plantList.map(plant => (
        <div className={classes.legendItem} key={plant.id}>
        <Checkbox props={{plant, locationList, setLocationList, initialLocationList, plantList}}/>
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M480.089 566Q509 566 529.5 545.411q20.5-20.588 20.5-49.5Q550 467 529.411 446.5q-20.588-20.5-49.5-20.5Q451 426 430.5 446.589q-20.5 20.588-20.5 49.5Q410 525 430.589 545.5q20.588 20.5 49.5 20.5ZM480 976Q319 839 239.5 721.5T160 504q0-150 96.5-239T480 176q127 0 223.5 89T800 504q0 100-79.5 217.5T480 976Z" stroke="red" fill={`hsl(${360/plantList.length*(plant.id-1-plantList.length)}, 50%, 50%)`}/></svg>
        <label htmlFor={plant.id}>
          {plant.common_name_en}</label>
      </div>
    ))}
  </form>)
}


function Checkbox({props}) {
    const {plant, locationList, setLocationList, initialLocationList, plantList} = props;
    const [ checked, setChecked ] = useState(true);
    useEffect(() => {
      const inputBoxes = document.querySelectorAll('input');
      let userChoices = []
      for (let box of inputBoxes) {
        userChoices.push(box.checked)
      };
      
      setLocationList(initialLocationList.filter(loc => {
        console.log(loc.plant, plantList.length)
        return userChoices[loc.plant%plantList.length -1]
      }))
    }, [checked]);
  
    function handleCheckbox() {
      setChecked(!checked);
      console.log(locationList, initialLocationList)
      return null
    }
    return (<input className={classes.input} type="checkbox" id={plant.id} name={plant.Id} onChange={handleCheckbox} checked={checked}/>) 
  }
  