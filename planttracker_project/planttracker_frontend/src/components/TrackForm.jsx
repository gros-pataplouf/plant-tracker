import axiosInstance from "../helpers/axios";
import { useState, useEffect } from "react";

export default function TrackForm({props}) {
    const {location, setDisplay} = props;
    const [lat, lng] = location;
    const [plantList, setPlantList] = useState([]);
    const [ images, setImages ] = useState([]);
    const [ success, setSuccess ] = useState(false);
    const [ message, setMessage ] = useState('');
    function handleChange(e) {
      setImages(e.target.files);
    };

    useEffect(() => {
      axiosInstance.get('plants/').then(res => setPlantList(res.data))}, []);
    function submitHandler(e){
      e.preventDefault();
      //get a string for location to be able to post it as form data (json not allowed in multipart form)
      const formData = new FormData();
      const selection = document.getElementById('plant');
      formData.append('plant', selection.options[selection.selectedIndex].id);
      formData.append('area', parseInt(document.getElementById('area').value));
      formData.append('location', `{"type": "Point", "coordinates": [${lat}, ${lng}]}`)
      if (images.length) {for (let img of images) {
        formData.append('images', img)
      }}
      formData.append('description', document.getElementById('description').value);

      // check for missing fields 
      const required = ['plant', 'area', 'location'];
      for (let key of required) {
        let value = formData.get(key);
        if (!value) {
          window.alert(`Field ${key} is mandatory.`);
          return setMessage('Please fill in the required fields!')
        }
      }
      



      axiosInstance.post('locations/', formData )
      .then(function (response) {
        setSuccess(true);
        setMessage(response.data);
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.response.data);
      });
    }
  
  
    return (
      <> {!success && <form method="post" enctype="multipart/form-data">    
        <label htmlFor="location">Surface</label>
        <input type="number" min='0' name="area" id="area" />
        <label htmlFor="description">Add a comment</label>
        <input type="text" name="description" id="description" />
        <select name="plant" id="plant">
            <option value="">Select a species</option>
            {plantList.map(plant => {
              return (
            <option key={plant.id} id={plant.id} name={plant.common_name_en}>{plant.common_name_en}</option>)})}
        </select>
        <label htmlFor="images">Upload a photo</label>
        <input accept='image/' id="images" name="images" type="file" multiple onChange={handleChange}/>
        <div>
{/* in order to show preview, convert FileList to Ecmascript array if there are any images in state*/}
        { images.length && Array.from(images).map(img => { return (<img src={URL.createObjectURL(img)} alt='preview' />)})}
          </div>
        <button type="submit" value="Submit" onClick={submitHandler}>Submit</button>
      </form>}
      {message && <p>{message}</p>}
      </>
    )
  }
  