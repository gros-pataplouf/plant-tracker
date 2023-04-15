import { axiosInstance } from "../helpers/axios";
import { useState, useEffect } from "react";
import TrackFormCamera from "./TrackFormCamera";

export default function TrackForm({props}) {
    const {location, setDisplay} = props;
    const [lat, lng] = location;
    const [plantList, setPlantList] = useState([]);
    const [ image, setImage ] = useState(null);
    const [ cam, setCam ] = useState(false);
    function handleChange(e) {
      setImage(e.target.files[0]);
    };
    function goToCam(e) {
      e.preventDefault();
      setCam("stream");
    }
    useEffect(() => {
      axiosInstance.get('plants/').then(res => setPlantList(res.data))}, []);
    function submitHandler(e){
      e.preventDefault();
      console.log(image)

      const selection = document.getElementById('plant');
      //get a string for location to be able to post it as form data (json not allowed in multipart form)
      const location = `{"type": "Point", "coordinates": [${lat}, ${lng}]}`
      axiosInstance.post('locations/', {
        plant: selection.options[selection.selectedIndex].id,
        location: location,
        area: parseInt(document.getElementById('area').value),
        description: document.getElementById('description').value,
        image: image,
      })
      .then(function (response) {
        console.log(response);
        setDisplay("confirm");
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  
  
    return (
      <>
      {! cam && 
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
        <label htmlFor="image">Upload a photo</label>
        <input accept='image/' id="image" name="image" type="file" onChange={handleChange}/>
        <button onClick={goToCam}>Take a photo</button>
        <img src={image} alt='preview' />
        <button type="submit" value="Submit" onClick={submitHandler}>Submit</button>
      </form>}
        {cam && <TrackFormCamera props={{ image, setImage, cam, setCam }}/>}
      </>
    )
  }
  