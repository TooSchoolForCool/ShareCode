var express = require("express");
var app = express();

// get RESTful API service router
var rest_router = require("./routes/rest");

app.use("/api/v1", rest_router);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
})

