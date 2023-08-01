const db = require('./db');

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

module.exports = {
    checkEmail,
    checkUsername
}