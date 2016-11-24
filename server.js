let request = require('./request-builder');
let urlographer = require('./url-builder');
let express = require('express');
let app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/search.json', (req, res) => {
  request(urlographer(req.query))
    .then(x => res.send(x), err => res.send(err.toString()));
});
app.listen(3000, () => console.log('Location confirmed. Sending supplies.'));
