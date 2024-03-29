import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import axiosInstance from "../../../helpers/axios";
import { leafletLowZIndex } from "../../../helpers/leafletHelpers";
import AnimationLoading from "../../elements/AnimationLoading";
import {
  CenterAutomatically,
  Legend,
  Search,
  markers,
} from "../../elements/MapComponents";
import Tile from "../../elements/Tile";
import TileXL from "../../elements/TileXL";

export default function Explore() {
  const [locationList, setLocationList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [initialLocationList, setInitialLocationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState([50, 10]);
  const [coords, setCoords] = useState([50, 10]);
  const [results, setResults] = useState([]);
  const [zoom, setZoom] = useState(12);

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
    <div className="wrapper-tile">
      <Tile>
        <AnimationLoading>
          <p>Getting data from the server...</p>
        </AnimationLoading>
      </Tile>
    </div>
  ) : (
    <div className="wrapper-tile">
      <TileXL>
        <h1 className="px-4">Discover invasive plant species near you</h1>

        <MapContainer
          className="border-mint/99 border-2 rounded-lg h-[80vh] m-4"
          id="exploremap"
          center={[54.06325355147857, 9.86409912109375]}
          zoom={5}
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
          <Search
            props={{
              setLocation,
              location,
              coords,
              results,
              setResults,
              zoom,
              setZoom,
            }}
          />
          <CenterAutomatically location={location} />
        </MapContainer>
      </TileXL>
    </div>
  );
}
