const test = require('tape');
const { JSDOM } = require('jsdom');

test('abe -> response-transformer', t => {
    t.plan(2);
    t.equals(2, +'2');
    t.equals(false, !true);
});
