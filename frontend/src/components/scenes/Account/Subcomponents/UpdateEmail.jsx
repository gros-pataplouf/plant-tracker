import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import { handleModal } from "../../../elements/Modal";
import AnimationLoading from "../../../elements/AnimationLoading";
import AnimationConfirm from "../../../elements/AnimationConfirm";
import InputField from "../../../elements/InputField";
import { validateForm } from "../../../../helpers/checks";

const classes = {
  button: "btn rounded-lg first:mr-4",
  form: "flex flex-col",
  message: "text-red-800",
  buttonwrapper: "flex space-4",
  confirmModal: "flex flex-col",
};

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
    };
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
          className={classes.form}
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
          {message && <p className={classes.message}>
            {message} </p>}
          <div className={classes.buttonwrapper}>
            <button className={classes.button} value="default">
              Ok
            </button>
            <button
              className={classes.button}
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
        <div className={classes.confirmModal}>
          <AnimationConfirm>
            <h4>Succes!</h4>
          </AnimationConfirm>
          <button
            className={classes.button}
            name="closeModal"
            onClick={handleModal}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
