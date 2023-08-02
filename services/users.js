const db = require('./db');
const jwt = require('jsonwebtoken');

async function checkEmail(email) {
    const rows = await db.query(`SELECT email FROM users WHERE email LIKE '${email}'`);
    if(rows.length==0)
        return false;
    else
        return true;
}

async function checkUsername(username) {
    const rows = await db.query(`SELECT username FROM users WHERE username LIKE '${username}'`);
    if(rows.length==0)
        return false;
    else
        return true;
}

async function userinfo(decoded) {
    const rows = await db.query(`SELECT email, username FROM users WHERE user_id LIKE ${decoded.id}`)
    if(rows.length==0)
        return "No player found";
    else
        return {email:rows[0].email, username:rows[0].username}
}

module.exports = {
    checkEmail,
    checkUsername,
    userinfo
}