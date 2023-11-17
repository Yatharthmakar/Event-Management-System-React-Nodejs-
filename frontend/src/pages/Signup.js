import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import '../css/App.css';

export default function Signup() {
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi")){
            navigate('/home'); 
        }
    },[]);

    const [inputs, setInputs] = useState({});
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const handleChange = (e) => {
        setError('');
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ "data": inputs })
        });
        const result = await response.json();
        if (result.message=='success') {
            if(remember){
                localStorage.setItem("goalfi", inputs.email);
                sessionStorage.setItem("goalfi", inputs.email);
            }
            sessionStorage.setItem("goalfi", inputs.email);

            navigate('/home'); 
        }
        else{
            setError(result.message);
        }
        setIsLoading(false);
    }

    return (
        <div className='card'>
            <h2 className='center'>Create Account</h2>
            <label>Name</label><br></br>
            <input type="text" className='input-box margin' name="name" value={inputs.name} onChange={handleChange}/>
            <label>Email</label><br></br>
            <input type="email" className='input-box margin' name="email" value={inputs.email} onChange={handleChange}/>
            <label>Password</label><br></br>
            <input type="password" className='input-box margin' name="password" value={inputs.password} onChange={handleChange}/>
            <div className='margin'>
                <input type="checkbox" name="remberMe" onChange={()=>setRemember(!remember)} value={remember} />
                <label >Remember Me</label><br></br>
            </div>
            <div className='center margin error'>{error}</div>
            <button className='login-button margin' onClick={handleLogin} disabled={isLoading}>
                {isLoading && <i class="fa fa-spinner fa-spin"></i>}Sign Up
            </button>
            <h5 className='center'>Already have an account? <Link to='/'>Login</Link></h5>
        </div>
    )
}
