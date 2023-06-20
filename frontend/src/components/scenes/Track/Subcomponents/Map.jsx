import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { MapContainer, TileLayer } from "react-leaflet";
import { leafletLowZIndex } from "../../../../helpers/leafletHelpers";
import locating from "../../../../assets/animations/location.json";
import {
  CenterAutomatically,
  DynamicMarker,
  GoBackButton,
  Search,
} from "../../../elements/MapComponents";

const classes = {
  mapContainer: "border-mint/99 border-2 rounded-md m-4",
  btn: "btn my-4",
};

function Animation() {
  return <Lottie animationData={locating} loop={true} />;
}

// the leaflet map
function Map({ props }) {
  const { location, setLocation, coords, results, setResults, isGeolocationEnabled } = props;
  console.log(isGeolocationEnabled)
  useEffect(() => {
    if (coords) {
      setLocation([coords.latitude, coords.longitude]);
    }
  }, [coords]);
  return (
    <MapContainer
      className={classes.mapContainer}
      id="map"
      center={location}
      zoom={isGeolocationEnabled? 16 : 5}
      scrollWheelZoom={true}
      whenReady={leafletLowZIndex}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DynamicMarker props={{ location, setLocation }} />
      <CenterAutomatically location={location} />
      <GoBackButton props={{ coords, setResults, setLocation }} />
      <Search props={{ setLocation, location, coords, results, setResults }} />
    </MapContainer>
  );
}

function ContinueButton({ props }) {
  const { location, setDisplay } = props;
  function clickHandler() {
    setDisplay("form");
  }
  return (
    <button className={classes.btn} onClick={clickHandler}>
      Continue
    </button>
  );
}

export default function TrackMap({ props }) {
  const [results, setResults] = useState([]);
  const { location, setLocation, setDisplay } = props;
  const {
    coords,
    getPosition,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 240000
          
    },
    userDecisionTimeout: 10000,
  });
  return !isGeolocationAvailable || !isGeolocationEnabled || coords ? (
    <>
      <Map props={{ location, setLocation, coords, results, setResults, isGeolocationEnabled }} />
      <ContinueButton props={{ location, setDisplay }} />
    </>
  ) : (
    <Animation />
  );
}
