const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.post('/get', async function(req, res) {
    const {email} = req.body;
    if(!email)
        res.json({msg:"Fill in all the data"}, 400);
    else {
        const rows = await db.query(`SELECT * FROM user_items WHERE user_email LIKE '${email}'`)
        if(rows.length == 0)
            res.json({msg:"No result"}, 404)
        else
            res.json({msg:"Success",data:rows})
    }
});

router.post('/update', async function(req, res) {
    const {email, data} = req.body
    if(!email || !data)
        res.json({msg:"Fill in all the data"}, 400);
    else {
        await db.query(`DELETE FROM user_items WHERE user_email LIKE '${email}'`)
        if(typeof data === 'string')
            d = await JSON.parse(data);
        else
            d = await JSON.parse(await JSON.stringify(data));
        for (let id = 0; id < d.length; id++) {
            const e = d[id];
            await db.query(`INSERT INTO user_items VALUES (NULL, '${email}','${e.name}','${e.quantity}','${e.slot_number}','${e.item_id}')`);
        }
        res.json({msg:"Success"})

    }
});

module.exports = router;