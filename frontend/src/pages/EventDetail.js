import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import '../css/App.css';

export default function EventDetail() {
    const [event, setEvent] = useState();
    const [users, setUsers] = useState();
    const [invitedUsers, setInvitedUsers] = useState();
    const [showInvites, setShowInvites] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const eventData = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if(!localStorage.getItem("goalfi") && !sessionStorage.getItem("goalfi")){
            navigate('/'); 
            return;
        }

        setEvent(eventData.state.item);
        setShowInvites(eventData.state.showInvites)
        setIsLoading(true);
        if(!eventData.state.showInvites){
        const getUsers = async () => {
            const response = await fetch('/event/getusers');
            const result = await response.json();
            setUsers(result.users);
        }
        getUsers();
        getinvitedUsers();
        }
        setIsLoading(false);
    }, []);

    
    const getinvitedUsers = async()=>{
        const response = await fetch('/event/getinvitedusers', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ "user": localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi"), "event": eventData.state.item.name })
        });
        const result = await response.json();
        setInvitedUsers(result.invitedusers);
    }

    const handleInvite = async (data) => {
        setIsLoading(true);
        const response = await fetch('/event/inviteuser', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ "inviter": localStorage.getItem("goalfi") || sessionStorage.getItem("goalfi"), "invited": data.invited, "event": data.event })
        })
        const result = await response.json();
        getinvitedUsers();
        setIsLoading(false);
    }

    return (
        (event && <div className='home-page'>
            <Link to='/home'><button className='button'><i class="fa fa-arrow-left"></i>  Back </button></Link>
            <div className='list-item-first'><strong style={{ fontSize: "35px" }}>{event.name}</strong><div><strong>Date: </strong>{event.date}</div></div>
            <div className='list-item-description'>{event.description}</div>

            {!users && !showInvites && !invitedUsers && <i class="fa fa-big fa-spinner fa-spin"></i>}
            {!isLoading && invitedUsers && users && <><strong style={{ fontSize: "20px" }}>Users</strong>
                <div className='user-list'>
                    {users.map((user) => {
                        let invited = false;
                        if (user.email === localStorage.getItem("goalfi") || user.email === sessionStorage.getItem("goalfi")) {
                            return;
                        }
                        invitedUsers.map(invitedUser => {
                            if(invitedUser == user.email){
                                invited = true;
                            }
                        });
                        return (
                            <div className='user-list-items'>
                                <div><strong>{user.name}</strong> ({user.email})</div>
                                {invited?<button className='invited-button'><i class="fa fa-check"></i>  Invited</button>:<button className='button' onClick={() => handleInvite({ "invited": user.email, "event": event.name })}>{isLoading?<i class="fa fa-load fa-spinner fa-spin"></i>:<><i class="fa fa-plus"></i>  Invite</>}</button>}
                            </div>
                        )
                    })}
                </div></>}
                {showInvites && <small>Invited By {event.inviter}</small> }
        </div>)
    )
}
