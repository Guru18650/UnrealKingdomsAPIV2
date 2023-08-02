
// Import all dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const sanitizer = require("perfect-express-sanitizer");
const https = require("https");
const fs = require('fs');
require('dotenv').config();

var options = {}
if(process.env.usehttps == "true"){
options = {
  key: fs.readFileSync(process.env.httpskey),
  cert: fs.readFileSync(process.env.httpscert)
};}


// Prepare expressJS
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cors());
app.use(sanitizer.clean({xss: true, noSql: true, sql: true, sqlLevel: 5}));

const authRouter = require('./routes/auth');
const coinsRouter = require('./routes/coins');
const usersRouter = require('./routes/users');

// Test database connection
var db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});
console.log('\x1b[32m%s\x1b[0m',"CONNECTED TO DATABASE");

app.get('/', (req, res) => {
    res.send('Unreal kingdoms API, use POST endpoint')
})

app.use("/auth/",authRouter);
app.use("/coins/",coinsRouter);
app.use("/users/",usersRouter);

if(process.env.usehttps == "true"){
    https.createServer(options, app).listen(443, () => {
        console.log('HTTPS Server listening on port 443');
      });
} else {
    console.log(`HTTP Server listening on port ${process.env.httpport}`);
    app.listen(process.env.httpport)
}

  