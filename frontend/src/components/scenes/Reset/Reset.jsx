import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import InputField from "../../elements/InputField";
import Tile from "../../elements/Tile";
import { validateForm } from "../../../helpers/checks";

const classes = {
  btn: "btn my-8 w-content",
  failure: "font-bold text-red-800",
  link: "block pt-2 mr-10 text-emerald-900 font-bold active:decoration-solid",
};

export default function Reset() {
  let uuid = window.location.href.trim("/").split("?").at(-1);
  const [message, setMessage] = useState("");
  const [incompleteErr, setIncompleteErr] = useState("");
  const [success, setSuccess] = useState(false);

  function submitHandler(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please check the data provided!")) {
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
    <div className="wrapper-tile">
      <Tile>
        <h3 className="py-8">Password reset ✍️</h3>
        {!success && (
          <form
            className="flex flex-col"
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

            <button className="my-8 btn w-content" type="submit">
              Save
            </button>
            <p className={classes.errorSpan}>{incompleteErr}</p>
          </form>
        )}
        <div>
          <p className="font-bold text-red-800">{message}</p>

          <p className="mt-4"> Want to login? </p>
          <Link
            className="block pt-2 mr-10 font-bold text-emerald-900 active:decoration-solid"
            to="/login"
          >
            {" "}
            👉 Login page
          </Link>
          <p className="mt-4">No account yet?</p>
          <Link
            className="block pt-2 mr-10 font-bold text-emerald-900 active:decoration-solid"
            to="/register"
          >
            {" "}
            👉 Register
          </Link>
        </div>
      </Tile>
    </div>
  );
}
