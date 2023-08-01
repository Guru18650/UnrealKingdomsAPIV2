const db = require('./db');

async function get(email){
    const rows = await db.query(`SELECT uk_coin, dg_coin, cc_coin FROM users WHERE email LIKE '${email}'`);
    if(rows.length != 1)
        return("Account not found");
    return(rows[0]);
}

async function exchange(email, from, to, value){
    const v = await db.query(`SELECT ${from}_coin FROM users WHERE email LIKE '${email}'`);
    const t = await db.query(`SELECT ${to}_coin FROM users WHERE email LIKE '${email}'`);
    if(v[0][from+"_coin"] < value )
        return "Not enough currency"
    const fromRate = await db.query(`SELECT value FROM exchange_rates WHERE currency LIKE '${from}'`);
    const toRate = await db.query(`SELECT value FROM exchange_rates WHERE currency LIKE '${to}'`);
    const finalValue = Number(value)*(Number(fromRate[0].value)/Number(toRate[0].value));
    await db.query(`UPDATE users SET ${from}_coin='${Number(v[0][from+"_coin"])-Number(value)}' WHERE email LIKE '${email}'`);
    await db.query(`UPDATE users SET ${to}_coin='${Number(t[0][to+"_coin"])+Number(finalValue)}' WHERE email LIKE '${email}'`);
    return("Success");
}

async function transfer(email, value){
    const v = await db.query(`SELECT uk_coin FROM users WHERE email LIKE '${email}'`);
    if(v.length!=1)
        return("Account not found");
    else{
        const final = Number(v[0].uk_coin)+Number(value);
        await db.query(`UPDATE users SET uk_coin='${final}' WHERE email LIKE '${email}'`);
        return("Success");
    }
}

module.exports = {
    get,
    exchange,
    transfer
}