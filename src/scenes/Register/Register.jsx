import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

// REGEX pattern to check the validity of the password entry
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,25}$/;

export default function Register() {
  // Store navigation function, this allows some navigation methods
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const errRef = useRef(null);

  // Email states
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  // Password states
  const [pass, setPass] = useState("");
  const [validPass, setValidPass] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  // Password Confimation states
  const [matchPass, setMatchPass] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
        margin: ".01em 25em",
        boxSizing: "border-box",
        width: "45%",
        height: "10vh",
        background: "transparent",
        padding: "40px 45px 50px",
      }}
    >
      <form
        className="register-form"
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "40px 30px 50px 30px",
          borderRadius: "5px",
          textAlign: "center",
          boxShadow: "10px 10px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          className="register-title"
          style={{
            fontSize: "35px",
            fontWeight: "600",
            color: "#F58A07",
            fontFamily: "Fredoka One",
            textShadow: "1px 3px 4px #909CC2",
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
            Animation: "shake 0.3s ease-in-out",
            color: "black",
          }}
        >
          <label htmlFor="email"></label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            className="form-input"
            name="email"
            type="email"
            autoCapitalize="none"
            autoCorrect="none"
            autoComplete="off"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            autoFocus
            required
            placeholder="Email Address"
            style={{
              width: "55%",
              height: "100%",
              outline: "none",
              padding: "10px 30px 10px 30px",
              fontSize: "18px",
              background: "none",
              caretColor: "#5372F0",
              borderRadius: "5px",
              border: "1px solid #bfbfbf",
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
            Animation: "shake 0.3s ease-in-out",
            color: "black",
          }}
        >
          <label htmlFor="password"></label>
          <input
            onChange={(e) => setPass(e.target.value)}
            onFocus={() => setPassFocus(true)}
            onBlur={() => setPassFocus(false)}
            id="password"
            className="form-input"
            name="password"
            type="password"
            autoCapitalize="none"
            autoCorrect="none"
            aria-invalid={validPass ? "false" : "true"}
            required
            placeholder="Password"
            style={{
              width: "55%",
              marginTop: "1em",
              height: "100%",
              outline: "none",
              padding: "10px 30px 10px 30px",
              fontSize: "18px",
              background: "none",
              caretColor: "#5372F0",
              borderRadius: "5px",
              border: "1px solid #bfbfbf",
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
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            aria-invalid={validMatch ? "false" : "true"}
            placeholder="Confirm Password"
            style={{
              width: "55%",
              marginTop: ".5em",
              height: "100%",
              outline: "none",
              padding: "10px 30px 10px 30px",
              fontSize: "18px",
              background: "none",
              caretColor: "#5372F0",
              borderRadius: "5px",
              border: "1px solid #bfbfbf",
              borderBottomWidth: "2px",
              transition: "all 0.2s ease",
            }}
          ></input>
        </div>
        <button
          style={{
            height: "50px",
            marginTop: "25px",
            color: "#fff",
            padding: "0 2em 0 2em",
            border: "none",
            background: "#5372F0",
            cursor: "pointer",
            borderBottom: "2px solid rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            fontSize: "1em",
            fontFamily: "Tahoma",
            marginLeft: "3em",
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
            marginRight: "-4.5em",
            marginLeft: "5em",
          }}
        >
          Already A Member?
        </label>
        <button
          style={{
            height: "50px",
            marginTop: "25px",
            color: "#fff",
            padding: "0 2em 0 2em",
            border: "none",
            background: "#5372F0",
            borderBottom: "2px solid rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            fontSize: "1em",
            fontFamily: "Tahoma",
            marginLeft: "5em",
            borderRadius: ".5em",
            textDecoration: "none",
          }}
          type="submit"
          className="form-btn"
        >
          <Link
            to="/login"
            style={{
              color: "#fff",
            }}
          >
            Sign-In
          </Link>
        </button>
      </form>
    </div>
  );
}
