const express = require('express');
const router = express.Router();
const userAuth = require('../services/auth');
const emails = require('../services/email');
const db = require('../services/db');
const jwt = require('jsonwebtoken');

router.post('/login', async function(req, res) {
    let expires, admin;
    if(req.body.email == null || req.body.password == null)
        res.json("Fill in all the data", 400);
    else{
        if(req.body.expires == null)
            expires = "1 d";
        else
            expires = req.body.expires;
        if(req.body.admin == null)
            admin = false;
        else
            admin = true;
            res.json(await userAuth.login(req.body.email, req.body.password, expires, admin));
    }
})

router.post('/register', async function(req, res) {
    if(req.body.email == null || req.body.password == null || req.body.username == null)
        res.json("Fill in all the data", 400);
    else
        res.json(await userAuth.register(req.body.email, req.body.password, req.body.username));
});

router.post('/verify', async function(req, res) {
    if(req.body.token == null)
        res.json("Fill in all the data", 400);
    else{
        if(req.body.admin == null)
            res.json(await userAuth.verify(req.body.token, false));
        else
            res.json(await userAuth.verify(req.body.token, true));
    }
});

router.post('/reset', async function(req, res) {
    const {email} = req.body;
    if(!email)
        res.json({msg:"Fill in all the data"}, 400);
    else {
        const rows = await db.query(`SELECT * FROM users WHERE email LIKE '${email}'`);
        if(rows.length == 0){
            res.json({msg:"Success"}, 200);
        } else {
            res.json({msg:"Success"}, 200);
            var key = userAuth.generatePReset(email);
            await emails.sendEmail(email,"Password reset",key);
        }
    }
});

router.post('/changepass', async function(req, res) {
    const {token, password} = req.body;
    if(!token || !password)
        res.json({msg:"Fill in all the data"}, 400);
    else {
        const v = jwt.verify(token, process.env.jsonkey, async function(err, decoded) {
            if(err != null)
                res.json({msg:"Bad token"}, 402);
            else {
                const salt = userAuth.generateSalt();
                const pass = userAuth.hashPassword(password, salt);
                await db.query(`UPDATE users SET password="${pass}", salt="${salt}" WHERE email LIKE "${decoded.email}"`);
                res.json({msg:"Success"}, 200);
            }
        
            });
}});

module.exports = router;