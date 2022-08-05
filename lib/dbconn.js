const mysql = require('mysql');
require('dotenv').config()

//connection to database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    insecureAuth: true
})

db.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        return console.log('connected to database')
    }
});

module.exports = db;