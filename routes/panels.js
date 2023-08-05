const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.post('/get', async function(req, res) {
    const {email, id} = req.body;
    if(!email || !id)
        res.json("Fill in all the data", 400);
    else {
        const rows = await db.query(`SELECT * FROM panels WHERE owner_email LIKE '${email}' AND panel_number = ${id}`);
        if(rows.length == 0)
            res.json({msg:"No result"}, 404)
        else
            res.json({msg:"Success",data:rows[0]}) 
        }
});

router.post('/getAll', async function(req, res) {
    const {email} = req.body;
    if(!email)
        res.json("Fill in all the data", 400);
    else {
        const rows = await db.query(`SELECT * FROM panels WHERE owner_email LIKE '${email}'`);
        if(rows.length == 0)
            res.json({msg:"No result"}, 404)
        else
            res.json({msg:"Success",data:rows}) 
        }
});

router.post('/add', async function(req, res) {
    const { id, texture, title, description, url, owner } = req.body;
    if (!id || !texture || !owner || !title || !description || !url)
        res.json({msg:"Fill in all the data"}, 400);
    else {
        const rows = await db.query(`SELECT * FROM panels WHERE owner_email LIKE '${owner}' AND panel_number = ${id}`);
        if(rows.length != 0)
            res.json({msg:"Already exists"}, 409)
        else{
            await db.query(`INSERT INTO panels (panel_id, panel_number, texture, title, description, url, owner_email) VALUES (NULL, ${id}, '${texture}','${title}','${description}','${url}','${owner}')`);
            res.json({msg:"Success"})
        }
        
    }
});

module.exports = router;
