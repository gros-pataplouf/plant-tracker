import { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import InputField from "../../elements/InputField";
import { Modal, handleModal } from "../../elements/Modal";
import RequestReset from "./Subcomponents/RequestReset";
import Tile from "../../elements/Tile";
import AnimationLoading from "../../elements/AnimationLoading";
import AnimationConfirm from "../../elements/AnimationConfirm";

const classes = {
  title: "py-8",
  form: "flex flex-col ",
  label: "mt-4 mb-2",
  btn: "btn my-8",
  success: "font-bold",
  failure: "font-bold text-red-800",
  info: "mt-4",
  link: "block pt-2 mr-10 text-emerald-900 font-bold active:decoration-solid",
};

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  const [message, setMessage] = useState();
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const [formValid, setFormValid] = useState(false);
  function submitHandler(e) {
    e.preventDefault();
    if (!formValid) {
      setMessage("Cannot submit empty form. ⛔");
      return null;
    }
    setSubmitting(true);

    axiosInstance
      .post("accounts/token/", document.querySelector("#loginForm"))
      .then((res) => {
        localStorage.setItem("planttrackerAccess", res.data.access);
        localStorage.setItem("planttrackerRefresh", res.data.refresh);
        setMessage("Login successful.");
        setSubmitting(false);
        setIsLoggedIn(true);
        if (location.search) {
          return (window.location.href = `#/${location.search.slice(1)}`);
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(error.response);
        setSubmitting(false);
        setMessage("Login unsuccessful ⛔");
      });
  }

  return (
    <Tile>
      {!submitting && !isLoggedIn && (
        <>
          {" "}
          <h3 className={classes.title}>Log in</h3>
          <form
            className={classes.form}
            id="loginForm"
            onSubmit={submitHandler}
          >
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
        </>
      )}

      {submitting && (
        <AnimationLoading>
          <p>Logging in...</p>
        </AnimationLoading>
      )}

      {!submitting && isLoggedIn && (
        <AnimationConfirm>
          <p className={classes.success}>
            {message || "You are already logged in."}
          </p>
        </AnimationConfirm>
      )}

      {!submitting && !isLoggedIn && (
        <div>
          <p className={classes.info}> Password forgotten? </p>
          <button
            className={classes.link}
            name="openModal"
            onClick={handleModal}
          >
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
      )}
    </Tile>
  );
}
