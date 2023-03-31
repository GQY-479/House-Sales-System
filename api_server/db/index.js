const mysql = require('mysql')
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@gqy4790',
    database: 'housesales'
    // database: 'my_db_01',
})

module.exports = db