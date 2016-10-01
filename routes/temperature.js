var sqlite3 = require('sqlite3');

module.exports = function(req, res){
  res.setHeader("Content-Type", "application/json");  
  var db = new sqlite3.Database('./temper.sqlite', sqlite3.OPEN_READONLY);

  var measurement = {};

  var p1 = new Promise( function (resolve, reject) {
    db.get("select min(temperature) minimum, max(temperature) maximum from temperature where date(measured_at) = date('now');", 
      function (err, row) { 
        if (err) { 
          reject( { error: err } );
        } else {
          resolve({ lowTemperature: Math.round(row.minimum), highTemperature: Math.round(row.maximum) });
        };
      }
    );
  });

  var p2 = new Promise( function (resolve, reject) {
    db.get("select temperature from temperature order by measured_at desc limit 1;", 
      function (err, row) { 
        if (err) { 
          reject( { error: err } );
        } else {
          resolve({ actualTemperature : Math.round(row.temperature) }); 
        }
      }
    );
  });

  p1.then(function (m1) {
    p2.then(function (m2) {
      measurement = m1;
      measurement.actualTemperature = m2.actualTemperature;
      measurement.updatedAt = new Date();
      db.close();
      res.send(measurement);
    })
  })
  .catch( function (reason) {
    db.close();
    res.send(reason);
  });
  
};
