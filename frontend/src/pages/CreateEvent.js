import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import '../css/App.css';

export default function CreateEvent() {

    const navigate = useNavigate();
    
    useEffect(() => {

        if(!localStorage.getItem("goalfi") && !sessionStorage.getItem("goalfi")){
            navigate('/'); 
        }
    });

    const [inputs, setInputs] = useState({});
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const createEvent = async () => {
        setIsLoading(true);
        setError('');
        const response = await fetch('/event/createevent', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ "data": {inputs, "user": localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi")} })
        })
        const result = await response.json();
        console.log(result);
        if (result.message == 'success') {
            navigate('/home'); 
        }else{
            setError(result.message);
        }
        setIsLoading(false);
    }

    return (
        <div className='card-big'>
            <h2 className='center'>Create Event</h2>
            <label>Event name</label><br></br>
            <input type="text" className='input-box margin' name="eventname" value={inputs.eventname} onChange={handleChange} />
            <label>Description</label><br></br>
            <input type="textarea" className='input-box margin' name="description" value={inputs.description} onChange={handleChange} />
            <label>Date of Event</label><br></br>
            <input type="date" className='input-box margin' name="date" value={inputs.date} onChange={handleChange} />

            <div className='center margin error'>{error}</div>
            <button className='login-button margin' onClick={createEvent} disabled={isLoading}>
                {isLoading && <i class="fa fa-load fa-spinner fa-spin"></i>}Create
            </button>
        </div>
    )
}
