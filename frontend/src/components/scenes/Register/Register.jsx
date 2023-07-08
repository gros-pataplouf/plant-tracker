import { useState } from "react";
import axiosInstance from "../../../helpers/axios";
import InputField from "../../elements/InputField";
import AnimationLoading from "../../elements/AnimationLoading";
import { validateForm } from "../../../helpers/checks";
import Tile from "../../elements/Tile";
import TileXL from "../../elements/TileXL";

const classes = {
  wrapper: "wrapper-tile",
  title: "text-4xl text-center mb-12",
  form: "flex flex-col ",
  btn: "btn my-8",
  success: "font-bold my-20",
  failure: "font-bold",
};

export default function Register() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formData = new FormData();

  function submitHandler(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please check the data provided!")) {
      return setMessage("Cannot submit empty or invalid form.")
    };
    setSubmitting(true);
    formData.append("email", document.getElementById("email").value.trim());
    formData.append(
      "username",
      document.getElementById("username").value.trim()
    );
    formData.append(
      "password",
      document.getElementById("password").value.trim()
    );
    axiosInstance
      .post("accounts/users/", document.querySelector("#registrationForm"), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setSubmitting(false);
        setMessage(res.data.success);
        setSuccess(true);
      })
      .catch((error) => {
        console.error(error.response);
        setSubmitting(false);
        setMessage(Object.values(error.response.data).join(" "));
      });
  }
  return (
    <div className={classes.wrapper}>
    <Tile>
      <h1 className={classes.title}>Sign up and contribute 💚</h1>
      {!success && !submitting && (
        <form
          className={classes.form}
          id="registrationForm"
          onSubmit={submitHandler}
          onChange={() => {
            setMessage("");
          }}
        >
          <InputField
            props={{
              label: "Email",
              tooltip: true,
              id: "email",
              placeholder: "required",
              type: "text",
              tests: ["validEmail", "notEmpty"],
            }}
          />
          <InputField
            props={{
              label: "Username",
              tooltip: false,
              id: "username",
              placeholder: "required",
              type: "text",
              tests: [],
            }}
          />
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

          <button className={classes.btn} type="submit">
            Create account
          </button>
        </form>
      )}
      {submitting && (
        <AnimationLoading>
          <p>Submitting...</p>
        </AnimationLoading>
      )}
      {success ? (
        <p className={success ? classes.success : classes.errorSpan}>
          ✅ {message}
        </p>
      ) : (
        message && <p className={classes.failure}>⚠️ {message}</p>
      )}
    </Tile>
    </div>
  );
}
