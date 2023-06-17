import { useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import Submit from "./Subcomponents/Submit";
import Map from "./Subcomponents/Map";

export default function Track() {
  const [location, setLocation] = useState([50, 10]);
  const [display, setDisplay] = useState("map");
  useEffect(() => {
    axiosInstance
      .get("accounts/me/")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
        window.alert("You need to be logged in to submit data.");
        window.location.href = `#/login?${window.location.href
          .split("/")
          .at(-1)}`;
      });
  }, []);

  if (display === "map") {
    return <Map props={{ location, setLocation, setDisplay }} />;
  } else if (display === "form") {
    return <Submit props={{ location, setDisplay }} />;
  } else if (display === "success") {
    return (
      <div>
        <p>Thanks for submitting your data ✅</p>
        <p>
          View submission:
          <Link to></Link>
        </p>
      </div>
    );
  }
}
