import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

const LOGIN_URL = "/api/authentication";

export default function Login() {
    const { setAuth } = useAuth();

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
            setEmail('');
            setPass('');
            setSuccess(`Successfully Signed in as: ${email} With a user role of: ${role}`)
            // navigate(from, { replace: true });
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
        <div className='login-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <h1 className='login-title'>
                    Login
                </h1>
                <h2 className='login-subtitle'>
                    Please fill-out the form to Sign-In
                </h2>
                <span
                    ref={errRef}
                    aria-live="assertive">
                        {errMsg}
                </span>
                <span>
                    {success}
                </span>
                <div className='form-section'>
                    <label htmlFor='email'>E-Mail</label>
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
                        required />
                </div>
                <div className='form-section'>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={(e) => setPass(e.target.value)}
                        id='password' 
                        className='form-input' 
                        name='password' 
                        type='password' 
                        autoCapitalize='false' 
                        autoCorrect='false' 
                        required />
                </div>
                <button type='submit' className='form-btn'>Sign-In</button>
            </form>
            <div>
                <Link to="/dashboard">Go to Admin Dashboard!</Link>
            </div>
        </div>
    )
};