const test = require('tape')
const abe = require('../src/abe/search-abe')

test('check that abe lookup works', t => {
    t.plan(2)
    abe({author: "Capote",title: "In Cold Blood",publisher: "Random House",year: 1965}, (err, res) => {
        t.equals(!err, true)
        t.equals(res && res.results && res.results.length > 0, true)
    })
})

