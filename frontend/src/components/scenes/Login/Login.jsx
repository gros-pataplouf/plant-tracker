import { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import axiosInstance from "../../../helpers/axios";
import { validateForm } from "../../../helpers/checks";
import AnimationConfirm from "../../elements/AnimationConfirm";
import AnimationLoading from "../../elements/AnimationLoading";
import InputField from "../../elements/InputField";
import { Modal, handleModal } from "../../elements/Modal";
import Tile from "../../elements/Tile";
import RequestReset from "./Subcomponents/RequestReset";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  const [message, setMessage] = useState();
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  function submitHandler(e) {
    e.preventDefault();
    if (!validateForm(e, "Invalid form, please check the data provided!")) {
      setMessage("Cannot submit empty or invalid form. ⛔");
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
    <div className="wrapper-tile">
      <Tile>
        {!submitting && !isLoggedIn && (
          <>
            {" "}
            <h1 className="my-8">Log in</h1>
            <form
              className="flex flex-col"
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
                }}
              />
            <p className="py-2 font-bold text-red-800 text-3xl text-center">
              {message && message}
            </p>
              <button className="my-8 btn" type="submit">
                Submit
              </button>
            </form>
          </>
        )}

        {submitting && (
          <AnimationLoading>
            <p className="py-8 font-bold">Logging in...</p>
          </AnimationLoading>
        )}

        {!submitting && isLoggedIn && (
          <AnimationConfirm className="md:h-[1vw]">
            <p className="py-8 font-bold">
              {message || "You are already logged in."}
            </p>
          </AnimationConfirm>
        )}

        {!submitting && !isLoggedIn && (
          <div>

            <p className="mt-4"> Password forgotten? </p>
            <button
              className="block pt-2 mr-10 font-bold text-emerald-900 active:decoration-solid"
              name="openModal"
              onClick={handleModal}
            >
              👉 Reset password
            </button>

            <Modal>
              <RequestReset />
            </Modal>

            <p className="mt-4">No account yet?</p>
            <Link
              className="block pt-2 mr-10 font-bold text-emerald-900 active:decoration-solid"
              to="/register"
            >
              👉 Register
            </Link>
          </div>
        )}
      </Tile>
    </div>
  );
}
