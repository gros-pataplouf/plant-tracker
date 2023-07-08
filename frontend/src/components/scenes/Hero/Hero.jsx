import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import plant from "../../../assets/animations/plant.json";
import Tile from "../../elements/Tile";

const classes = {
  loadingAnimation:
    "top-0 h-screen w-screen z-30 bg-emerald-950 flex flex-col justify-center",
  loadingTitle: "text-yellow-100 text-center loadingHero mb-10",
  image: "mx-auto h-20 mt-20",
  introList: "list-disc [&>li]:ml-6 space-y-6 mt-6 text-3xl",
  wrapper: "wrapper-tile"
};

function Animation() {
  const lottieRef = useRef();
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3);
    }
  }, []);
  //original size 500. height set 300vw to elimate unused space; viewbox zooms in, pushed down and pushed to right
  return (
    <Lottie
      animationData={plant}
      lottieRef={lottieRef}
      loop={false}
      rendererSettings={{ viewBoxSize: "150 220 170 80" }}
      style={{ height: "30vw" }}
    />
  );
}

export default function Hero() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return loading ? (
    <div className={classes.loadingAnimation}>
      <h2 className={classes.loadingTitle}>Planttracker App</h2>
      <h3 className={classes.loadingTitle}>A citizen science project</h3>
      <Animation />
    </div>
  ) : (
    <div className={classes.wrapper}>
    <Tile>
      <div>
        <h3>Welcome to the Planttracker App</h3>
        <ul className={classes.introList}>
          <li>
            Learn about invasive plant species and their impact on native
            ecosystems
          </li>
          <li>Discover the submissions of fellow users </li>
          <li>
            Become a citizen scientist and inventory invasive plant species by
            uploading data and photos through our live map.
          </li>
          <li>Help protectionists and scientists identify areas at risk </li>
          <li>Make your outdoor activities more fun </li>
        </ul>

        <p></p>
      </div>
    </Tile>
    </div>
  );
}
