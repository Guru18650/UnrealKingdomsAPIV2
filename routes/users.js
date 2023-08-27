const express = require('express');
const router = express.Router();
const users = require('../services/users');
const { route } = require('./auth');
const jwt = require('jsonwebtoken');
const db = require('../services/db');
const auth = require('../services/auth');

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

router.post('/isBanned', async function(req,res) {
    const {email} = req.body;
    if(req.body.email == null)
        res.json("Fill in all the data", 400);
    else {
        const rows = await db.query(`SELECT isBanned FROM users WHERE email LIKE '${email}'`);
        if(rows.length==0){
            res.json({msg:"User not found"}, 404)
        } else {
            res.json({msg:"Success",data:Boolean(rows[0].isBanned)})
        }
    }
})

router.post('/getBans', async function(req,res) {
        const rows = await db.query(`SELECT user_id, email, username FROM users WHERE isBanned = 1`);

            res.json({msg:"Success",data:rows})
        }
)

router.post('/ban', async function(req,res) {
    const {token, email} = req.body;
    if(!token || !email)
        res.json("Fill in all the data", 400);
    else {
    const authorised = await auth.verify(token, true);
    if(!authorised.authenticated){
        res.json({msg:"Unauthorized"}, 401);
    } else {
        const rows = await db.query(`SELECT isBanned FROM users WHERE email LIKE '${email}'`);
        if(rows.length==0){
            res.json({msg:"User not found"}, 404)
        } else {
        const rows = await db.query(`UPDATE users set isBanned = true WHERE email LIKE '${email}'`);
        res.json({msg:"Success"});
        }
    } 
    }
});

router.post('/unban', async function(req,res) {
    const {token, email} = req.body;
    if(!token || !email)
        res.json("Fill in all the data", 400);
    else {
    const authorised = await auth.verify(token, true);
    if(!authorised.authenticated){
        res.json({msg:"Unauthorized"}, 401);
    } else {
        const rows = await db.query(`SELECT isBanned FROM users WHERE email LIKE '${email}'`);
        if(rows.length==0){
            res.json({msg:"User not found"}, 404)
        } else {
        const rows = await db.query(`UPDATE users set isBanned = false WHERE email LIKE '${email}'`);
        res.json({msg:"Success"});
        }
    } 
    }
});



router.post('/getAdmins', async function(req,res) {
    const rows = await db.query(`SELECT user_id, email, username FROM users WHERE isAdmin = 1`);

        res.json({msg:"Success",data:rows})
    }
)

router.post('/promote', async function(req,res) {
const {token, email} = req.body;
if(!token || !email)
    res.json("Fill in all the data", 400);
else {
const authorised = await auth.verify(token, true);
if(!authorised.authenticated){
    res.json({msg:"Unauthorized"}, 401);
} else {
    const rows = await db.query(`SELECT isAdmin FROM users WHERE email LIKE '${email}'`);
    if(rows.length==0){
        res.json({msg:"User not found"}, 404)
    } else {
    const rows = await db.query(`UPDATE users set isAdmin = true WHERE email LIKE '${email}'`);
    res.json({msg:"Success"});
    }
} 
}
});

router.post('/demote', async function(req,res) {
const {token, email} = req.body;
if(!token || !email)
    res.json("Fill in all the data", 400);
else {
const authorised = await auth.verify(token, true);
if(!authorised.authenticated){
    res.json({msg:"Unauthorized"}, 401);
} else {
    const rows = await db.query(`SELECT isAdmin FROM users WHERE email LIKE '${email}'`);
    if(rows.length==0){
        res.json({msg:"User not found"}, 404)
    } else {
    const rows = await db.query(`UPDATE users set isAdmin = false WHERE email LIKE '${email}'`);
    res.json({msg:"Success"});
    }
} 
}
});

module.exports = router;