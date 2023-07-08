import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { MapContainer, TileLayer } from "react-leaflet";
import locating from "../../../../assets/animations/location.json";
import { leafletLowZIndex } from "../../../../helpers/leafletHelpers";
import {
  CenterAutomatically,
  DynamicMarker,
  GoBackButton,
  Search,
} from "../../../elements/MapComponents";

function Animation() {
  return <Lottie animationData={locating} loop={true} />;
}

// the leaflet map
function Map({ props }) {
  const {
    location,
    setLocation,
    coords,
    results,
    setResults,
    isGeolocationEnabled,
  } = props;
  useEffect(() => {
    if (coords) {
      setLocation([coords.latitude, coords.longitude]);
    }
  }, [coords]);
  return (
    <MapContainer
      className="m-4 border-2 rounded-md border-mint/99"
      id="map"
      center={location}
      zoom={isGeolocationEnabled ? 16 : 5}
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
    <button className="block m-auto my-4 btn" onClick={clickHandler}>
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
      maximumAge: 240000,
    },
    userDecisionTimeout: 10000,
  });
  return !isGeolocationAvailable || !isGeolocationEnabled || coords ? (
    <div className="mt-4">
      <p className="px-4 text-3xl font-bold">
        Drag the map under the cursor or search an address.
      </p>
      <Map
        props={{
          location,
          setLocation,
          coords,
          results,
          setResults,
          isGeolocationEnabled,
        }}
      />
      <ContinueButton props={{ location, setDisplay }} />
    </div>
  ) : (
    <Animation />
  );
}
