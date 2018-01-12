var express = require("express");

var router = express.Router();

var problemService = require("../services/problemService");

var body_parser = require('body-parser');
var json_parser = body_parser.json();

// handle HTTP GET request
router.get('/problems', function(req, res) {
  problemService.getProblems()
    .then(problems => res.json(problems));
});

router.get('/problems/:id', function(req, res) {
  var id = req.params.id;
  problemService.getProblem(+id)
    .then(problem => res.json(problem))
    .catch(function (err) {
      res.status(400).send(err);
    });
});

// need body parser here, convert object into a json
router.post('/problems', json_parser, function(req, res) {
  // req.body now is a json
  problemService.addProblem(req.body)
    .then(function (problem) {
      res.json(problem);
    })
    .catch(function (error_msg) {
      res.status(400).send(error_msg);
    });
});

module.exports = router;
