import { useState } from "react";
import info from "../../../assets/icons/info.svg";
import visibility from "../../../assets/icons/visibility.svg";
import visibility_off from "../../../assets/icons/visibility_off.svg";
import axiosInstance from "../../../helpers/axios";
import { testMail, testPassword } from "../../../helpers/checks";

const classes = {
  wrapper:
    "flex flex-col justify-between m-auto p-8 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4 bg-white",
  title: "py-8",
  form: "flex flex-col ",
  input: "",
  label: "mt-4 mb-2",
  errorInput: "border-red-800 active:outline-red-800",
  errorSpan: "text-red-800 italic",
  tooltipIcon: "inline w-7 align-top",
  tooltipSpan: "relative",
  tooltipDiv:
    "absolute w-[80vw] bg-black top-4 p-4 border-spacing-2 border-2 rounded-3xl text-yellow-50 hidden m-4 leading-none z-20",
  btn: "btn my-8",
  success: "font-bold my-[50%]",
  failure: "font-bold",
  passwordWrapper:
    "flex relative [&>button]:absolute [&>button]:top-2 [&>button]:right-2 [&>input]:grow",
  visibilitySvg: "h-6",
};

export default function Register() {
  const [emailErr, setEmailErr] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [incompleteErr, setIncompleteErr] = useState("");
  const [pwdConfErr, setPwdConfErr] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdConf, setShowPwdConf] = useState(false);
  const formData = new FormData();

  function validateForm() {
    setEmailErr("");
    setIncompleteErr("");
    setPwdErr("");
    setPwdConfErr("");

    let email = document.getElementById("email").value.trim();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let passwordConfirmation = document
      .getElementById("passwordConfirmation")
      .value.trim();

    /// check for empty fields

    if (!email || !username || !password || !passwordConfirmation) {
      setIncompleteErr("Please fill out all required fields.");
    }

    if (email && !testMail(email)) {
      setEmailErr("Invalid email.");
    }

    if (password && password !== passwordConfirmation) {
      setPwdConfErr("Passwords must match.");
    }

    if (password && !testPassword(password)) {
      setPwdErr("Invalid password. ");
    }
  }
  function submitHandler(e) {
    e.preventDefault();
    // if (emailErr || pwdErr || incompleteErr ) {
    //   return window.alert('Invalid form, please check the data provided!')
    // }
    formData.append("email", document.getElementById("email").value);
    formData.append("username", document.getElementById("username").value);
    formData.append("password", document.getElementById("password").value);
    formData.append(
      "passwordConfirmation",
      document.getElementById("passwordConfirmation").value
    );

    axiosInstance
      .post("accounts/users/", document.querySelector("#registrationForm"), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setMessage(res.data);
        setSuccess(true);
      })
      .catch((error) => {
        console.error(error);
        // setMessage(error.response.data)
      });
  }
  return (
    <div className={classes.wrapper}>
      <h3 className={classes.title}>Sign up and contribute 💚</h3>
      {!success && <div></div>}
      {success ? (
        <p className={success ? classes.success : classes.errorSpan}>
          ✅ {message.success}
        </p>
      ) : (
        message && <p className={classes.failure}>⚠️ {message}</p>
      )}
    </div>
  );
}
