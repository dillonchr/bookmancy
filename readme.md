# Bookmancy

## Overview
Bookmancy is a small module to scrape `abebooks.com` search results and ebay book search results for consumption in a node environment.

## Install
`npm i @dillonchr/bookmancy`


## *`abe`* - AbeBooks search

### *`abe({author, title, publisher, format, year, includeUrl})`*
* `title` - *String* - The title of the book
* `author` - *String* - The author or editor of the book. Basically anything that a seller would potentially put as the author.
* `publisher` - *String* - The name of the publisher
* `format` - *String* - options include [hardback, hardcover, softcover, paperback, h, p]
* `year` - *Number* - Four digit year, filters books published `<=year`
* `includeUrl` - *Boolean* - optional, will append a url prop to the response object for continuing the search manually

#### Returns
```javascript
{
    results: [
        <BookResult>...
    ]
}
```

#### Example
```javascript
const bookmancy = require('bookmancy');
bookmancy.abe({author: 'August Derleth', publisher: 'Mycroft'}, (err, data) => {
    console.log(err || data.results.length);
});
```

#### Returns (with `includeUrl: true` option)
```javascript
{
    url: 'https://abebooks...',
    retults: [
        <BookResult>...
    ]
}
```


## *ebay* - ebay Search
## REQUIRES ebay API key
All ebay requests take place with their actual API. So you will [need to register](https://developer.ebay.com/join/) to add an application and get your keys. Once you have your key you will need to be sure to include the key in your project's `.env` file:
```
EBAY_API_KEY=xxxxxxxxxxxxxxxxxxx
```

Failure to include this key will result in all search calls throwing an error highlighting that this step must be completed.

### *`ebay({author, title, publisher, year, sold, live})`*
* `title` - *String* - The title of the book
* `author` - *String* - The author or editor of the book. Basically anything that a seller would potentially put as the author.
* `publisher` - *String* - The name of the publisher
* `year` - *Number* - Four digit year, filters books published `<=year`
* `sold` - *Boolean* - search for sold listings
* `live` - *Boolean* - search for live listings

Note: `author`, `title`, `publisher`, `year` will be joined with spaces and searched against the API. eBay doesn't have a way to search for specific authors, titles, publishers, or publication years.

The `sold` and `live` properties are booleans. If you omit both, then the results returned will be from both sold and live listing searches. Otherwise whichever ones are true will be searched and returned.

#### Returns
```javascript
{
    results: [
        <BookResult>...
    ]
}
```

#### Example
```javascript
const bookmancy = require('bookmancy');
bookmancy.ebay({author: 'August Derleth', publisher: 'Mycroft'}, (err, data) => {
    console.log(err || data.results.length);
});
```

## *`BookResult`* - Not available on export, but is the structure for results from both searches
* `about` - *String* - The description from the listing
* `price` - *String* - Unformatted price
* `shipping` - *String|Null* - Unformatted shipping price
* `image` - *String|Null* - URL for photo
* `year` - *String|Null* - Year work was published in listing
* `sold` - *Boolean* - (ebay only) if listing sold or is no longer for sale
* `url` - *String* - URL to view item listing
* `date` - *Timestamp* - (ebay only) when listing/auction expires
