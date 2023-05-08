import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import axiosInstance from '../helpers/axios';
import { plantsAndMarkers, plantsAndSymbols, leafletLowZIndex } from '../helpers/leafletHelpers';

function Checkbox({props}) {
  const {plant, locationList, setLocationList, initialLocationList} = props;
  const [ checked, setChecked ] = useState(true);
  useEffect(() => {
    const inputBoxes = document.querySelectorAll('input');
    let userChoices = []
    for (let box of inputBoxes) {
      userChoices.push(box.checked)
    };
      setLocationList(initialLocationList.filter(loc => {
        return userChoices[loc.plant - 1]
      }))
  }, [checked]);

  function handleCheckbox() {
    setChecked(!checked);
    return null
  }
  return (<input type="checkbox" id={plant.id} name={plant.Id} onChange={handleCheckbox} checked={checked}/>) 
}


function Legend({props}) {
  const [plantList, setPlantList] = useState([]);
  const {locationList, setLocationList, initialLocationList} = props;
    
  useEffect(() => {axiosInstance.get('plants/')
    .then(res => setPlantList(res.data))
    .catch(err => {
      console.error(err);
    })
  }, []);



  return (
  <form id='selectionForm'>
  <legend>Filter by species:</legend>
  {plantList.map(plant => (
      <div key={plant.id}>
      <Checkbox props={{plant, locationList, setLocationList, initialLocationList}}/>
      <label htmlFor={plant.id}>
        <img src={plantsAndSymbols[plant.id]} alt="" />
        {plant.common_name_en}</label>
    </div>
  ))}
</form>)

}


export default function Explore() {  
    const [locationList, setLocationList] = useState([]);
    const [initialLocationList, setInitialLocationList] = useState([]);

    
    useEffect(() => {axiosInstance.get('locations/')
      .then(res => {
        setLocationList(res.data);
        setInitialLocationList(res.data);
      })
      .catch(err => {
        console.error(err);
      })
    }, []);
    const markers = locationList.map(location => {

      return (

            <Marker key={location.id} position={location.location.coordinates.reverse()} icon={plantsAndMarkers[location.plant]}>
                <Popup > {location.area}m² {location.plant}</Popup>
            </Marker>
        )
    })




    return (
      <>
  <MapContainer className="border-mint/99 border-2 rounded-md h-[80vh] m-4" id="map" center={[54.06325355147857, 9.86409912109375]} zoom={8} scrollWheelZoom={false} whenReady={leafletLowZIndex}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
{markers}
</MapContainer>
<Legend props={{locationList, setLocationList,initialLocationList}}/>
</>
)}