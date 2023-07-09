import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimationLoading from "../../../elements/AnimationLoading";
import addphoto from "../../../../assets/icons/addphoto.svg";
import bin from "../../../../assets/icons/bin.svg";
import axiosInstance from "../../../../helpers/axios";
import Carousel from "../../../elements/Carousel";
import Tile from "../../../elements/Tile";

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
    <div className="wrapper-tile">
      <Tile>
        {!submitting && !success && (
          <form
            className="flex flex-col space-y-2"
            method="post"
            encType="multipart/form-data"
            id="submitform"
          >
            <h1 className="pt-4 text-emerald-800">Complete and submit</h1>

            <label htmlFor="location">Surface (m²)</label>
            <input
              className="invalid:bg-red-200"
              type="number"
              min="0"
              name="area"
              id="area"
              required
              placeholder="required, no decimals"
            />

            <label htmlFor="description">Add a comment</label>
            <textarea name="description" id="description" rows="4" cols="50" />

            <label htmlFor="description">Species</label>
            <select className="mb-6" name="plant" id="plant" required>
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
            <label
              className="block text-slate-950 pr-[26px] my-4 whitespace-nowrap font-bold rounded-lg w-min p-2 px-4 bg-lime/50 border-2 border-emerald-800"
              htmlFor="images"
            >
              Add photo
              <img
                className="inline-block"
                id="camsymbol"
                src={addphoto}
                alt="add photo"
              />
            </label>
            <input
              className="hidden"
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
                      className="relative embla-slide overflow-hidden border-b-8 h-[20vh] flex-[0_0_100%]"
                    >
                      <button onClick={deleteImage}>
                        <img
                          className="absolute top-0 right-0 block p-2 bg-white border-2 border-red-500 border-solid rounded-full"
                          src={bin}
                          alt="delete"
                        />
                      </button>
                      <img src={URL.createObjectURL(img)} alt="preview" />
                    </div>
                  );
                })}
              </Carousel>
            )}

            <button
              type="submit"
              className="mt-4 btn"
              value="Submit"
              onClick={submitHandler}
            >
              Submit
            </button>
          </form>
        )}
        {submitting && !success && (
          <AnimationLoading>
            <p className="font-bold text-center">Submitting...</p>
          </AnimationLoading>
        )}
        {message && success && (
          <div className="flex flex-col justify-center items-center min-h-[30vh]">
            <p className="p-4 text-3xl font-bold text-center">
              Thanks for submitting your observations ✅
            </p>
            <p></p>
            <Link
              className="p-4 text-3xl font-bold text-center underline text-emerald-900"
              to={`/locations/${message}`}
            >
              View submission
            </Link>
          </div>
        )}
      </Tile>
    </div>
  );
}
