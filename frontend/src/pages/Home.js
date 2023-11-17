import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventList from '../components/EventList';
import '../css/App.css';

export default function Home() {
    const [events, setevents] = useState();
    const [invitedEvents, setInvitedEvents] = useState();
    const [selectedSwitch, setSelectedSwitch] = useState(0);
    const [isloading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("goalfi") && !sessionStorage.getItem("goalfi")){
            navigate('/'); 
            return;
        }

        const fetchEvents = async () => {
            setIsLoading(true);
            const response = await fetch('/event/getuserevents', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ "data": localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi") })
            })
            const result = await response.json();
            setevents(result.events);

            const getuserinvitedevents = async () => {
                const response = await fetch('/event/getuserinvitedevents', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ "data": result.events.got_invited })
                })
                const result1 = await response.json();
                setInvitedEvents(result1.events);
            }
            getuserinvitedevents();
            setIsLoading(false);
        }

        fetchEvents();
    }, []);

    const handleLogout = ()=>{
        localStorage.removeItem("goalfi");
        sessionStorage.removeItem("goalfi");
        navigate('/'); 
    }

    return (
        <div className='home-page'>
            <div className='header'>
                <div><strong style={{ fontSize: "25px" }}>{localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi")}</strong></div>
                <div className='header-button-wrapper'>
                    <Link to='/create-event'><button className='button'><i class="fa fa-plus"></i>  Create Event </button></Link>
                    <div className='logout-button' onClick={handleLogout}><i class="fa fa-power-off logout-icon"></i></div>
                    <div className='logout-button' onClick={()=>navigate('/changepassword')}><i class="fa fa-gears logout-icon"></i></div>
                </div>
            </div>
            <div className='event-switch'>
                <div className={selectedSwitch == 0 ? ' active switch-buttons' : 'switch-buttons'} onClick={() => setSelectedSwitch(0)}>Your Events</div>
                <div className={selectedSwitch == 1 ? ' active switch-buttons' : 'switch-buttons'} onClick={() => setSelectedSwitch(1)}>Invitations</div>
            </div>
            <div className='list-container'>
                {selectedSwitch == 0 && events && <EventList events={events.created_events} showInvites={false}/>}
                {selectedSwitch == 1 && events && <EventList events={invitedEvents} showInvites={true} />}
                {!events && isloading && <i class="fa fa-big fa-spinner fa-spin"></i>}
                
            </div>
        </div>
    )
}
