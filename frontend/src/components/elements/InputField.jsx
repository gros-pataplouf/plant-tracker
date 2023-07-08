import { useState } from "react";
import info from "../../assets/icons/info.svg";
import visibility from "../../assets/icons/visibility.svg";
import visibility_off from "../../assets/icons/visibility_off.svg";
import { testMail, testPassword } from "../../helpers/checks";

const dynamicClasses = {
  input: (err) => `grow mb-4 h-16 text-2xl ${err && "bg-red-100"}`,
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
  } = props;
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState(false);

  function handleChange(e) {
    setErr("");
    const currentField = e.target.closest(`#${id}`);
    const value = e.target.closest(`#${id}`).value.trim();
    currentField.removeAttribute("invalid");
    // run field level validations
    for (let _ in checks) {
      if (tests.includes(_) && checks[_](value)) {
        setErr(checks[_](value));
        currentField.setAttribute("invalid", "");
        return null;
      }
    }
  }

  function toggleTooltip(e) {
    // discarding all open tooltips by clicking anywhere is defined on App.jsx
    e.stopPropagation();
    if (
      e.target.nextElementSibling &&
      e.target.nextElementSibling.getAttribute("role") === "tooltip"
    ) {
      e.target.nextElementSibling.classList.toggle("hidden");
    }
  }
  return (
    <>
      <label className="relative mb-2 text-3xl" htmlFor={id}>
        {label}
        {tooltip && err && (
          <span className="ml-2">
            <span onTouchStart={toggleTooltip} onClick={toggleTooltip}>
              <img className="inline w-8 align-top" src={info} />
              <div
                className="js__tooltip hidden absolute w-[80vw] bg-black -top-24 m-auto p-6 -translate-x-2/4 left-2/4 border-spacing-2 border-2 rounded-lg text-yellow-50 leading-none z-20"
                role="tooltip"
              >
                <div>
                  <p>{err}</p>
                  <div className="absolute z-50 m-auto -translate-x-2/4 translate-y-4 left-2/4 w-0 h-0 border-t-[20px] border-t-black border-x-[20px] border-x-transparent border-solid"></div>
                </div>
              </div>
            </span>
          </span>
        )}
      </label>

      <div className="relative flex">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={id}
          className={dynamicClasses.input(err)}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {/* the toggle visibility button is only used in fields of type password */}
        {type === "password" && (
          <button
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector(`#${id}`)
                .setAttribute("type", showPwd ? "password" : "text");
              setShowPwd(!showPwd);
            }}
          >
            <img
              className="w-8"
              src={showPwd ? visibility : visibility_off}
              alt=""
            />
          </button>
        )}
      </div>
    </>
  );
}
