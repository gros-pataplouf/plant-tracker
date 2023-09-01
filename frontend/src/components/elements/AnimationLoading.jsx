import Lottie from "lottie-react";
import loading from "../../assets/animations/dots-loading.json";
import { useState, useLayoutEffect } from "react";

export default function AnimationLoading({ children }) {
  const [animationHeight, setAnimationHeight] = useState(0);
  useLayoutEffect(() => {
    if (window.innerHeight < 768) {
      setAnimationHeight("15vh");
    } else if (window.innerHeight < 1024) {
      setAnimationHeight("10vh");
    } else {
      setAnimationHeight("8vh");
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center [&>p]:text-center text-emerald-950 m-auto [&>*]:font-bold [&>*]:text-3xl">
      {children}
      <Lottie
        animationData={loading}
        loop={true}
        style={{ height: animationHeight }}
      />
    </div>
  );
}
