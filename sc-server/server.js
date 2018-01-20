var express = require("express");
var app = express();

var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var socket_service = require('./services/socketService')(io);


// get MongoDB object modeling tool - mongoose
var mongoose = require('mongoose');

// get RESTful API service router
var rest_router = require("./routes/rest");

// add webpage indexing router
var client_index_router = require("./routes/index");

// connect to remote database
mongoose.connect('mongodb://sc-user:123456@ds247587.mlab.com:47587/sharecode-db');

// enable webpage route router
app.use('/', client_index_router);
// all static webpage data, reading from ../client-dist/
// a static web page is that if requested webpage could be found directly,
// then just use it. Otherwise, go to other router
app.use(express.static(path.join(__dirname, '../client-dist/')));

// enable api router
app.use("/api/v1/", rest_router);

// let client handle other routing path (excepts '/' and '/api/v1/')
app.use( function(req, res) {
  res.sendFile("index.html", {root: path.join(__dirname, '../client-dist/')});
});

server.listen(3000, function(){
  console.log('ShareCode listening on port: 3000');
});

// var http = require('http');
// var socket_io = require('socket.io');
// var io = socket_io();
// var socket_service = require('./services/socketService')(io);

// start server (this part we do NOT use express-way start server)
// because we need to support both express and socket_io
// var server = http.createServer(app);
// io.attach(server);
// server.listen(3000);
//
// server.on('error', onError);
// server.on('listening', onListening);
//
// function onError(error) {
//   console.error(error);
// }
//
// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr == 'string' ? 'pipe ' + addr : 'port ' + addr.port;
//   console.log('ShareCode Server Listening on ' + bind);
// }
