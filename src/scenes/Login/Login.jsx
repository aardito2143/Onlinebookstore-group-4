import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
    <section className="login-page">
      <Link to="/" className="login-return-home">
        Return Home
      </Link>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-title">Login</h1>
          <span ref={errRef} aria-live="assertive">
            {errMsg}
          </span>
          <span>{success}</span>
          <div className="form-section">
            <label htmlFor="email">E-Mail</label>
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
              placeholder="Type your email"
              required
            />
          </div>
          <div className="form-section">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPass(e.target.value)}
              id="password"
              className="form-input"
              name="password"
              type="password"
              autoCapitalize="false"
              autoCorrect="false"
              placeholder="Type your password"
              required
            />
          </div>
          <Link to="/" className="form-forgot-pass">
            Forgot password?
          </Link>
          <button type="submit" className="form-btn">
            LOGIN
          </button>
        </form>
      </div>
    </section>
  );
}
