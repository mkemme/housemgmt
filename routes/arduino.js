
/*
 * GET measurements.json
 */

"use strict";

var portDevice = '/dev/ttyUSB0'

var SerialPort = require('serialport2').SerialPort;
var port = new SerialPort();
var dataChunk = "";
var readOneMessageOnly = false;  // Set to TRUE if you want to read only one JSON string. If set to FALSE, will read continuously.

var measurements = "{\"dummy\" : 100 }";;

// Listens to received data logs out line by line
port.on('data', function(data) {
  data = data.toString();
  var endOfStringIndex = data.indexOf(String.fromCharCode(0x0a));
  if (endOfStringIndex > -1) {
    dataChunk = dataChunk + data.substr(0,endOfStringIndex);
    measurements = dataChunk;
    dataChunk = data.substr(endOfStringIndex, data.length);
    if (readOneMessageOnly) {
      port.close();
    }
  } else {
    dataChunk = dataChunk + data;
  }
});

port.on('error', function(err) {
  console.log("Error: " + err);
});

// console.log("Starting...");

port.open(portDevice, {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1
}, function(err) {
  // console.log("Port is now open!");
  // port.close();
});

exports.measurements = function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.send(measurements);
};