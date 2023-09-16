const mysql = require('mysql2/promise');

async function query(sql, params) {
    var db = await mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        multipleStatements: false
    });
    const [res,] = await db.execute(sql, params);
    db.end()
    return res;
}

module.exports = {
    query
}