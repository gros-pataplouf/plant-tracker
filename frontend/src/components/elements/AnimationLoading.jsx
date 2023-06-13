import Lottie from "lottie-react";
import loading from "../../assets/animations/dots-loading.json";

const classes = {
  loadingContainer: "flex flex-col items-center justify-center text-emerald-950 m-auto"
}

export default function AnimationLoading({children}) {

  return (

    <div className={classes.loadingContainer}>
    {children}
    <Lottie animationData={loading} loop={true} />
    </div>
  )
  }

