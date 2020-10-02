const test = require("tape");
const abe = require("../src/abe/search-abe");
const url = require("../src/abe/url");

test("url builder", t => {
  let result = url({
    author: "Capote",
    title: "In cold blood",
    year: 1965,
    publisher: "Random house",
    format: "h"
  });
  t.plan(1);
  t.equals(
    result,
    "https://www.abebooks.com/servlet/SearchResults?bx=off&ds=50&recentlyadded=all&sortby=17&sts=t&an=Capote&tn=In%20cold%20blood&yrh=1965&pn=Random%20house&bi=h"
  );
});

test("check that abe lookup works", t => {
  t.plan(3);
  abe({ author: "Capote", title: "In cold blood", year: 1965 }, (err, res) => {
    t.equals(!err, true);
    t.equals(res && res.results && res.results.length > 0, true);
    t.equals(
      res.results.length,
      res.results.filter(({ price }) => !isNaN(price)).length
    );
  });
});
