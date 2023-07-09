import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import spinner from "../../assets/animations/spinner.json";
import axiosInstance from "../../helpers/axios";

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
        localStorage.removeItem("planttrackerAccess");
        localStorage.removeItem("planttrackerRefresh");
        setIsLoggedIn(false);
        window.location.href = "#/login/";
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("planttrackerAccess");
        localStorage.removeItem("planttrackerRefresh");
        setIsLoggedIn(false);
        setLoading(false);
        window.alert(
          "An error has occured logging you out. Please refresh the page and try again if you are still logged in."
        );
      });
  }

  return (
    <div
      id="lottieContainer"
      className="pt-2 bg-emerald-950 h-[2.5rem] px-6 max-h-[8vh] min-h-[4vh]"
    >
      {loading ? (
        <Lottie
          animationData={spinner}
          loop={true}
          style={{ height: lottieSize, width: lottieSize }}
        />
      ) : (
        <button
          className="font-bold rounded-lg md:text-3xl text-yellow-50 active:underline hover:underline decoration-2"
          onClick={logOutHandler}
        >
          Log out
        </button>
      )}
    </div>
  );
}
