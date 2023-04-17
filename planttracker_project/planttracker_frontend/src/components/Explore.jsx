import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import axiosInstance from '../helpers/axios';
import { plantsAndMarkers, plantsAndSymbols } from '../helpers/leafletHelpers';

function Checkbox({props}) {

  const {plant, locationList, setLocationList} = props;
  const [ checked, setChecked ] = useState(true);
  useEffect(() => {
    const inputBoxes = document.querySelectorAll('input');
    let userChoices = []
    for (let box of inputBoxes) {
      userChoices.push(box.checked)
    };
    axiosInstance.get('locations/')
    .then(res => {
      setLocationList(res.data.filter(loc => {
        return userChoices[loc.plant - 1]
      }))
    })
    .catch(err => console.error(err))

  }, [checked]);

  function handleCheckbox() {
    setChecked(!checked)
    return null
  }
  return (<input type="checkbox" id={plant.id} name={plant.Id} onChange={handleCheckbox} checked={checked}/>) 
}


function Legend({props}) {
  const [plantList, setPlantList] = useState([]);
  const {locationList, setLocationList} = props;
    
  useEffect(() => {axiosInstance.get('plants/')
    .then(res => setPlantList(res.data))
    .catch(err => {
      console.error(err);
    })
  }, [])



  return (
  <form id='selectionForm'>
  <legend>Filter by species:</legend>
  {plantList.map(plant => (
      <div key={plant.id}>
      <Checkbox props={{plant, locationList, setLocationList}}/>
      <label for={plant.id}>
        <img src={plantsAndSymbols[plant.id]} alt="" />
        {plant.common_name_en}</label>
    </div>
  ))}
</form>)

}


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

            <Marker key={location.id} position={location.location.coordinates.reverse()} icon={plantsAndMarkers[location.plant]}>
                <Popup > {location.area}m2 {location.plant}</Popup>
            </Marker>
        )
    })




    return (
      <>
    <MapContainer id="map" center={[54.06325355147857, 9.86409912109375]} zoom={8} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
{markUp}
</MapContainer>
<Legend props={{locationList, setLocationList}}/>
</>
)}