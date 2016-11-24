let jsdom = require('jsdom');
let transformApiResponse = require('./response-transformer');

module.exports = url => {
  return new Promise((resolve, reject) => {
    jsdom.env(url, (err, window) => {
      if(!err) {
        let results = transformApiResponse(window.document);
        console.log(`loaded up ${results.length} results`);
        resolve(results);
      } else {
        console.log('nope', err);
        reject(err);
      }
    });
  });
};
