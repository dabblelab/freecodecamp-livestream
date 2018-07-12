var fs = require('fs');
var qaData = require('../data/answers.json');

var qa = function () { };

qa.prototype.getQuestionById = function (id) {

  return new Promise(function (resolve, reject) {

    var results = qaData.filter(function (x) {
      return (x.id === id);
    });

    if (results.length > 0) {
      resolve(results);
    } else {
      let value =  [
        {
            "answer": "Sorry, I could not find an answer to your question.",
            "prompt": "I'll try to get an answer to your question. Please ask again later."
        }       
      ]
      resolve(value);
    }
  
  });

}

module.exports = new qa();