import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import Carousel from "../../elements/Carousel";
import Tile from "../../elements/Tile";
import TileXL from "../../elements/TileXL";

export default function PlantList() {
  const [plantList, setPlantList] = useState(false);
  const [plantImages, setPlantImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const plantDataPromise = axiosInstance.get("api/plants/");
    const plantImagesPromise = axiosInstance.get("api/plants/images/");
    Promise.all([plantDataPromise, plantImagesPromise])
      .then((values) => {
        setPlantList(values[0].data);
        setPlantImages(values[1].data);
        setLoading(false);
      })
      .catch((err) => console.error(err))
  }, []);

  return loading ? (
    <div className="wrapper-tile">
      <Tile>
        <AnimationLoading>
          <p className="font-bold">Loading...</p>
        </AnimationLoading>
      </Tile>
    </div>
  ) : (
    <div className="wrapper-tile md:mt-6">
      <TileXL>
        <h1 className="pt-6 ml-2 text-center text-emerald-950">
          Catalogue of invasive plants
        </h1>
        <Carousel>
          {plantList.map((plant) => (
            <div
              key={plant.id}
              id="emblaSlide"
              className="relative w-screen h-auto overflow-hidden max-h-[70vh] embla-slide"
            >
              <h2 className="pt-6 ml-2 text-4xl font-bold text-center text-emerald-800">
                {plant.common_name_en}
              </h2>

              <figure
                key={plant.id}
                className="flex flex-col items-center justify-center py-6"
              >
                <img
                  className="block object-scale-down mx-auto my-2 border-2 border-solid rounded-lg max-h-96 border-slate-200"
                  src={
                    // if no image for this plant is found, show default image
                    plantImages.filter(
                      (img) => img.plant === plant.id && img.type === "main"
                    )[0]
                      ? plantImages.filter(
                          (img) => img.plant === plant.id && img.type === "main"
                        )[0].image
                      : plantImages.filter((img) => img.type === "default")[0]
                          .image
                  }
                  alt={plant.common_name_en}
                />
                <figcaption className="block mx-auto italic font-bold text-center">
                  {plant.scientific_name}
                </figcaption>
              </figure>
              <Link
                to={`${plant.id}/`}
                className="absolute bottom-0 right-0 z-10 p-2 font-bold bg-white rounded-full md:hidden text-emerald-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 96 960 960"
                  width="24"
                >
                  <path
                    d="M453 776h60V610h167v-60H513V376h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
                    stroke="#065f46"
                    strokeWidth="50"
                  />
                </svg>
              </Link>
              <p className="px-4 mt-2 text-ellipsis" id="description">
              {plant.description_en}

                
                <Link
                  className="absolute hidden italic bg-white px-4 rounded-lg lg:py-2 font-bold md:block bottom-0 right-2 text-emerald-800 active:text-emerald-950"
                  to={"/plants/" + plant.id}
                >
                  &nbsp; Learn more
                </Link>
              </p>
            </div>
          ))}
        </Carousel>
      </TileXL>
    </div>
  );
}
