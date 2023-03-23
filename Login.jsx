import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import "./Login.css"

const LOGIN_URL = "/api/authentication";

export default function Login() {
    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, pass])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, pass }),
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const role = response?.data?.role;
            setAuth({ email, pass, role, accessToken });
            console.log(auth);
            setEmail('');
            setPass('');
            setSuccess(`Successfully Signed in as: ${email} With a user role of: ${role}`)
            navigate(from, { replace: true });
        } catch (err) {
            if(!err?.response) {
                setErrMsg('Server Connection Timed Out');
            } else if (err.response?.status === 400) {
                setErrMsg('Email or Password is incorrect');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className='login-container' style={{
            margin: ".01em 25em",
            boxSizing: "border-box",
            width: "45%",
            height: "10vh",
            background: "transparent",
            padding: "40px 45px 50px",


        }}>
            <form className='login-form' onSubmit={handleSubmit} style ={{
                background: "#fff",
                padding: "40px 30px 50px 30px",
                borderRadius: "5px",
                textAlign: "center",
                boxShadow: "10px 10px 15px rgba(0,0,0,0.1)"

            }}>
                <h1 className='login-title'style={{
                    fontSize: "40px",
                    fontWeight: "600",
                    color: "#084887",
                    fontFamily: "Fredoka One",
                    textShadow: "1px 3px 4px #909CC2"
                }}>
                    Login
                </h1>
                <h2 className='login-subtitle' style={{
                     color: "black",
                     padding: "1em"
                }}>
                    Please enter your email and password
                </h2>
                <span
                    ref={errRef}
                    aria-live="assertive">
                        {errMsg}
                </span>
                <span>
                    {success}
                </span>
                <div className='form-section' style={{
                    width: "100%",
                    marginBottom: "20px",
                    Animation: "shake 0.3s ease-in-out",
                    color: "black",
    
                }}>
                    <label htmlFor='email'></label>
                    <input
                        ref={userRef}
                        onChange={(e) => setEmail(e.target.value)} 
                        id='email' 
                        className='form-input' 
                        name='email' 
                        type='email' 
                        autoCapitalize='false' 
                        autoCorrect='false' 
                        autoFocus 
                        required 
                        placeholder='Email Address'
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

                            
                         }} />
                </div>
                <div className='form-section' style={{
                        width: "100%",
                        marginBottom: "30px",
                        Animation: "shake 0.3s ease-in-out",
                        color: "black"
                }}
                >
                    <label htmlFor='password' ></label>
                    <input
                        onChange={(e) => setPass(e.target.value)}
                        id='password' 
                        className='form-input' 
                        name='password' 
                        type='password' 
                        autoCapitalize='false' 
                        autoCorrect='false' 
                        required 
                        placeholder='Password'
                       style={{width: "55%",
                       marginTop:"1em",
                            height: "100%",
                            outline: "none",
                            padding: "10px 30px 10px 30px",
                            fontSize: "18px",
                            background: "none",
                            caretColor: "#5372F0",
                            borderRadius: "5px",
                            border: "1px solid #bfbfbf",
                            borderBottomWidth: "2px",
                            transition: "all 0.2s ease",}}/>
                </div>
                <button style={{
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
                    fontFamily:"Tahoma",
                    marginLeft:"3em",
                    borderRadius: ".5em",
                    textDecoration: "none"
                }}type='submit' className='form-btn'>Sign-In</button>

                <label style={{
                    color:"black",
                    marginRight:"-4.5em",
                    marginLeft:"5em"
                }}>Not A Member?</label>
                <button style={{
                    height: "50px",
                    marginTop: "25px",
                    fontcolor: "#fff",
                    padding: "0 2em 0 2em",
                    border: "none",
                    background: "#5372F0",
                    cursor: "pointer",
                    borderBottom: "2px solid rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    fontSize: "1em",
                    fontFamily:"Tahoma",
                    marginLeft:"5em",
                    borderRadius: ".5em",
                    textDecoration: "none"
                }}type='submit' className='form-btn'><Link to="/register" style={{
                    color: "#fff",
                }}>Sign-Up</Link></button>
            </form>
        </div>
    )
};