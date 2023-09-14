const express = require('express');
const router = express.Router();
const coins = require('../services/coins');
const auth = require('../services/auth');
const currencies = ["uk","dg","cc"];
const db = require('../services/db');


router.post('/get', async function(req, res) {
    const {email} = req.body;
    if(req.body.email == null)
        res.json("Fill in all the data", 400);
    else {
        const rows = await db.query(`SELECT uk_coin, dg_coin, cc_coin FROM users WHERE email LIKE '${email}'`);
        if(rows.length != 1)
            res.json({msg:"No result"}, 404)
        else
            res.json({msg:"Success",data:rows[0]})
    }
        
});

router.post('/exchange', async function(req, res) {
    if(req.body.email == null || req.body.from == null || req.body.to == null || req.body.value == null) 
        res.json("Fill in all the data", 400);
    else{
        if(currencies.includes(req.body.from) && currencies.includes(req.body.to)){
            if(req.body.from == req.body.to)
                res.json("Invalid conversion", 405);
            else
                res.json(await coins.exchange(req.body.email, req.body.from, req.body.to, req.body.value));
        } else
            res.json("Invalid conversion", 405);
    }
});

router.post('/setRates', async function(req, res){
   const { token, uk, cc, dg } = req.body;
   if(!token||!uk||!cc|!dg)
    res.json("Fill in all the data", 400);
    else {
        if(uk>0||cc>0||dg>0){
            const authorised = await auth.verify(token, true);
            if(!authorised.authenticated){
                res.json({msg:"Unauthorized"}, 401);
            } else {
                await db.query(`UPDATE exchange_rates SET value = '${uk}' WHERE currency LIKE 'uk'`);
                await db.query(`UPDATE exchange_rates SET value = '${dg}' WHERE currency LIKE 'dg'`);
                await db.query(`UPDATE exchange_rates SET value = '${cc}' WHERE currency LIKE 'cc'`);
                res.json({msg:"Success"});
            } 
        }else{
            res.json("Bad query", 401);
        }
    }

})

router.post('/transfer', async function(req, res) {
    if(req.body.email == null || req.body.value == null || req.body.token == null)
        res.json("Fill in all the data", 400);
    else {
        if(req.body.token != process.env.exchangetoken)
            res.json("Bad token", 401);
        else
            res.json(await coins.transfer(req.body.email, req.body.value));
    }
});

router.post('/exchangeRate', async function(req, res) {
    res.json(await coins.exchangeRate());
})

module.exports = router;
