const express = require('express');
const router = express.Router();
const coins = require('../services/coins');

const currencies = ["uk","dg","cc"];

router.post('/get', async function(req, res) {
    if(req.body.email == null)
        res.json("Fill in all the data", 400);
    else
        res.json(await coins.get(req.body.email));
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

module.exports = router;
