import React, { useState, useEffect } from "react";
import AlertMessage from "./AlertMessage";
import { useDispatch } from "react-redux";
import getErrorMsg from "../utils/getErrorMsg";
import { signupUser, loginUser } from "../reducers/userReducer";
import { notify } from "../reducers/notificationReducer";
import { useNavigate } from "react-router-dom";
import { FaAt, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Signup({ isOpen, onClose }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [authType, setAuthType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const formData = { email, username, password };
    try {
      await dispatch(signupUser(formData));
      dispatch(notify("success", "ثبت نام با موفقیت انجام شد"));
      navigate("/");
      onClose();
    } catch (error) {
      setError(getErrorMsg(error));
    }
  };

  const handleLogin = async () => {
    const formData = { username, password };
    try {
      await dispatch(loginUser(formData));
      dispatch(notify("شما با موفقیت وارد حساب کاربری خود شدید", "success"));
      onClose();
    } catch (err) {
      setError(getErrorMsg(err));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (authType === "login") {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error) {
      setError(getErrorMsg(error));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".register-form-container")) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit}>
      <main className="register-form-container-background">
        <div className="create-post-form-overlay"></div>
        <section className="register-form-container">
          <p className="register-form-title">
            {authType === "login" ? "ورود" : " ثبت نام"}
          </p>

          <div className="register-form-fields">
            {authType === "register" && (
              <div className="email-field-container">
                <label htmlFor="email">
                  <FaAt className="email-icon" />
                </label>
                <input
                  type="email"
                  className="email-field"
                  placeholder="ایمیل"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="username-field-container">
              <label htmlFor="username">
                <FaUser className="user-icon" />
              </label>
              <input
                type="text"
                className="username-field"
                placeholder="نام کاربری"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="password-field-container">
              <label htmlFor="password">
                <FaLock className="password-icon" />
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="password-field"
                placeholder="رمز عبور"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isPasswordVisible ? (
                <FaEyeSlash
                  className="eye-icon"
                  onClick={() => setIsPasswordVisible(false)}
                />
              ) : (
                <FaEye
                  className="eye-icon"
                  onClick={() => setIsPasswordVisible(true)}
                />
              )}
            </div>
          </div>

          <div className="register-form-btn-container">
            <button type="submit" className="register-form-btn">
              {authType === "login" ? "ورود" : "ثبت نام"}
            </button>
          </div>

          <p className="change-authtype-text">
            {authType === "login" ? (
              <>
                {"حساب کاربری ندارید؟ همین الان "}
                <span
                  className="change-authtype-btn"
                  onClick={() => setAuthType("register")}
                >
                  ثبت نام
                </span>
                {" کنید"}
              </>
            ) : (
              <>
                {"اگر قبلا حساب ایجاد کرده اید "}
                <span
                  className="change-aythtype-btn"
                  onClick={() => setAuthType("login")}
                >
                  وارد
                </span>
                {" حساب خود شوید."}
              </>
            )}
          </p>
        </section>
      </main>
      <AlertMessage
        error={error}
        severity="error"
        clearError={() => setError(null)}
      />
    </form>
  );
}

export default Signup;
