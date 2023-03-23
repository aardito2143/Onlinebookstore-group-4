import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

// REGEX pattern to check the validity of the password entry
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,25}$/;

export default function Register() {
  // Store navigation function, this allows some navigation methods
  const emailRef = useRef(null);
  const errRef = useRef(null);

  // Email states
  const [email, setEmail] = useState("");

  // Password states
  const [pass, setPass] = useState("");
  const [validPass, setValidPass] = useState(false);

  // Password Confimation states
  const [matchPass, setMatchPass] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const result = PWD_REGEX.test(pass);
    setValidPass(result);
    const match = pass === matchPass;
    setValidMatch(match);
  }, [email, pass, matchPass]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pass, matchPass]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against button being re-enabled via inspect element
    const v1 = PWD_REGEX.test(pass);
    if (!v1) {
      setErrMsg("Invalid Entry");
      return;
    }

    const bodyData = JSON.stringify({ email: email, pass: pass });

    const response = await fetch("/api/users/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: bodyData,
    });
    if (response.ok) {
      const json = await response.json();
      console.log(json);
    } else {
      setErrMsg(response.message);
    }
  };

  return (
    <div
      className="register-container"
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
        className="register-form"
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
          className="register-title"
          style={{
            fontSize: "2em",
            fontWeight: "900",
            color: "#F58A07",
            fontFamily: "Fredoka One",
            textShadow: "1px 2px 0px #909CC2",
            margin: "30px",
          }}
        >
          Sign Up
        </h1>
        <h2
          className="register-subtitle"
          style={{
            color: "black",
            padding: "1em",
          }}
        >
          Please fill out below to create an account
        </h2>
        <span ref={errRef} aria-live="assertive">
          {errMsg}
        </span>
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
          ></label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            className="form-input"
            name="email"
            type="email"
            autoCapitalize="none"
            autoCorrect="none"
            autoComplete="off"
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
            autoCapitalize="none"
            autoCorrect="none"
            aria-invalid={validPass ? "false" : "true"}
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
        <div className="form-section">
          <label htmlFor="confirm-password"></label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            className="form-input"
            autoCapitalize="none"
            autoCorrect="none"
            onChange={(e) => setMatchPass(e.target.value)}
            aria-invalid={validMatch ? "false" : "true"}
            placeholder="Confirm password"
            style={{
              width: "55%",
              marginTop: ".1em",
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
          ></input>
        </div>
        <button
          style={{
            height: "50px",
            marginTop: "20px",
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
          Sign-Up
        </button>

        <label
          style={{
            color: "black",
            marginTop: "3em",
            fontSize: ".6em",
          }}
        >
          Already A Member?
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
          }}
          type="button"
          className="form-btn"
        >
          <Link
            to="/login"
            style={{
              color: "#fff",
              fontWeight: "700",
            }}
          >
            Log-In
          </Link>
        </button>
      </form>
    </div>
  );
}
