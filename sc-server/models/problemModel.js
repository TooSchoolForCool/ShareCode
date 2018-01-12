var mongoose = require('mongoose');

// mongoose requrie us define a schema, which define the model
// data structure.
var ProblemSchema = mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  difficulty: String
});

// other file will use problemModel for DB operations
var problemModel = mongoose.model('ProblemModel', ProblemSchema);

// export problem model, so that other files could use this model
module.exports = problemModel;

