import axiosInstance from "../../../../helpers/axios";
import { validateForm } from "../../../../helpers/checks";
import InputField from "../../../elements/InputField";

export default function RequestReset() {
  function getResetLink(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please check the data provided!")) {
      return null;
    }
    axiosInstance
      .post("accounts/reset/", document.querySelector("#getResetLink"))
      .then((res) => {
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
      <h4 className="py-8 font-bold">Request a password reset link</h4>
      <form className="flex flex-col" id="getResetLink" onSubmit={getResetLink}>
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
        <button className="my-8 btn" type="submit">
          Get Reset Link
        </button>
      </form>
    </div>
  );
}
