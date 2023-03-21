import React, { useEffect, useState, useRef } from 'react';

// REGEX pattern to check the validity of the password entry
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,25}$/;

export default function Register() {
    // Store navigation function, this allows some navigation methods
    const emailRef = useRef(null);
    const errRef = useRef(null);

    // Email states
    const [email, setEmail] = useState('');

    // Password states
    const [pass, setPass] = useState('');
    const [validPass, setValidPass] = useState(false);

    // Password Confimation states
    const [matchPass, setMatchPass] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    
    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, [])

    useEffect(() => {
        const result = PWD_REGEX.test(pass);
        setValidPass(result);
        const match = pass === matchPass;
        setValidMatch(match);
    }, [email, pass, matchPass])

    useEffect(() => {
        setErrMsg('');
    }, [email, pass, matchPass])

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Guard against button being re-enabled via inspect element
        const v1 = PWD_REGEX.test(pass);
        if (!v1) {
            setErrMsg("Invalid Entry");
            return;
        }

        const bodyData = JSON.stringify({ email: email, pass: pass });

        const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: bodyData
        });
        if (response.ok){
            const json = await response.json();
            console.log(json);
        } else {
            setErrMsg(response.message);
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
                <span
                    ref={errRef}
                    aria-live="assertive">
                        {errMsg}
                    </span>
                <div className='form-section'>
                    <label htmlFor='email'>E-Mail</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)} 
                        id='email' 
                        className='form-input' 
                        name='email' 
                        type='email' 
                        autoCapitalize='none' 
                        autoCorrect='none'
                        autoComplete='off'
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
                        autoCapitalize='none' 
                        autoCorrect='none'
                        aria-invalid={validPass ? "false" : "true"}
                        required />
                </div>
                <div className='form-section'>
                    <label htmlFor='confirm-password'>Confirm Password</label>
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type='password'
                        className='form-input'
                        autoCapitalize='none'
                        autoCorrect='none'
                        onChange={(e) => setMatchPass(e.target.value)}
                        aria-invalid={validMatch ? "false" : "true"}>

                    </input>
                </div>
                <button type='submit' className='form-btn'>Sign-Up</button>
            </form>
        </div>
    )
}