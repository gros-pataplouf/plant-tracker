import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import { validateForm } from "../../../../helpers/checks";
import AnimationConfirm from "../../../elements/AnimationConfirm";
import AnimationLoading from "../../../elements/AnimationLoading";
import InputField from "../../../elements/InputField";
import { handleModal } from "../../../elements/Modal";

const passwordFormData = new FormData();

export default function ChangePassword() {
  const [errMessage, setErrMessage] = useState("");
  const [submitting, setSubmitting] = useState("");
  const [success, setSuccess] = useState(false);

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please provide a valid password!")) {
      return null;
    }
    setSubmitting(true);
    passwordFormData.append(
      "password",
      document.querySelector("#password").value.trim()
    );
    axiosInstance
      .patch("accounts/me/", passwordFormData)
      .then((res) => {
        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          const currentModal = document.querySelector("dialog[open]");
          if (currentModal) {
            currentModal.close();
          }
          setSuccess(false);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        window.alert(err.data.password);
      });
  }

  return (
    <div>
      {!submitting && !success && (
        <div>
          <form
            className="flex flex-col"
            action=""
            id="passwordForm"
            onSubmit={handlePasswordSubmit}
          >
            <InputField
              props={{
                label: "New password",
                tooltip: true,
                id: "password",
                placeholder: "required",
                type: "password",
                tests: ["safePassword", "notEmpty"],
              }}
            />
            <InputField
              props={{
                label: "Confirm password",
                tooltip: true,
                id: "passwordConfirmation",
                placeholder: "required",
                type: "password",
                tests: ["passwordsMatch", "notEmpty"],
              }}
            />

            <div className="flex space-4">
              <button className="mr-4 rounded-lg btn">Ok</button>
              <button
                className="rounded-lg btn"
                name="closeModal"
                onClick={handleModal}
              >
                Cancel
              </button>
            </div>
          </form>
          {errMessage && <p> {errMessage} </p>}
        </div>
      )}
      {submitting && (
        <AnimationLoading>
          <p>Submitting</p>
        </AnimationLoading>
      )}
      {success && (
        <AnimationConfirm>
          <p>Password updated!</p>
        </AnimationConfirm>
      )}
    </div>
  );
}
