import React, { useEffect, useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        const bodyData = JSON.stringify({ email: email, pass: pass });

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: bodyData
        });
        if (response.ok){
            const json = await response.json();
            console.log(json);
        }
    }

    return (
        <div className='register-container'>
            <form className='register-form' onSubmit={handleSubmit}>
                <h1 className='register-title'>
                    Register
                </h1>
                <h2 className='register-subtitle'>
                    Please fill-out the form to Create an Account
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
                <button type='submit' className='form-btn'>Sign-Up</button>
            </form>
        </div>
    )
}