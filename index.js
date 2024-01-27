var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});


/**
 * To Fetch table component data
 * set total count
 * set male count
 * set female count
 */

app.get("/api/users", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  var sql = "select * from performancedata"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    if (rows.length === 0) {
      // Handle case when there are no scores in the database
      res.status(404).json({ error: 'No scores found' });
      return;
    }

    length = rows.length;
    var Male = 0;
    var Female = 0;

    for (var i = 0; i < length; i++) {
      if (rows[i].sex == 'F') {
        Male += 1;
      } else {
        Female += 1;
      }
    }

    res.json({
      "code": 200,
      "message": "success",
      "data": rows,
      'count': rows.length,
      'male': Male,
      'female': Female
      //"g1_avg": averageScore
    })
  });
});


/**
 * Calculate average of G1, G2, G3
 * 
 */
app.get('/api/average-score', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var sql = "select G1, G2, G3 from performancedata"

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'No scores found' });
      return;
    }

    var total1 = 0
    var total2 = 0
    var total3 = 0
    length = rows.length;

    for (var i = 0; i < length; i++) {
      total1 += parseFloat(rows[i].G1);
      total2 += parseFloat(rows[i].G2);
      total3 += parseFloat(rows[i].G3);
    }

    //const totalScore = rows.map((acc, row) => acc + row.score, 0);
    const averageScore1 = total1 / rows.length;
    const averageScore2 = total2 / rows.length;
    const averageScore3 = total3 / rows.length;

    res.json({ "data": { 'G1': averageScore1, 'G2': averageScore2, 'G3': averageScore3 } });
  });
});

/**
 * Define a route for analyzing performance by gender
 */
app.get('/api/performance-by-gender', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var sql = "SELECT sex, AVG(studytime) AS averageScore FROM performancedata GROUP BY sex"

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'No data found' });
      return;
    }

    res.json({ performanceByGender: rows });
  });
});

/**
 * Define data for Line chart
 */
app.get('/api/graphData', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var sql = "SELECT count(*) as count, sex FROM performancedata group by sex"

  // Assuming you have a 'students' table with a 'gender' column
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'No data found' });
      return;
    }

    length = rows.length;
    var G1 = [];
    var G2 = [];
    var G3 = [];

    for (var i = 0; i < length; i++) {
      G1.push(rows[i].count);
      G2.push(rows[i].sex);
      //G3.push(rows[i].G3);
    }

    res.json({ "code": 200, 'count': G1, 'gender': G2, 'G3': G3 });
  });
});

/**
 * Define data for Bar chart
 */
app.get('/api/graphDataTwo', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var sql = "SELECT count(*) as count, Fjob FROM performancedata group by Fjob"

  // Assuming you have a 'students' table with a 'gender' column
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'No data found' });
      return;
    }

    length = rows.length;
    var G1 = [];
    var G2 = [];

    for (var i = 0; i < length; i++) {
      G1.push(rows[i].count);
      G2.push(rows[i].Fjob);
    }

    res.json({ "code": 200, 'count': G1, 'job': G2 });
  });
})
