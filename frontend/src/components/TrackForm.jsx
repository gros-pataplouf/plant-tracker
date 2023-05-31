import axiosInstance from "../helpers/axios";
import { useState, useEffect } from "react";
import Carousel from "./Carousel";
import bin from '../assets/icons/bin.svg';
import addphoto from '../assets/icons/addphoto.svg';
import { Link } from "react-router-dom";

const classes = {
  wrapper: 'flex flex-col justify-between m-auto w-[95%] h-max-[78vh] p-8 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4 bg-white',
  title: 'pt-4 text-emerald-800',
  emblaSlide: 'emblaSlide relative border-b-8 mx-8 border-white h-[20vh] flex-[0_0_100%] pb-4 bg-yellow-50 overflow-hidden rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300',
  form: 'flex flex-col ', 
  input: '',
  label: 'mt-4 mb-2',
  errorInput: 'border-red-800 active:outline-red-800',
  errorSpan:  "text-red-800 italic",
  photoBtn: 'text-slate-950 pr-[26px]  whitespace-nowrap block font-bold rounded-lg w-min p-2 px-4  bg-lime/50 border-2 border-emerald-800  mt-6 ml-0 [&>img]:inline-block',
  visibilitySvg: 'h-6',
  img: 'object-fill',
  imageInput: 'hidden',
  bin: 'absolute block rounded-full bg-white top-0 right-0'
}



export default function TrackForm({props}) {
    const {location, setDisplay} = props;
    const [lng, lat] = location;
    const [plantList, setPlantList] = useState([]);
    const [ images, setImages ] = useState([]);
    const [ success, setSuccess ] = useState(false);
    const [ message, setMessage ] = useState('');
    function handleChange(e) {
      setImages(e.target.files);
      

    };
    function deleteImage(e) {
      e.preventDefault()
      let fileToDeleteName = e.target.parentNode.parentNode.getAttribute('dataindex')
      setImages(Array.from(images).filter(_ => _.name !== fileToDeleteName))
    }
    useEffect(() => {
      axiosInstance.get('api/plants/').then(res => setPlantList(res.data));
      // const container = document.querySelector("#emblaContainer");
      // console.log(container)
      // if (container.childNodes.length < 2) {
      //   container.parentNode.parentNode.childNodes.forEach(_ => {
      //     console.log(typeof(_.nodeName))
      //     if (_.nodeName === 'BUTTON') {
      //       console.log('hiding button')
      //       _.setAttribute('style', 'display: none')
      //     }
      //   })} else if (container.childNodes.length === 1) { container.parentNode.parentNode.childNodes.forEach(_ => {
      //     console.log(typeof(_.nodeName))
      //       _.setAttribute('style', 'display: block')
          
      //   })}

    
    }, []);
    
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
      
      axiosInstance.post('api/locations/', formData )
      .then(function (response) {
        setSuccess(true);
        setMessage(response.data);
        // setDisplay("success");
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.response.data);
      });
    }
  
  
    return (
      <> {!success && <form className={classes.wrapper} method="post" encType="multipart/form-data">
        <h3 className={classes.title}>Complete and submit</h3>    
        <label className={classes.label} htmlFor="location">Surface</label>
        <input type="number" min='0' name="area" id="area" />
        <label className={classes.label} htmlFor="description">Add a comment</label>
        <input type="text" name="description" id="description" />
        <label className={classes.label} htmlFor="description">Species</label>
        <select name="plant" id="plant">
            <option value="">Select a species</option>
            {plantList.map(plant => {
              return (
            <option key={plant.id} id={plant.id} name={plant.common_name_en}>{plant.common_name_en}</option>)})}
        </select>
        <label className={classes.photoBtn} htmlFor="images">Add photo <img  id="camsymbol" src={addphoto} alt="add photo" /></label>
        <input className={classes.imageInput} accept='image/' id="images" name="images" type="file" multiple onChange={handleChange}/>
{/* in order to show preview, convert FileList to Ecmascript array if there are any images in state*/}
        {images.length > 0 &&
        <Carousel>
        { Array.from(images).map(img => { 
          return (
        
        <div id='emblaSlide' key={img.name} dataindex={img.name} className={classes.emblaSlide}>
          <button onClick={deleteImage}>  
          <img className={classes.bin} src={bin}  alt="delete" />
          </button>
          <img className={classes.img} src={URL.createObjectURL(img)} alt='preview' />
        </div>)})}
        
        </Carousel>}

        <button type="submit" className="btn mt-4" value="Submit" onClick={submitHandler}>Submit</button>
      </form>}
      {message && success && 
      <div>
        <p>Thanks for submitting your observations! ✅</p>
      <Link to={`/locations/${message}`}>View submission</Link>
      </div>

    }
      </>
    )
  }
  