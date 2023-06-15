import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import axiosInstance from "../../../helpers/axios";
import { leafletLowZIndex } from "../../../helpers/leafletHelpers";
import { Legend, markers } from "../../elements/MapComponents";

const classes = {
  mapContainer: "border-mint/99 border-2 rounded-lg h-[80vh] m-4",
};

export default function Explore() {
  const [locationList, setLocationList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [initialLocationList, setInitialLocationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("api/locations/"),
      axiosInstance.get("api/plants/"),
    ])
      .then((res) => {
        setLocationList(res[0].data);
        setInitialLocationList(res[0].data);
        setPlantList(res[1].data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return loading ? (
    <Animation />
  ) : (
    <>
      <MapContainer
        className={classes.mapContainer}
        id="map"
        center={[54.06325355147857, 9.86409912109375]}
        zoom={8}
        scrollWheelZoom={false}
        whenReady={leafletLowZIndex}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers(plantList, locationList)}
        <Legend
          props={{
            locationList,
            setLocationList,
            initialLocationList,
            loading,
            setLoading,
          }}
        />
      </MapContainer>
    </>
  );
}
