var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "../sqlite/StudentsPerformance.db"

let db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err)
    }
    console.log('connected to student database');
});


module.exports = db