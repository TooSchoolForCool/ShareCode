var express = require("express");
var router = express.Router();
var path = require("path");

router.get('/', function(req, res) {
  res.sendFile("index.html", {root: path.join(__dirname, '../../client-dist/')});
});

module.exports = router;