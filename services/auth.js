const db = require('./db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { decode } = require('querystring');


async function login(email, pass, expires, admin){
    var rows = "";
    if(!admin)
        rows = await db.query(`SELECT user_id, salt, password FROM users WHERE email LIKE '${email}'`);
    else 
        rows = await db.query(`SELECT user_id, salt, password FROM users WHERE email LIKE '${email}' AND isAdmin = 1`);

    if(rows.length != 1)
        return("Account not found")
    if(rows[0].password == hashPassword(pass, rows[0].salt)){
        const user = {
            id: rows[0].user_id,
            email: rows[0].email,
            admin:admin
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

async function verify(token, admin){
    var verified, decode;
        const v = jwt.verify(token, process.env.jsonkey, function(err, decoded) {
            if(err != null)
                verified = false;
            else{
                decode = decoded;
                if(admin){
                    if(decoded.admin)
                        verified = true;
                    else
                        verified = false;
                } else
                verified = true;

            }
        });
        return {authenticated:verified, data:decode};
}

function hashPassword(password, salt){
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    
}

function generateSalt(){
    return crypto.randomBytes(16).toString('hex');
}

function generatePReset(email){
    const user = {
        email: email,
    };
    var jwtt = jwt.sign(user, process.env.jsonkey, {expiresIn: "1d"});
    return `<h1> Unreal Kingdoms </h1> <br> Password reset has been activated on your account. Link to set a new one: <a href="https://dashboard.unrealkingdoms.com/reset?j=${jwtt}">https://dashboard.unrealkingdoms.com/reset?j=${jwtt}</a>`
}

module.exports = {
    login,
    register,
    verify,
    generatePReset,
    generateSalt,
    hashPassword
}
