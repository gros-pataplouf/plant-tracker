import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimationLoading from "../../../elements/AnimationLoading";
import addphoto from "../../../../assets/icons/addphoto.svg";
import bin from "../../../../assets/icons/bin.svg";
import axiosInstance from "../../../../helpers/axios";
import Carousel from "../../../elements/Carousel";
import TileXL from "../../../elements/TileXL";
import { compressAccurately } from 'image-conversion';
import Lottie from "lottie-react";
import spinner from "../../../../assets/animations/spinner.json";

export default function TrackForm({ props }) {
  const { location } = props;
  const [lng, lat] = location;
  const [plantList, setPlantList] = useState([]);
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handleChange(e) {
    setProcessing(true);
    
    console.log("images", images);
    let imageArray = [];
    for await (let file of e.target.files) {
    setProcessing(true);
    //compress to 200kb
    compressAccurately(file, 200).then(res=>{
    // restore filename if lost during blob conversion (will be needed later)
    let fileFromBlob = new File([res], file.name)
    imageArray = [...imageArray, fileFromBlob];
    setImages([...images, ...imageArray]);
    setProcessing(false);
    })
    };
  };

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
      <TileXL>
        {!submitting && !success && (
          <form
            className="flex flex-col my-auto space-y-4 md:space-y-6"
            method="post"
            encType="multipart/form-data"
            id="submitform"
          >
            <h1 className="text-emerald-800">Complete and submit</h1>

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
            <select name="plant" id="plant" required>
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
            <div></div>
            <label
              className="block text-white text-center whitespace-nowrap py-2 font-bold rounded-lg w-full bg-emerald-800 border-2 border-emerald-800"
              htmlFor="images"
            >
              {!processing ? "Add photo " : "Compressing "}
              {!processing ? (<img
                className="inline-block"
                id="camsymbol"
                src={addphoto}
                alt="add photo"
              />) :
              <Lottie
              animationData={spinner}
              loop={true}
              style={{height: 20, display: "inline-block"}}
              /> }

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
            {images.length > 0 && !processing && (
              <Carousel>
                {Array.from(images).map((img) => {
                  console.log(img);
                  return (
                    <div
                      id="emblaSlide"
                      key={img.name}
                      dataindex={img.name}
                      className="relative embla-slide overflow-hidden h-[20vh] flex-[0_0_100%]"
                    >
                      <button onClick={deleteImage}>
                        <img
                          className="absolute top-0 right-0 block p-2 bg-white border-2 border-red-500 border-solid rounded-full"
                          src={bin}
                          alt="delete"
                        />
                      </button>
                      <img className="block object-scale-down max-h-[95%] m-auto" src={URL.createObjectURL(img)} alt="preview" />
                    </div>
                  );
                })}
              </Carousel>
            )}

            <button
              type="submit"
              className="mt-4 md:block md:mt-8 btn"
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
      </TileXL>
    
  );
}
