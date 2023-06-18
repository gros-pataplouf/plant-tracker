import axiosInstance from "../../helpers/axios";
import Lottie from "lottie-react";
import spinner from "../../assets/animations/spinner.json";
import { useState, useEffect } from "react";
const classes = {
  wrapper: "pt-2 bg-emerald-950 h-[2.5rem] px-6 max-h-[8vh] min-h-[4vh]",
  button:
    "text-yellow-50 font-bold rounded-lg active:underline hover:underline decoration-2",
};

export default function Logout({ props }) {
  const { isLoggedIn, setIsLoggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [lottieSize, setLottieSize] = useState(null);
  useEffect(() => {
    setLottieSize(
      document.getElementById("lottieContainer").getBoundingClientRect()
        .height * 0.95
    );
  }, []);

  function logOutHandler(e) {
    setLoading(true);
    axiosInstance
      .post("accounts/token/blacklist/", {
        refresh: localStorage.getItem("planttrackerRefresh"),
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        localStorage.removeItem("planttrackerAccess");
        localStorage.removeItem("planttrackerRefresh");
        setIsLoggedIn(false);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("planttrackerAccess");
        localStorage.removeItem("planttrackerRefresh");
        setIsLoggedIn(false);
        setLoading(false);
        window.location.href = "/";
      });
  }

  return (
    <div id="lottieContainer" className={classes.wrapper}>
      {loading ? (
        <Lottie
          animationData={spinner}
          loop={true}
          style={{ height: lottieSize, width: lottieSize }}
        />
      ) : (
        <button className={classes.button} onClick={logOutHandler}>
          Log out
        </button>
      )}
    </div>
  );
}
