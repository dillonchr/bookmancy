const test = require('tape');
const { JSDOM } = require('jsdom');
const responseTransformer = require('../src/abe/response-transformer');

test('abe -> response-transformer', t => {
    t.plan(7);
    JSDOM.fromFile('tests/response-transformer.results-fixture.html')
        .then(dom => responseTransformer(dom.window.document))
        .then(r => {
            t.equals(2, r.length);
            t.equals('5.00', r[0].price);
            t.equals('1965', r[0].year);
            t.equals('dummy-about-text', r[0].about);
            t.equals('3.95', r[0].shipping);
            t.equals(null, r[0].image);
            //    test removing the no-book-image class
            //    actual value is prefixed for real link /shrug
            t.equals(true, r[1].image.length > 0);
        });
});

test('abe -> response-transformer -> fails', t => {
    t.plan(1);
    JSDOM.fromFile('tests/response-transformer.no-results-fixture.html')
        .then(dom => responseTransformer(dom.window.document))
        .then(r => {
            t.equals(0, r.length);
        });
})
