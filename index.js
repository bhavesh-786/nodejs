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
    //console.log(rows.length, 1)
    // Calculate average score
    //const totalScores = rows.reduce((acc, row) => acc + row.G1, 0);
    //console.log(totalScores)
    //const averageScore = totalScores / rows.length;

    res.json({
      "code": 200,
      "message": "success",
      "data": rows,
      //"g1_avg": averageScore
    })
  });
});

// Define a route for calculating average scores
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

    res.json({ averageScore1, averageScore2, averageScore3 });
  });

  //db.close();
});

// Define a route for analyzing performance by gender
app.get('/api/performance-by-gender', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var sql = "SELECT sex, AVG(studytime) AS averageScore FROM performancedata GROUP BY sex"

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

    res.json({ performanceByGender: rows });
  });
});
