var express = require("express");
var app = express();

var path = require('path');

// init server
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

