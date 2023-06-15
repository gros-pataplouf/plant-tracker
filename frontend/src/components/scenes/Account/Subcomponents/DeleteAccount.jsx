import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import { handleModal } from "../../../elements/Modal";
import AnimationLoading from "../../../elements/AnimationLoading";

const classes = {
  dangerbutton: "btn bg-red-800 text-white",
  cancelbutton:
    "btn bg-yellow-50 text-emerald-950 border-solid border-2 border-emerald-800",
  dangertext: "text-red-800 font-bold",
  buttonwrapper: "flex space-4",
};

export default function DeleteAccount() {
  const [submitting, setSubmitting] = useState(false);

  function handleDelete() {
    setSubmitting(true);
    axiosInstance
      .delete("accounts/me/")
      .then((res) => {
        console.log(res);
        window.alert("Your account has been deleted.");
        localStorage.clear();
        window.location.href = "/";
      })
      .catch((err) => console.error(err));
  }

  return submitting ? (
    <AnimationLoading>
      <p>Your account is being deleted.</p>
    </AnimationLoading>
  ) : (
    <div>
      <form action="">
        <p className={classes.dangertext}>
          Are you sure you want to delete your account? This cannot be undone!
        </p>
        <div className={classes.buttonwrapper}>
          <button className={classes.dangerbutton} onClick={handleDelete}>
            Yes, I'm sure
          </button>
          <button
            className={classes.cancelbutton}
            name="closeModal"
            onClick={handleModal}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
