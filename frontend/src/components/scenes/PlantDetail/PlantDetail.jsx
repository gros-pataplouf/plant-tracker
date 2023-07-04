import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import Carousel from "../../elements/Carousel";
import { Link } from "react-router-dom";
import Tile from "../../elements/Tile";
import TileXL from "../../elements/TileXL";

const classes = {
  wrapper: "flex flex-col justify-center h-[90vh]",
  emblaSlide:
    "group/item flex-[0_0_95%] border-r-white min-w-0 space-y-2 p-2 bg-yellow-50 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-8",
  title: "px-2 text-emerald-800",
  name: "",
  scientific: "italic",
  caption: "block w-full",
};

export default function PlantList() {
  const [plant, setPlant] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [findings, setFindings] = useState(null);

  useEffect(() => {
    const id = window.location.href
      .replaceAll("/", " ")
      .trim()
      .split(" ")
      .at(-1);
    const plant = axiosInstance.get(`api/plants/${id}`);
    const photos = axiosInstance.get("api/plants/images");
    const places = axiosInstance.get("api/locations");

    Promise.all([plant, photos, places])
      .then((values) => {
        setPlant(values[0].data);
        setPhotos(
          values[1].data.filter((_) => {
            return String(_.plant) === id;
          })
        );
        setFindings(values[2].data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {plant ? (
        
        <TileXL>
          <h2 className={classes.title}>{plant.common_name_en}</h2>
          <h4>Description</h4>
          <p>{plant.description_en}</p>

          <Carousel>
            {photos
              .filter((photo) => photo.type !== "identification")
              .map((photo) => (
                <figure
                  key={photo.id}
                  id="emblaSlide"
                  className={classes.emblaSlide}
                >
                  <img src={photo.image} alt={photo.description_en} />
                  <figcaption className={classes.caption}>
                    {photo.description_en}
                  </figcaption>
                </figure>
              ))}
          </Carousel>
          <h4>Identification</h4>
          <p>{plant.identification_en}</p>
          <Carousel>
            {photos
              .filter((photo) => photo.type === "identification")
              .map((photo) => (
                <figure
                  key={photo.id}
                  id="emblaSlide"
                  className={classes.emblaSlide}
                >
                  <img src={photo.image} alt={photo.description_en} />
                  <figcaption className={classes.caption}>
                    {photo.description_en}
                  </figcaption>
                </figure>
              ))}
          </Carousel>
          <h4>Ecology</h4>
          <p>{plant.ecology_en}</p>
          <h4>Recent findings</h4>
          <ul>
            {findings &&
              findings
                .filter((_) => _.plant === plant.id)
                .map((_) => {
                  return (
                    <li key={_.id}>
                      <Link to={`/locations/${_.id}`}>
                        {_.area} m² near {_.display_name},{" "}
                        {new Date(_.created_at).toLocaleString("en-GB")}
                      </Link>
                    </li>
                  );
                })}
          </ul>
        </TileXL>
      ) : (
        <div className={classes.wrapper}>
          <Tile>
          <AnimationLoading>
          <p>Getting data from the server...</p>
        </AnimationLoading>
          </Tile>
        </div>
      )}
    </div>
  );
}
