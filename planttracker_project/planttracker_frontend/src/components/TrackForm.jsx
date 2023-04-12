import { axiosInstance } from "../helpers/axios";
import { useState, useEffect } from "react";

export default function TrackForm({props}) {
    const {location, setDisplay} = props;
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
        setDisplay("confirm");
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
  