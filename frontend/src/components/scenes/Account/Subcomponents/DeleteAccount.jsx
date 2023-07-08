import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import AnimationLoading from "../../../elements/AnimationLoading";
import { handleModal } from "../../../elements/Modal";

const classes = {
  dangertext: "text-red-800 font-bold my-12",
  buttonwrapper: "flex",
};

export default function DeleteAccount() {
  const [submitting, setSubmitting] = useState(false);

  function handleDelete() {
    setSubmitting(true);
    axiosInstance
      .delete("accounts/me/")
      .then((res) => {
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
        <p className="my-8 font-bold text-red-800">
          Are you sure you want to delete your account? This cannot be undone!
        </p>
        <div className="flex">
          <button
            className="mr-4 text-white bg-red-800 rounded-lg btn"
            onClick={handleDelete}
          >
            Yes, I'm sure
          </button>
          <button
            className="text-red-800 border-2 border-red-800 border-solid rounded-lg btn bg-yellow-50"
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
