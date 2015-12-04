// 141104 - bbbTemp.js - read and send ARM 335x on-board temperature

console.log('bbbTemp started');

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);// we'll listen on the app's port
var fs = require('fs');
var bb = require('bonescript');

app.listen(8888);
io.sockets.on('connection', onConnect);

var htmlPage = 'bbbTemp.html';
function handler (req, res) {
  fs.readFile(htmlPage,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading file: ' + htmlPage);
      }
      res.writeHead(200);
      res.end(data);
    });
} 

function onConnect(socket) {
	console.log('Connected');
}

setInterval(readTemperature,1000)   

//Sensor Locations on the BeagleBone Black
var temperatureLocation = '/sys/devices/ocp.3/44e10448.bandgap/temp1_input';

// Reads temperature
function readTemperature(){
    //console.log("Reading temperature")
    bb.readTextFile(temperatureLocation, sendTemperature); 
}

// Prints Temperature
function sendTemperature(x) {
    x.data /= 1000;
    console.log("Sending temperature: "+x.data)
    io.sockets.emit('temperature', '{"temperature":"'+x.data+'"}');
}