import Lottie from "lottie-react";
import loading from "../../assets/animations/dots-loading.json";
import { useState,  useLayoutEffect } from "react";

export default function AnimationLoading({ children }) {
  const [ animationHeight, setAnimationHeight ] = useState(0);
  useLayoutEffect(() => {
    if (window.innerWidth < 768) {
      setAnimationHeight("30vw");
    } else if (window.innerWidth < 1024) {
      setAnimationHeight("20vw");
    } else {
      setAnimationHeight("5vw");
    }
  }, [])
  return (
    <div className="flex flex-col items-center justify-center [&>p]:text-center text-emerald-950 m-auto [&>*]:font-bold [&>*]:text-3xl">
      {children}
      <Lottie animationData={loading} loop={true} style={{height: animationHeight}} />
    </div>
  );
}
