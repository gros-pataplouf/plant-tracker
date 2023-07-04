import { useState, useEffect } from "react";
import axiosInstance from "../../../helpers/axios";
import React from "react";
import Carousel from "../../elements/Carousel";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { leafletLowZIndex, convertGPS } from "../../../helpers/leafletHelpers";
import AnimationLoading from "../../elements/AnimationLoading";
import { Link } from "react-router-dom";
import Tile from "../../elements/Tile";
import ScrollTile from "../../elements/TileXL";

const classes = {
  wrapper: "flex flex-col justify-center h-[90vh]",
  embla: "overflow-hidden",
  emblaContainer: "flex ",
  emblaSlide:
    "group/item overflow-clip flex-[0_0_95%] border-r-white overflow-clip min-w-0 space-y-2 p-2 bg-yellow-50 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-8 h-[40vh]",
  title: "p-4 text-emerald-800",
  name: "",
  scientific: "italic",
  imageContainer: "relative",
  image: "w-full rounded-xl border-emerald-950",
  mapContainer: "border-mint/99 border-2 rounded-md m-4 h-[95%]",
  locationImage: "h-full object-contain",
  table:
    "w-[95%] p-2 mx-auto text-8 rounded-md [&>tbody>tr>td]:p-2 [&>tbody>tr]:p-2 text-white bg-emerald-900 font-bold",
  tableCell: "p-2",
};

export default function LocationDetail() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = window.location.href
      .replaceAll("/", " ")
      .trim()
      .split(" ")
      .at(-1);
    axiosInstance
      .get(`api/locations/${id}`)
      .then((res) => {
        setLocation(res.data);
        const matchingPlant = axiosInstance.get(`api/plants/${res.data.plant}`);
        const locationPhotos = axiosInstance.get(
          `api/locations/images?location=${id}`
        );
        Promise.all([matchingPlant, locationPhotos]).then((values) => {
          setLocation({
            ...res.data,
            plant: values[0].data,
            photos: values[1].data,
          });
          setLoading(false);
        });
      })

      .catch((err) => {
        console.error(err);
      });
  }, []);

  return loading ? (
    <div className={classes.wrapper}>
    <Tile>
    <AnimationLoading>
      <h3>Loading...</h3>
    </AnimationLoading>
    </Tile>
    </div>
  ) : (
    <div className={classes.wrapper}>
      <ScrollTile>
      <h2 className={classes.title}>Location detail</h2>
      {location && (
        <>
          {location.photos && (
            <Carousel>
              {[
                <div className={classes.emblaSlide} key="map">
                  {/* PostGis PointField has coordinates [lat, long], while leaflet needs [lng, lat]. Therefore, deepcopy must be made and coordinates reversed
            in: MapContainer (center), Marker */}
                  <MapContainer
                    className={classes.mapContainer}
                    id="map smallmap"
                    center={structuredClone(
                      location.location.coordinates
                    ).reverse()}
                    zoom={12}
                    scrollWheelZoom={false}
                    whenReady={leafletLowZIndex}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={structuredClone(
                        location.location.coordinates
                      ).reverse()}
                    />
                  </MapContainer>
                </div>,

                ...location.photos.map((_) => {
                  return (
                    <div
                      className={classes.emblaSlide}
                      key={Math.floor(Math.random() * 1000)}
                    >
                      <img
                        className={classes.locationImage}
                        src={_.image}
                        alt=""
                      />
                    </div>
                  );
                }),
              ]}
            </Carousel>
          )}
          <table className={classes.table}>
            <tbody>
              <tr>
                <td>Name</td>
                <td>
                  <Link to={`/plants/${location.plant.id}`}>
                    {location.plant.common_name_en}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Coordinates</td>
                <td>
                  {convertGPS(
                    structuredClone(location.location.coordinates).reverse()
                  )}
                </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>near {location.display_name}</td>
              </tr>
              <tr>
                <td>Surface</td>
                <td>{location.area} m²</td>
              </tr>
              <tr>
                <td>Comment</td>
                <td>{location.description}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{new Date(location.created_at).toLocaleString("en-GB")}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </ScrollTile>
    </div>
  );
}
