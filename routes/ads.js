const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.post('/get', async function(req, res) {
    const {id} = req.body;
    if(!id)
        res.json("Fill in all the data", 400);
    else {
        const rows = await db.query(`SELECT * FROM ads WHERE building_id LIKE ${id}`);
        if(rows.length == 0)
            res.json({msg:"No result"}, 404)
        else
            res.json({msg:"Success",data:rows}) 
        }
});

router.post('/getAll', async function(req, res) {
    const rows = await db.query(`SELECT * FROM ads`);
        if(rows.length == 0)
            res.json({msg:"No result"}, 404)
        else
            res.json({msg:"Success",data:rows}) 
        }
)

router.post('/delete', async function(req, res) {
    const {id} = req.body;
    if(!id)
        res.json("Fill in all the data", 400)
    else {
        const rows = await db.query(`DELETE FROM ads WHERE ad_id LIKE ${id}`);
        res.json({msg:"Success"})
    }
})

router.post('/add', async function(req, res) {
    const { id, floor, texture, owner } = req.body;
    if (!id || !floor || !texture || !owner)
        res.json({msg:"Fill in all the data"}, 400);
    else {
        const rows = await db.query(`SELECT * FROM ads WHERE building_id = ${id} AND floor = ${floor}`);
        if(rows.length != 0)
            res.json({msg:"Already exists"}, 409)
        else{
            await db.query(`INSERT INTO ads VALUES (NULL, ${id}, ${floor},'${texture}','${owner}')`);
            res.json({msg:"Success"})
        }
        
    }
});

module.exports = router;
