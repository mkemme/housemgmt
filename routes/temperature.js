var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./temper.sqlite');

module.exports = function(req, res){
  res.setHeader("Content-Type", "application/json");  

  var measurement = {};

  var p1 = new Promise( function (resolve, reject) {
    db.get("select min(temperature) minimum, max(temperature) maximum from temperature where date(measured_at) = date('now');", 
      function (err, row) { resolve({ lowTemperature: row.minimum, highTemperature: row.maximum }) });
    });

  var p2 = new Promise( function (resolve, reject) {
    db.get("select temperature from temperature order by measured_at desc limit 1;", 
      function (err, row) { resolve({actualTemperature : row.temperature}); });
    });

  p1.then(function (m1) {
    p2.then(function (m2) {
      measurement = m1;
      measurement.actualTemperature = m2.actualTemperature;
      db.close();
      res.send(measurement);
    })
  });


  
};
