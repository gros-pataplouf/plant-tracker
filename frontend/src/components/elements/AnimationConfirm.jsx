import Lottie from "lottie-react";
import confirm from "../../assets/animations/confirm.json";

const classes = {
  loadingContainer: "flex flex-col items-center justify-center text-emerald-950 m-auto"
}

// rendererSettings={{viewBoxSize: "150 220 170 80"}}
export default function Confirmation({children}) {
    return <div className={classes.loadingContainer}>
        {children}
        <Lottie animationData={confirm} loop={false} style={{height: "15vw"}} />

    </div>
}