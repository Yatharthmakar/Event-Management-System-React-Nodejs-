const express = require('express');
const { login, signup, changepassword } = require('../database/dbFunctions');

const router = express.Router();

router.post('/login', async(req, res)=>{
    try{
        console.log('login');
        const response = await login(req.body.data);
        res.json(response);
    }
    catch(err){
        console.log('login error', err);
    }
});

router.post('/signup', async(req, res)=>{
    try{
        console.log('signup');
        const response = await signup(req.body.data);
        res.json(response);
    }
    catch(err){
        console.log('signup error', err);
    }
});

router.post('/changepassword', async(req, res)=>{
    try{
        console.log('changepassword');
        const response = await changepassword(req.body);
        res.json(response);
    }
    catch(err){
        console.log('changepassword error', err);
    }
});

module.exports = router;