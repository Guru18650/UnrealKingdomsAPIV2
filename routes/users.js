const express = require('express');
const router = express.Router();
const users = require('../services/users');
const { route } = require('./auth');
const jwt = require('jsonwebtoken');

router.post('/checkEmail', async function(req,res) {
    if(req.body.email == null)
        res.json("Fill in all the data", 400);
    else
        res.json(await users.checkEmail(req.body.email));
})

router.post('/checkUsername', async function(req,res) {
    if(req.body.username == null)
        res.json("Fill in all the data", 400);
    else
        res.json(await users.checkUsername(req.body.username));
})

router.post('/userinfo', async function(req, res) {
    if(req.body.token == null)
        res.json("Fill in all the data", 400);
    try {
        let decoded = jwt.verify(req.body.token, process.env.jsonkey)
        res.json(await users.userinfo(decoded));
    } catch {
        res.json("Invalid token", 405);
    }

    
})

module.exports = router;