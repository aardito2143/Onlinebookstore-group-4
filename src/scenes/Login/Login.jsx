import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bodyData = JSON.stringify({ email: email, pass: pass });

        const response = await fetch('api/authentication', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: bodyData
        });
        if (response.ok){
            const json = await response.json();
            localStorage.setItem('token', json.token);
            console.log(json);
            navigate(-1);
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
                <div className='form-section'>
                    <label htmlFor='email'>E-Mail</label>
                    <input
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
        </div>
    )
};