const express = require('express');
const { createevent, getuserevents, getusers, inviteuser, getinvitedusers, getuserinvitedevents } = require('../database/dbFunctions');

const router = express.Router();

router.post('/createevent', async(req, res)=>{
    try{
        console.log('createevent');
        const response = await createevent(req.body.data);
        res.json(response);
    }
    catch(err){
        console.log('createevent error', err);
    }
});

router.post('/getuserevents', async(req, res)=>{
    try{
        console.log('getuserevents');
        const response = await getuserevents(req.body.data);
        res.json(response);
    }
    catch(err){
        console.log('getuserevents error', err);
    }
});

router.get('/getusers', async(req, res)=>{
    try{
        console.log('getusers');
        const response = await getusers();
        res.json(response);
    }
    catch(err){
        console.log('getusers error', err);
    }
});

router.post('/inviteuser', async(req, res)=>{
    try{
        console.log('inviteuser');
        const response = await inviteuser(req.body);
        res.json(response);
    }
    catch(err){
        console.log('inviteuser error', err);
    }
}); 

router.post('/getinvitedusers', async(req, res)=>{
    try{
        console.log('getinvitedusers');
        const response = await getinvitedusers(req.body);
        res.json(response);
    }
    catch(err){
        console.log('getinvitedusers error', err);
    }
});

router.post('/getuserinvitedevents', async(req, res)=>{
    try{
        console.log('getuserinvitedevents');
        const response = await getuserinvitedevents(req.body.data);
        res.json(response);
    }
    catch(err){
        console.log('getuserinvitedevents error', err);
    }
});

module.exports = router;