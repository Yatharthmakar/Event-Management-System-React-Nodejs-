import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/App.css';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("goalfi") && !sessionStorage.getItem("goalfi")) {
            navigate('/');
            return;
        }
    });

    const handleChange = (e) => {
        setError('');
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handlePassChange = async () => {
        setIsLoading(true);
        setError('');
        const response = await fetch('/auth/changepassword', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ "user": localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi"), "inputs": inputs })
        });
        const result = await response.json();
        if (result.message == 'success') {
            setSuccessMessage('Password change succesful, redirecting to login page!');
            setTimeout(() => {
                localStorage.removeItem("goalfi");
                sessionStorage.removeItem("goalfi");
                navigate('/');
            }, 3000);

        }
        else {
            setError(result.message);
        }
        setIsLoading(false);
    }

    return (
        <div className='card'>
            <h2 className='center'>Change Password</h2>
            <label>Old Password</label><br></br>
            <input type="text" className='input-box margin' name="oldpassword" value={inputs.oldpassword} onChange={handleChange} autocomplete="one-time-code"/>
            <label>New Password</label><br></br>
            <input type="password" className='input-box margin' name="newpassword" value={inputs.newpassword} onChange={handleChange} autocomplete="one-time-code"/>
            <label>Confirm New Password</label><br></br>
            <input type="password" className='input-box margin' name="confirmnewpassword" value={inputs.confirmnewpassword} onChange={handleChange} autocomplete="off"/>
            <div className='center margin error'>{error}</div>
            <div className='center margin success'>{successMessage}</div>
            <button className='login-button margin' onClick={handlePassChange} disabled={isLoading}>
                {isLoading && <i class="fa fa-spinner fa-spin"></i>}Change Password
            </button>
        </div>
    )
}
