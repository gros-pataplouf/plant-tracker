import { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import InputField from "../../elements/InputField";
import { Modal, handleModal } from "../../elements/Modal";
import RequestReset from "./Subcomponents/RequestReset";
import Tile from "../../elements/Tile";
const classes = {
  title: "py-8",
  form: "flex flex-col ",
  label: "mt-4 mb-2",
  btn: "btn my-8",
  success: "font-bold my-[50%]",
  failure: "font-bold text-red-800",
  info: "mt-4",
  link: "block pt-2 mr-10 text-emerald-900 font-bold active:decoration-solid",
};

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  const [message, setMessage] = useState();
  const location = useLocation();
  const [formValid, setFormValid] = useState(false);
  function submitHandler(e) {
    e.preventDefault();
    if (!formValid) {
      setMessage("Cannot submit empty form. ⛔");
      return null;
    }

    axiosInstance
      .post("accounts/token/", document.querySelector("#loginForm"))
      .then((res) => {
        localStorage.setItem("planttrackerAccess", res.data.access);
        localStorage.setItem("planttrackerRefresh", res.data.refresh);
        setIsLoggedIn(true);
        setMessage("Login successful ✅");
        if (location.search) {
          return (window.location.href = `#/${location.search.slice(1)}`);
        } else {
          return (window.location.href = "/");
        }
      })
      .catch((error) => {
        console.error(error.response);
        setMessage("Login unsuccessful ⛔");
      });
  }

  return (
    <Tile>
      <h3 className={classes.title}>Log in</h3>
      <form className={classes.form} id="loginForm" onSubmit={submitHandler}>
        <InputField
          props={{
            label: "Username",
            tooltip: false,
            id: "username",
            placeholder: "required",
            type: "text",
            tests: ["notEmpty"],
            setFormValid,
          }}
        />

        <InputField
          props={{
            label: "Password",
            tooltip: true,
            id: "password",
            placeholder: "required",
            type: "password",
            tests: ["notEmpty"],
            setFormValid,
          }}
        />

        <button className={classes.btn} type="submit">
          Submit
        </button>
      </form>
      <div>
        <p className={classes.failure}>{message}</p>

        <p className={classes.info}> Password forgotten? </p>
        <button className={classes.link} name="openModal" onClick={handleModal}>
          {" "}
          👉 Reset password
        </button>

        <Modal>
          <RequestReset />
        </Modal>

        <p className={classes.info}>No account yet?</p>
        <Link className={classes.link} to="/register">
          {" "}
          👉 Register
        </Link>
      </div>
    </Tile>
  );
}
