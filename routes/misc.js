const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.post('/download', async function(req, res) {
    const rows = await db.query(`SELECT * from adresses WHERE adress_name LIKE 'uklink'`);
    res.json({msg:"Success", data:rows[0]});
})

module.exports = router;