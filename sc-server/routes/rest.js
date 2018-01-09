var express = require("express");

var router = express.Router();

var problem_service = require("../services/problemService");

var body_parser = require('body-parser');
var json_parser = body_parser.json();

// handle HTTP GET request
router.get('/problems', function(req, res) {
  problem_service.getProblems()
    .then(problems => res.json(problems));
});

router.get('/problems/:id', function(req, res) {
  var id = req.params.id;
  problem_service.getProblem(+id)
    .then(problem => res.json(problem));
});

router.post('/problems', json_parser, function(req, res) {
  // json_parser will convert req.params into a json body
  problem_service.addProblem(req.body)
    .then(function (problem) {
      res.json(problem);
    })
    .catch(function (msg) {
      res.status(400).send(msg);
    });
});

module.exports = router;
