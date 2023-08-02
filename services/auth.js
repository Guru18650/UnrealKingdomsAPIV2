const db = require('./db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


async function login(email, pass, expires){
    const rows = await db.query(`SELECT user_id, salt, password FROM users WHERE email LIKE '${email}'`);
    if(rows.length != 1)
        return("Account not found")
    if(rows[0].password == hashPassword(pass, rows[0].salt)){
        const user = {
            id: rows[0].user_id,
            email: rows[0].email
        };
        return {jwt:jwt.sign(user, process.env.jsonkey, {expiresIn: expires})};
    }
    else
        return('Account not found');
}

async function register(email, pass, username){
    const rows = await db.query(`SELECT * FROM users WHERE email LIKE '${email}' OR username LIKE '${username}'`);
    if(rows.length > 0)
        return "Account with email or username like this exists"
    const salt = generateSalt();
    const password = hashPassword(pass, salt);
    await db.query(`INSERT INTO users (user_id, username, password, salt, email) VALUES (NULL,'${username}','${password}','${salt}','${email}')`);
    return "Success";
}

async function verify(token){
    try {
        const v = jwt.verify(token, process.env.jsonkey);
        return {authenticated: "true"}
    } catch (error) {
        return {authenticated: "false"}
    }
}

function hashPassword(password, salt){
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

function generateSalt(){
    return crypto.randomBytes(16).toString('hex');
}

module.exports = {
    login,
    register,
    verify
}
