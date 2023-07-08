import Lottie from "lottie-react";
import loading from "../../assets/animations/dots-loading.json";

export default function AnimationLoading({ children }) {
  return (
    <div className="flex flex-col items-center justify-center text-emerald-950 m-auto [&>*]:font-bold [&>*]:text-3xl">
      {children}
      <Lottie animationData={loading} loop={true} />
    </div>
  );
}
