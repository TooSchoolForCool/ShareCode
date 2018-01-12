var MongoProblemModel = require('../models/problemModel');

function getProblems() {
  return new Promise((resolve, reject) => {
    // in {} we can define the query, if empty, indicates find all data
    MongoProblemModel.find({}, function (err, problems) {
      if(err) {
        reject(err);
      }
      else {
        resolve(problems);
      }
    });
  });
}

// function getProblem (id) {
//   return new Promise(function (resolve, reject) {
//     resolve(problems.find(function (prob) {
//       return prob.id === id;
//     }));
//   });
// }

function getProblem (id) {
  return new Promise((resolve, reject) => {
    // in javascript, query could be {id : id} because JS will
    // ignore the single quotes
    MongoProblemModel.findOne({ 'id' : id }, function (err, problem) {
      if(err) {
        // Database error
        reject(err);
      }
      else {
        // note: if db cannot find target problem, it will return null
        resolve(problem);
      }
    });
  });
}

// add new problem to remote database
var addProblem = function (new_problem) {
  return new Promise((resolve, reject) => {
    MongoProblemModel.findOne({ 'name' : new_problem.name }, function (err, problem) {
      if(problem) {
        // duplicate problem name
        reject('Problem Name already exists.');
      }
      else {
        MongoProblemModel.count({}, function(err, cnt) {
          new_problem.id = cnt + 1;
          // create new model which embed this new problem
          var mongo_prob = new MongoProblemModel(new_problem);
          // save to remote database
          mongo_prob.save();
          resolve(new_problem);
        });
      }
    });
  });
};

// export function
module.exports = {
  getProblems: getProblems,
  getProblem: getProblem,
  addProblem: addProblem
};