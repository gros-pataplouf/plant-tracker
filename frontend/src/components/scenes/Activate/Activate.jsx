import { useState } from "react";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import Tile from "../../elements/Tile";

export default function Activate() {
  let activationToken = window.location.href.trim("/").split("?").at(-1);
  const [message, setMessage] = useState(null);
  axiosInstance
    .get(`accounts/activate/${activationToken}`)
    .then((res) => {
      if (res.status === 204) {
        setMessage("Your account has been activated, please log in.");
        return (window.location.href = "/login/");
      }
    })
    .catch((err) => {
      setMessage(
        "Oh no! An error has occured. Please request another activation token."
      );
    });

  return (
    <div className="wrapper-tile">
      <Tile>
        {!message && (
          <AnimationLoading>
            <p>Activating</p>
          </AnimationLoading>
        )}
        <p className="self-center text-3xl font-bold">{message && message}</p>
      </Tile>
    </div>
  );
}
