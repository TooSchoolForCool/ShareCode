var mongoose = require('mongoose');

var ProblemSchema = mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  difficulty: String
});

// other file will use problemModel for DB operations
var problemModel = mongoose.model('ProblemModel', ProblemSchema);

module.exports = problemModel;

