import { useState } from "react";
import info from "../../assets/icons/info.svg";
import visibility from "../../assets/icons/visibility.svg";
import visibility_off from "../../assets/icons/visibility_off.svg";
import { testMail, testPassword } from "../../helpers/checks";

const classes = {
  passwordWrapper:
    "flex relative [&>button]:absolute [&>button]:top-2 [&>button]:right-2",
  input: (err) => `grow ${err && "bg-red-100"}`,
  visibilitySvg: "h-6",
  tooltipIcon: "inline w-7 align-top",
  tooltipSpan: "relative",
  tooltipDiv:
    "absolute w-[80vw] bg-black top-4 p-4 border-spacing-2 border-2 rounded-3xl text-yellow-50 hidden m-4 leading-none z-20",
};

const checks = {
  notEmpty: (value) => {
    return value.length === 0 && "Empty field not allowed";
  },
  safePassword: (value) => {
    return (
      !testPassword(value) &&
      "Passwords must be at least 8 characters long with 1 upper case, 1 lower case letter."
    );
  },
  validEmail: (value) => {
    return !testMail(value) && "Not a valid email address.";
  },
  passwordsMatch: (value) => {
    return (
      document.querySelector("#password").value.trim() !==
        document.querySelector("#passwordConfirmation").value.trim() &&
      "Passwords must match."
    );
  },
};

export default function InputField({ props }) {
  const {
    label, //string,
    tooltip, // string
    id, //string for id, label, name
    placeholder, // string
    type, // string
    tests, //array of strings. "match", "not_empty", "safe", "email"
    setFormValid, //state variable, starts with false
  } = props;
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState(false);

  function handleChange(e) {
    setErr("");
    setFormValid(false);
    const value = e.target.closest(`#${id}`).value.trim();
    // run field level validations
    for (let _ in checks) {
      if (tests.includes(_) && checks[_](value)) {
        setErr(checks[_](value));
        return null;
      }
    }
    setFormValid(true);
  }

  function toggleTooltip(e) {
    const tooltip = e.target.nextElementSibling || e.target;
    tooltip.classList.toggle("hidden");
  }

  return (
    <>
      <label className={classes.label} htmlFor={id}>
        {label}
        {tooltip && err && (
          <span className={classes.errorSpan}>
            <span
              className={classes.tooltipSpan}
              onTouchStart={toggleTooltip}
              onClick={toggleTooltip}
            >
              <img className={classes.tooltipIcon} src={info} />
              <div className={classes.tooltipDiv} role="tooltip" id="tooltip">
                {err}
              </div>
            </span>
          </span>
        )}
      </label>

      <div className={classes.passwordWrapper}>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={id}
          className={classes.input(err)}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {/* the toggle visibility button is only used in fields of type password */}
        {type === "password" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector(`#${id}`)
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
        )}
      </div>
    </>
  );
}
