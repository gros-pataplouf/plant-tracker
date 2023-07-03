import { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import info from "../../../assets/icons/info.svg";
import visibility from "../../../assets/icons/visibility.svg";
import visibility_off from "../../../assets/icons/visibility_off.svg";
import axiosInstance from "../../../helpers/axios";
import { testPassword } from "../../../helpers/checks";

import InputField from "../../elements/InputField";
import Tile from "../../elements/Tile";
const classes = {
  title: "py-8",
  form: "flex flex-col ",
  input: "",
  label: "mt-4 mb-2",
  errorInput: "border-red-800 active:outline-red-800",
  errorSpan: "text-red-800 italic",
  tooltipIcon: "inline w-7 align-top",
  tooltipSpan: "relative",
  tooltipDiv:
    "absolute w-[80vw] bg-black top-4 p-4 border-spacing-2 border-2 rounded-3xl text-yellow-50 hidden m-4 leading-none z-10",
  btn: "btn my-8 w-content",
  success: "font-bold my-[50%]",
  failure: "font-bold text-red-800",
  link: "block pt-2 mr-10 text-emerald-900 font-bold active:decoration-solid",
};

export default function Reset() {
  let uuid = window.location.href.trim("/").split("?").at(-1);
  const [message, setMessage] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [incompleteErr, setIncompleteErr] = useState("");
  const [success, setSuccess] = useState(false);

  function validateForm() {}

  function submitHandler(e) {
    e.preventDefault();
    if (!formValid) {
      setMessage("Cannot submit empty or invalid form. ⛔");
      return null;
    }
    axiosInstance
      .put(`accounts/reset/${uuid}`, document.querySelector("#resetForm"))
      .then((res) => {
        setMessage("Your password has been reset ✅");
        setTimeout(() => {
          window.location.href = "#/login/";
        }, 5000);
      })
      .catch((error) => {
        console.error(error.response);
        setMessage("Invalid reset link ⛔");
      });
  }
  return (
    <Tile>
      <h3 className={classes.title}>Password reset ✍️</h3>
      {!success && (
        <form
          className={classes.form}
          id="resetForm"
          onSubmit={submitHandler}
          onChange={validateForm}
        >
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
            Save
          </button>
          <p className={classes.errorSpan}>{incompleteErr}</p>
        </form>
      )}
      <div>
        <p className={classes.failure}>{message}</p>

        <p className={classes.info}> Want to login? </p>
        <Link className={classes.link} to="/login">
          {" "}
          👉 Login page
        </Link>
        <p className={classes.info}>No account yet?</p>
        <Link className={classes.link} to="/register">
          {" "}
          👉 Register
        </Link>
      </div>
    </Tile>
  );
}
