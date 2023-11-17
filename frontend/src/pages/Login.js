import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import '../css/App.css';

export default function Login() {
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi")){
            navigate('/home'); 
        }
    },[]);
    

    const [inputs, setInputs] = useState({});
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setError('');
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ "data": inputs })
        })
        const result = await response.json();
        console.log(result);
        if (result.message == 'success') {
            if(remember){
                localStorage.setItem("goalfi", inputs.email);
                sessionStorage.setItem("goalfi", inputs.email);
            }
            sessionStorage.setItem("goalfi", inputs.email);

            navigate('/home'); 
        }else{
            setError(result.message);
        }
        setIsLoading(false);
    }

    return (
        <div className='card'>
            <h2 className='center'>Login to your account</h2>
            <label>Email</label><br></br>
            <input type="text" className='input-box margin' name="email" value={inputs.email} onChange={handleChange}/>
            <label>Password</label><br></br>
            <input type="password" className='input-box margin' name="password" value={inputs.password} onChange={handleChange}/>
            <div className='margin'>
                <input type="checkbox" name="remberMe" onChange={()=>setRemember(!remember)} value={remember} />
                <label>Remember Me</label><br></br>
            </div>
            <div className='center margin error'>{error}</div>
            <button className='login-button margin' onClick={handleLogin} disabled={isLoading}>
                {isLoading && <i class="fa fa-load fa-spinner fa-spin"></i>}Login
            </button>
            <h5 className='center'>New to app? <Link to='/signup'>Sign Up</Link></h5>
        </div>
    )
}
