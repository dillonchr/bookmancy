let request = require('./request-builder');
let urlographer = require('./url-builder');

request(urlographer({author: 'derleth', publisher: 'arkham', year: '1980'}));
