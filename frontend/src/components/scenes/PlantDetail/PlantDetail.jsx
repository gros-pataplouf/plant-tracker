import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import Carousel from "../../elements/Carousel";
import Tile from "../../elements/Tile";
import TileXL from "../../elements/TileXL";

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
          <h1 className="px-4 my-2 text-center text-emerald-800">{plant.common_name_en}</h1>
          <p className="italic font-bold text-center text-slate-800">{plant.scientific_name}</p>

          <h2 className="px-4 mt-6 mb-4 font-bold text-emerald-950">Description</h2>
          <p className="px-4">{plant.description_en}</p>

          <Carousel>
            {photos
              .filter((photo) => photo.type !== "identification")
              .map((photo) => (
                <figure
                  key={photo.id}
                  id="emblaSlide"
                  className="flex flex-col items-center justify-center embla-slide"
                >
                  <img
                    className="block object-scale-down max-h-[95%] m-auto"
                    src={photo.image}
                    alt={photo.description_en}
                  />
                  <figcaption className="block mx-auto mb-2 text-center">
                    {photo.description_en}
                  </figcaption>
                </figure>
              ))}
          </Carousel>
          <h2 className="px-4 mt-6 mb-4 font-bold text-emerald-950">Identification</h2>
          <p className="px-4">{plant.identification_en}</p>
          <Carousel>
            {photos
              .filter((photo) => photo.type === "identification")
              .map((photo) => (
                <figure
                  key={photo.id}
                  id="emblaSlide"
                  className="flex flex-col items-center justify-center embla-slide"
                >
                  <img
                    className="block object-scale-down max-h-[95%] m-auto"
                    src={photo.image}
                    alt={photo.description_en}
                  />
                  <figcaption className="block mx-auto text-center">
                    {photo.description_en}
                  </figcaption>
                </figure>
              ))}
          </Carousel>
          <h2 className="px-4 mt-6 mb-4 font-bold text-emerald-950">Ecology</h2>
          <p className="px-4">{plant.ecology_en}</p>
          <h2 className="px-4 mt-6 mb-2 font-bold text-emerald-950">
            Recent findings
          </h2>
          <ul className="px-4" >
            {findings &&
              findings
                .filter((_) => _.plant === plant.id)
                .map((_) => {
                  return (
                    <li className="block py-3" key={_.id}>
                      📌 &nbsp;
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
        <div className="wrapper-tile">
          <Tile>
            <AnimationLoading>
              <p className="font-bold">Getting data from the server...</p>
            </AnimationLoading>
          </Tile>
        </div>
      )}
    </div>
  );
}
