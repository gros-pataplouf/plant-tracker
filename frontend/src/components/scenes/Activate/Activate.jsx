import axiosInstance from "../../../helpers/axios";
import { useState } from "react";
import TileXL from "../../elements/TileXL";
import AnimationLoading from "../../elements/AnimationLoading";

const classes = {
  message: "font-bold text-3xl self-center",
};

export default function Activate() {
  let activationToken = window.location.href.trim("/").split("?").at(-1);
  const [message, setMessage] = useState("");
  axiosInstance
    .get(`accounts/activate/${activationToken}`)
    .then((res) => {
      if (res.status === 204) {
        setMessage("Your account has been activated, please log in.");
        return (window.location.href = "#/login/");
      }
    })
    .catch((err) => {
      setMessage(
        "Oh no! An error has occured. Please request another activation token."
      );
    });

  return (
    <>
      <Tile>
        {!message && (
          <AnimationLoading>
            <p>Activating</p>
          </AnimationLoading>
        )}
        <p className={classes.message}>{message && message}</p>
      </Tile>
    </>
  );
}
