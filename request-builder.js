let jsdom = require('jsdom');
let transformApiResponse = require('./response-transformer');

module.exports = url => {
  jsdom.env(url, (err, window) => {
    if(!err) {
      console.log('yep, got it');
      let results = transformApiResponse(window.document);
      let json = JSON.stringify(results);
      console.log(json);
    } else {
      console.log('nope', err);
    }
  });
};
