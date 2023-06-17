import { useState } from "react";
import axiosInstance from "../../../helpers/axios";
import InputField from "../../elements/InputField";
import AnimationLoading from "../../elements/AnimationLoading";

const classes = {
  wrapper:
    "flex flex-col justify-between m-auto p-8 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4 bg-white",
  title: "py-8",
  form: "flex flex-col ",
  btn: "btn my-8",
  success: "font-bold my-[50%]",
  failure: "font-bold",
};

export default function Register() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formData = new FormData();

  function submitHandler(e) {
    e.preventDefault();
    if (!formValid) {
      return window.alert("Invalid form, please check the data provided!");
    }
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
        setFormValid(false);
      });
  }
  return (
    <div className={classes.wrapper}>
      <h3 className={classes.title}>Sign up and contribute 💚</h3>
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
              setFormValid,
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
              setFormValid,
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
              setFormValid,
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
              setFormValid,
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
    </div>
  );
}
