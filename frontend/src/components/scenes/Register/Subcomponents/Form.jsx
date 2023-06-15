import { useState } from "react";
import info from "../../../../assets/icons/info.svg";
import visibility from "../../../assets/icons/visibility.svg";
import visibility_off from "../../../../assets/icons/visibility_off.svg";
import axiosInstance from "../../../helpers/axios";
import { testMail, testPassword } from "../../../helpers/checks";
import Form from "./Subcomponents/Form";

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

export default function Form() {
  return (
    <form
      className={classes.form}
      id="registrationForm"
      onSubmit={submitHandler}
      onChange={validateForm}
    >
      <label className={classes.label} htmlFor="email">
        Email<span className={classes.errorSpan}> {emailErr}</span>
      </label>
      <input
        name="email"
        type="email"
        id="email"
        autoComplete="email"
        className={emailErr ? classes.errorInput : "undefined"}
        placeholder="required"
      />
      <label className={classes.label} htmlFor="username">
        Username
      </label>
      <input
        name="username"
        type="text"
        id="username"
        autoComplete="username"
        placeholder="required"
      />
      <label className={classes.label} htmlFor="password">
        Password{" "}
        {pwdErr && (
          <span className={classes.errorSpan}>
            {pwdErr}
            <span
              className={classes.tooltipSpan}
              onClick={() => {
                const tooltip = document.querySelector("#tooltip");
                tooltip.classList.toggle("hidden");
              }}
            >
              <img className={classes.tooltipIcon} src={info} />
              <div className={classes.tooltipDiv} id="tooltip">
                Passwords must be at least 8 characters long with 1 upper case,
                1 lower case letter, 1 number and 1 special character.
              </div>
            </span>
          </span>
        )}
      </label>
      <div className={classes.passwordWrapper}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="password"
          placeholder="required"
          className={pwdErr ? "border-red-800" : undefined}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector("#password")
              .setAttribute("type", showPwd ? "password" : "text");
            setShowPwd(!showPwd);
          }}
        >
          <img
            className={classes.visibilitySvg}
            src={showPwd ? visibility : visibility_off}
            alt=""
          />
        </button>
      </div>

      <label className={classes.label} htmlFor="passwordConfirmation">
        Confirm password <span className={classes.errorSpan}>{pwdConfErr}</span>
      </label>
      <div className={classes.passwordWrapper}>
        <input
          name="passwordConfirmation"
          id="passwordConfirmation"
          type="password"
          placeholder="required"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector("#passwordConfirmation")
              .setAttribute("type", showPwdConf ? "password" : "text");
            setShowPwdConf(!showPwdConf);
          }}
        >
          <img
            className={classes.visibilitySvg}
            src={showPwdConf ? visibility : visibility_off}
            alt=""
          />
        </button>
      </div>

      <button className={classes.btn} type="submit">
        Create account
      </button>
      <p className={classes.errorSpan}>{incompleteErr}</p>
    </form>
  );
}
