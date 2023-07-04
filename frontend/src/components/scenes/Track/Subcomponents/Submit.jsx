import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimationLoading from "../../../elements/AnimationLoading";
import addphoto from "../../../../assets/icons/addphoto.svg";
import bin from "../../../../assets/icons/bin.svg";
import axiosInstance from "../../../../helpers/axios";
import Carousel from "../../../elements/Carousel";
import Tile from "../../../elements/Tile";

const classes = {
  wrapper: "h-[90vh] flex flex-col justify-center",
  title: "pt-4 text-emerald-800",
  emblaSlide:
    "emblaSlide relative border-b-8 mx-8 border-white h-[20vh] flex-[0_0_100%] pb-4 bg-yellow-50 overflow-hidden rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300",
  form: "flex flex-col",
  photoBtn:
    "text-slate-950 pr-[26px]  whitespace-nowrap block font-bold rounded-lg w-min p-2 px-4  bg-lime/50 border-2 border-emerald-800  mt-6 ml-0 [&>img]:inline-block",
  img: "object-fill",
  imageInput: "hidden",
  bin: "absolute block rounded-full bg-white top-0 right-0 p-2 border-red-500 border-2 border-solid",
  input: "invalid:bg-red-200",
  successDiv: "flex flex-col justify-center items-center min-h-[30vh]",
  successMessage: "font-bold text-3xl text-center p-4",
  successLink: "text-3xl p-4 font-bold text-center text-emerald-900 underline",
};

export default function TrackForm({ props }) {
  const { location } = props;
  const [lng, lat] = location;
  const [plantList, setPlantList] = useState([]);
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setImages([...images, ...e.target.files]);
  }
  function deleteImage(e) {
    e.preventDefault();
    let fileToDeleteName =
      e.target.parentNode.parentNode.getAttribute("dataindex");
    setImages(Array.from(images).filter((_) => _.name !== fileToDeleteName));
  }
  useEffect(() => {
    axiosInstance.get("api/plants/").then((res) => setPlantList(res.data));
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    const fields = document.querySelector("#submitform").childNodes;
    for (let field of fields) {
      if (field.checkValidity && !field.checkValidity()) {
        return window.alert("Form invalid or incomplete.");
      }
    }
    //get a string for location to be able to post it as form data (json not allowed in multipart form)
    const formData = new FormData();
    const selection = document.getElementById("plant");
    formData.append("plant", selection.options[selection.selectedIndex].id);
    formData.append("area", parseInt(document.getElementById("area").value));
    formData.append(
      "location",
      `{"type": "Point", "coordinates": [${lat}, ${lng}]}`
    );
    if (images.length) {
      for (let img of images) {
        formData.append("images", img);
      }
    }
    formData.append(
      "description",
      document.getElementById("description").value.trim()
    );

    setSubmitting(true);
    axiosInstance
      .post("api/locations/", formData)
      .then(function (response) {
        setSuccess(true);
        setSubmitting(false);
        setMessage(response.data);
        // setDisplay("success");
      })
      .catch(function (error) {
        console.log(error);
        setSubmitting(false);
        setMessage(error.response.data);
      });
  }

  return (
    <div className={classes.wrapper}>
    <Tile>
      {!submitting && !success && (
        <form
          className={classes.form}
          method="post"
          encType="multipart/form-data"
          id="submitform"
        >
          <h3 className={classes.title}>Complete and submit</h3>

          <label className={classes.label} htmlFor="location">
            Surface (m²)
          </label>
          <input
            className={classes.input}
            type="number"
            min="0"
            name="area"
            id="area"
            required
            placeholder="required, no decimals"
          />

          <label className={classes.label} htmlFor="description">
            Add a comment
          </label>
          <textarea name="description" id="description" rows="4" cols="50" />

          <label className={classes.label} htmlFor="description">
            Species
          </label>
          <select name="plant" id="plant" required className={classes.input}>
            <option value="">Select a species</option>
            {plantList.map((plant) => {
              return (
                <option
                  key={plant.id}
                  id={plant.id}
                  name={plant.common_name_en}
                >
                  {plant.common_name_en}
                </option>
              );
            })}
          </select>
          <label className={classes.photoBtn} htmlFor="images">
            Add photo <img id="camsymbol" src={addphoto} alt="add photo" />
          </label>
          <input
            className={classes.imageInput}
            accept="image/"
            id="images"
            name="images"
            type="file"
            multiple
            onChange={handleChange}
          />
          {/* in order to show preview, convert FileList to Ecmascript array if there are any images in state*/}
          {images.length > 0 && (
            <Carousel>
              {Array.from(images).map((img) => {
                return (
                  <div
                    id="emblaSlide"
                    key={img.name}
                    dataindex={img.name}
                    className={classes.emblaSlide}
                  >
                    <button onClick={deleteImage}>
                      <img className={classes.bin} src={bin} alt="delete" />
                    </button>
                    <img
                      className={classes.img}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                    />
                  </div>
                );
              })}
            </Carousel>
          )}

          <button
            type="submit"
            className="btn mt-4"
            value="Submit"
            onClick={submitHandler}
          >
            Submit
          </button>
        </form>
      )}
      {submitting && !success && (
        <AnimationLoading>
          <h3>Submitting...</h3>
        </AnimationLoading>

      )}
      {message && success && (
        <div class={classes.successDiv}>
          <p class={classes.successMessage}>
            Thanks for submitting your observations ✅
          </p>
          <p></p>
          <Link class={classes.successLink} to={`/locations/${message}`}>
            View submission
          </Link>
        </div>
      )}
    </Tile>
    </div>
  );
}
