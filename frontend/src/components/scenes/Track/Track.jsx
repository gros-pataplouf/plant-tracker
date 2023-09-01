import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import Submit from "./Subcomponents/Submit";
import Map from "./Subcomponents/Map";

export default function Track() {
  const [location, setLocation] = useState([50, 10]);
  const [display, setDisplay] = useState("map");
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  useEffect(() => {
    if (!isLoggedIn) {
      window.alert("You need to be logged in to submit data.");
      return (window.location.href = `/login?${window.location.href
        .replaceAll("/", " ")
        .trim()
        .split(" ")
        .at(-1)}`);
    }
    axiosInstance.get("accounts/me/").catch((err) => {
      console.error(err);
      window.alert("You need to be logged in to submit data.");
      window.location.href = `#/login?${window.location.href
        .replaceAll("/", " ")
        .trim()
        .split(" ")
        .at(-1)}`;
    });
  }, [isLoggedIn]);

  if (display === "map") {
    return <Map props={{ location, setLocation, setDisplay }} />;
  } else {
    return <Submit props={{ location, setDisplay }} />;
  }
}
