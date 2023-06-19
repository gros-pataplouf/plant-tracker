import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import Carousel from "../../elements/Carousel";


const classes = {
  wrapper: "h-[80vh]",
  emblaSlide:
    "group/item overflow-clip flex-[0_0_95%] border-r-white overflow-clip min-w-0 space-y-2 p-2 bg-yellow-50 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-8",
  title: "px-2 text-emerald-800",
  name: "",
  scientific: "italic",
  caption: "block w-full"

  
};

export default function PlantList() {
  const [plant, setPlant] = useState(null);
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    const id = window.location.href.replaceAll("/", " ").trim().split(" ").at(-1);
    const plant = axiosInstance.get(`api/plants/${id}`);
    const photos = axiosInstance.get("api/plants/images");

    Promise.all([plant, photos])
    .then(values => {
      setPlant(values[0].data);
      setPhotos(values[1].data.filter(_ => {return String(_.plant) === id}));
    })
    .catch(err => console.error(err));
}, [])

  return (
    <div className={classes.wrapper}>
      {plant ? 
      <>
      <h2 className={classes.title}>{plant.common_name_en}</h2>
      <h4>Description</h4>
      <p>{plant.description_en}</p>

      <Carousel>
{        photos.filter(photo => photo.type !== 'identification').map(
          (photo) => (
            <div key={photo.id} id="emblaSlide" className={classes.emblaSlide}>
              <img src={photo.image} alt={photo.description_en} />
              <caption className={classes.caption}>{photo.description_en}</caption>
            </div>
          )            
        )      
}
      </Carousel>
      <h4>Identification</h4>
      <p>{plant.identification_en}</p>
      <Carousel>
{        photos.filter(photo => photo.type === 'identification').map(
          (photo) => (
            <div key={photo.id} id="emblaSlide" className={classes.emblaSlide}>
              <img src={photo.image} alt={photo.description_en} />
              <caption className={classes.caption}>{photo.description_en}</caption>
            </div>
          )            
        )      
}
      </Carousel>
      <h4>Ecology</h4>
      <p>{plant.ecology_en}</p>
      </> 
      : <AnimationLoading>
        Getting data from the server...
      </AnimationLoading>
      }

    </div>
  );
}
