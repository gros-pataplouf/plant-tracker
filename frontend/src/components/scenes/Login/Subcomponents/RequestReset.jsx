import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import InputField from "../../../elements/InputField";
import { validateForm } from "../../../../helpers/checks";

const classes = {
  title: "py-8 font-bold",
  form: "flex flex-col ",
  btn: "btn my-8",
};

export default function RequestReset() {
  function getResetLink(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please check the data provided!")) {
      return null;
    };
    axiosInstance
      .post("accounts/reset/", document.querySelector("#getResetLink"))
      .then((res) => {
        console.log(res);

        if (location.search) {
          return (window.location.href = `/${location.search.slice(1)}`);
        } else {
          return (window.location.href = "/");
        }
      })
      .catch((error) => {
        console.error(error.response);
        setMessage("Error, please try again ⛔");
      });
  }
  return (
    <div>
      <h4 className={classes.title}>Request a password reset link</h4>
      <form className={classes.form} id="getResetLink" onSubmit={getResetLink}>
        <InputField
          props={{
            label: "Email",
            tooltip: true,
            id: "email",
            placeholder: "required",
            type: "text",
            tests: ["notEmpty", "validEmail"],
          }}
        />
        <button className={classes.btn} type="submit">
          Get Reset Link
        </button>
      </form>
    </div>
  );
}
