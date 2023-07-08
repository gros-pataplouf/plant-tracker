import Lottie from "lottie-react";
import confirm from "../../assets/animations/confirm.json";

export default function Confirmation({ children }) {
  return (
    <div className="flex flex-col items-center justify-center m-auto text-emerald-950">
      {children}
      <Lottie animationData={confirm} loop={false} style={{ height: "15vw" }} />
    </div>
  );
}
