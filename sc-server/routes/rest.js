var express = require("express");

var router = express.Router();
var problem_service = require("../services/problemService");

// handle HTTP GET request
router.get('/problems', function(req, res) {
  problem_service.getProblems()
    .then(problems => res.json(problems));
});

module.exports = router;
