var express = require("express");
var app = express();

// get MongoDB object modeling tool - mongoose
var mongoose = require('mongoose');

// get RESTful API service router
var rest_router = require("./routes/rest");

// connect to remote database
mongoose.connect('mongodb://sc-user:123456@ds247587.mlab.com:47587/sharecode-db');

app.use("/api/v1", rest_router);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
})

