import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import { validateForm } from "../../../../helpers/checks";
import AnimationConfirm from "../../../elements/AnimationConfirm";
import AnimationLoading from "../../../elements/AnimationLoading";
import InputField from "../../../elements/InputField";
import { handleModal } from "../../../elements/Modal";

export default function UpdateEmail({ props }) {
  const { changes, setChanges } = props;
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailFormData = new FormData();

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please check the data provided!")) {
      return null;
    }
    emailFormData.append(
      "email",
      document.querySelector("input#email").value.trim()
    );
    setSubmitting(true);
    axiosInstance
      .patch("accounts/me/", {
        email: document.querySelector("input#email").value.trim(),
      })
      .then((res) => {
        setSubmitting(false);
        setSuccess(true);
        setChanges("email");
        setTimeout(() => {
          const currentModal = document.querySelector("dialog[open]");
          if (currentModal) {
            currentModal.close();
          }
          setSuccess(false);
        }, 3000);
      })
      .catch((err) => {
        setSubmitting(false);
        setSuccess(false);
        setMessage(err.response.data.email);
      });
  }

  return (
    <div>
      {!submitting && !success && (
        <form
          className="flex flex-col"
          action=""
          id="emailForm"
          onSubmit={handleEmailSubmit}
        >
          <div onClick={handleModal}>
            <img src="" alt="" />
          </div>
          <InputField
            props={{
              label: "New email",
              tooltip: true,
              id: "email",
              placeholder: "required",
              tests: ["validEmail", "notEmpty"],
            }}
          />
          {message && <p className="text-red-800">{message} </p>}
          <div className="flex space-4">
            <button className="mr-4 rounded-lg btn" value="default">
              Ok
            </button>
            <button
              className="rounded-lg btn"
              value="cancel"
              name="closeModal"
              formMethod="dialog"
              onClick={handleModal}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {submitting && (
        <AnimationLoading>
          <h4>Submitting...</h4>
        </AnimationLoading>
      )}
      {success && (
        <div className="flex flex-col">
          <AnimationConfirm>
            <h4>Succes!</h4>
          </AnimationConfirm>
          <button className="btn" name="closeModal" onClick={handleModal}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
