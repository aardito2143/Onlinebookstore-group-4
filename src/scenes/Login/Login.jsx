import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import "./Login.css";

const LOGIN_URL = "/api/authentication";

export default function Login() {
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pass]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, pass }),
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      setAuth({ email, pass, role, accessToken });
      console.log(auth);
      setEmail("");
      setPass("");
      setSuccess(
        `Successfully Signed in as: ${email} With a user role of: ${role}`
      );
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server Connection Timed Out");
      } else if (err.response?.status === 400) {
        setErrMsg("Email or Password is incorrect");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        margin: "-2.5em 32em ",
        boxSizing: "border-box",
        width: "400px",
        height: "100%",
        background: "transparent",
        padding: "0",

        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Roboto",
      }}
    >
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2em 2em",
          borderRadius: "5px",
          textAlign: "center",
          boxShadow: "10px 10px 15px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alighnItems: "center",
        }}
      >
        <a
          style={{
            color: "black",
            marginLeft: "-20em",
            marginTop: "-3.5em",
          }}
          className="form-forgot-pass"
          href="/"
        >
          Return to Home
        </a>
        <h1
          className="login-title"
          style={{
            fontSize: "2em",
            fontWeight: "900",
            color: "#084887",
            fontFamily: "Fredoka One",
            textShadow: "1px 2px 0px #909CC2",
            margin: "30px",
          }}
        >
          Log In
        </h1>
        <h2
          className="login-subtitle"
          style={{
            color: "black",
            padding: "1em",
          }}
        >
          Please enter your email and password
        </h2>
        <span ref={errRef} aria-live="assertive">
          {errMsg}
        </span>
        <span>{success}</span>
        <div
          className="form-section"
          style={{
            width: "100%",
            marginBottom: "20px",
            color: "black",
            display: "flex",
            flexDirection: "column",
            borderBottom: "2px solid rgba(100, 100, 100, 0.2)",
          }}
        >
          <label
            htmlFor="email"
            style={{
              marginBottom: "15px",
            }}
          >
            {" "}
          </label>
          <input
            ref={userRef}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            className="form-input"
            name="email"
            type="email"
            autoCapitalize="false"
            autoCorrect="false"
            autoFocus
            required
            placeholder="Enter your email"
            style={{
              width: "55%",
              height: "100%",
              outline: "none",
              padding: "10px 10px 10px 10px",
              fontSize: "14px",
              background: "none",
              caretColor: "#5372F0",
              borderRadius: "5px",
              border: "none",
              borderBottomWidth: "2px",
              transition: "all 0.2s ease",
            }}
          />
        </div>
        <div
          className="form-section"
          style={{
            width: "100%",
            marginBottom: "30px",
            color: "black",
          }}
        >
          <label htmlFor="password"></label>
          <input
            onChange={(e) => setPass(e.target.value)}
            id="password"
            className="form-input"
            name="password"
            type="password"
            autoCapitalize="false"
            autoCorrect="false"
            required
            placeholder="Enter a password"
            style={{
              width: "55%",
              marginTop: "1em",
              height: "100%",
              outline: "none",
              padding: "10px 30px 10px 10px",
              fontSize: "14px",
              background: "none",
              caretColor: "#5372F0",
              borderRadius: "5px",
              border: "none",
              borderBottomWidth: "2px",
              transition: "all 0.2s ease",
            }}
          />
        </div>
        <a
          style={{
            color: "black",
            marginRight: "-5em",
            marginTop: "-2em",
            marginBottom: "5em",
          }}
          className="form-forgot-pass"
          href="/"
        >
          Forgot password?
        </a>
        <button
          style={{
            height: "50px",
            marginTop: "1px",
            color: "#fff",
            padding: "0 2em 0 2em",
            border: "none",
            background:
              "linear-gradient(90deg, #909cc2, #084887, #f58a07, #f9ab55)",
            cursor: "pointer",
            borderBottom: "2px solid rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            fontSize: "1em",
            fontFamily: "Tahoma",
            marginLeft: ".5em",
            borderRadius: ".5em",
            textDecoration: "none",
          }}
          type="submit"
          className="form-btn"
        >
          Log In
        </button>

        <label
          style={{
            color: "black",
            marginRight: "-2em",
            marginLeft: "em",
            marginTop: "3em",
            fontSize: ".6em",
          }}
        >
          Not A Member?
        </label>
        <button
          style={{
            height: "50px",
            marginTop: "2px",
            fontcolor: "#fff",
            padding: "0 2em 0 2em",
            border: "none",
            background:
              "linear-gradient(90deg, #909cc2, #084887, #f58a07, #f9ab55)",
            cursor: "pointer",
            borderBottom: "2px solid rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            fontSize: "1em",
            fontFamily: "Tahoma",
            marginLeft: ".5em",
            borderRadius: ".5em",
            textDecoration: "none",
          }}
          type="submit"
          className="form-btn"
        >
          <Link
            to="/register"
            style={{
              color: "#fff",
              fontWeight: "700",
            }}
          >
            Sign-Up
          </Link>
        </button>
      </form>
    </div>
  );
}
