const express = require('express');
const router = express.Router();
const users = require('../services/users');
const { route } = require('./auth');

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

module.exports = router;