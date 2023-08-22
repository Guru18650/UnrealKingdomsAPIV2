const express = require('express');
const router = express.Router();
const db = require('../services/db');
const auth = require('../services/auth');

router.post('/download', async function(req, res) {
    const rows = await db.query(`SELECT * from adresses WHERE adress_name LIKE 'uklink'`);
    res.json({msg:"Success", data:rows[0]});
})

router.post('/updateDownload', async function(req, res) {
    const {token, link} = req.body;
    if(!token || !link)
        res.json("Fill in all the data", 400);
    else {
    const authorised = await auth.verify(token, true);
    if(!authorised.authenticated){
        res.json({msg:"Unauthorized"}, 401);
    } else {
        const rows = await db.query(`UPDATE adresses SET adress = '${link}' WHERE adress_name LIKE 'uklink'`);
        res.json({msg:"Success"});
    } 
}})

module.exports = router;