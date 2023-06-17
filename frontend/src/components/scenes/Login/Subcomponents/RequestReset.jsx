import { useState } from "react";
import axiosInstance from "../../../../helpers/axios";
import InputField from "../../../elements/InputField";

const classes = {
  title: "py-8",
  form: "flex flex-col ",
  btn: "btn my-8",
};

export default function RequestReset() {
  const [formValid, setFormValid] = useState(false);
  function getResetLink(e) {
    e.preventDefault();
    console.log(document.querySelector("input#email").value);
    if (!formValid) {
      return window.alert("Cannot submit empty or invalid form. ⛔");
    }

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
      <h3 className={classes.title}>Request a password reset link</h3>
      <form className={classes.form} id="getResetLink" onSubmit={getResetLink}>
        <InputField
          props={{
            label: "Email",
            tooltip: true,
            id: "email",
            placeholder: "required",
            type: "text",
            tests: ["notEmpty", "validEmail"],
            setFormValid,
          }}
        />
        <button className={classes.btn} type="submit">
          Get Reset Link
        </button>
      </form>
    </div>
  );
}
