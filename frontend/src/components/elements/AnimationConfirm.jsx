import Lottie from "lottie-react";
import confirm from "../../assets/animations/confirm.json";
import { useState, useLayoutEffect } from "react";

export default function Confirmation({ children }) {
  const [animationHeight, setAnimationHeight] = useState(0);
  useLayoutEffect(() => {
    if (window.innerWidth < 768) {
      setAnimationHeight("15vh");
    } else {
      setAnimationHeight("10vh");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center m-auto text-emerald-950">
      {children}
      <Lottie
        animationData={confirm}
        loop={false}
        style={{ height: animationHeight }}
      />
    </div>
  );
}
