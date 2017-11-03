# Bookmancy
> a **brilliant** new way to search for book prices

## Overview
Bookmancy is a small module to scrape `abebooks.com` search results and ebay book search results for consumption in a node environment.

## *`abe`* - AbeBooks search
### Methods

### *`search({author, title, publisher, format, year})`*
* `title` - *String* - The title of the book
* `author` - *String* - The author or editor of the book. Basically anything that a seller would potentially put as the author.
* `publisher` - *String* - The name of the publisher
* `format` - *String* - options include [hardback, hardcover, softcover, paperback, h, p]
* `year` - *Number* - Four digit year, filters books published `<=year`

#### Returns
```javascript
[
    <BookResult>...
]
```

#### Example
```javascript
const bookmancy = require('bookmancy');
bookmancy.abe.search({author: 'August Derleth', publisher: 'Mycroft'})
    .then(results => {

    });
```

### *`searchWithUrlInResponse({author, title, publisher, format, year})`*
Argument options are the same as above, but the resolved value is different. It will include the URL that was scraped in case you wish to actually view the page for yourself in your app.

#### Returns
```javascript
{
    url: 'https://abebooks...',
    retults: [
        <BookResult>...
    ]
}
```

#### Example
```javascript
const bookmancy = require('bookmancy');
bookmancy.abe.searchWithUrlInResponse({author: 'August Derleth', publisher: 'Mycroft'})
    .then(results => {
        
    });
```

## *ebay* - ebay Search
## REQUIRES ebay API key
All ebay requests take place with their actual API. So you will [need to register](https://developer.ebay.com/join/) to add an application and get your keys. Once you have your key you will need to be sure to include the key in your project's `.env` file:
```
EBAY_API_KEY=xxxxxxxxxxxxxxxxxxx
```
Failure to include this key will result in all search calls rejecting with an error highlighting that this step must be completed.

### Methods

### *`search(query)`* - Search both sold and live listings
This will search two APIs. The sold items, and current items API will be merged and sorted by price.
To get specific results use one of the following methods.

* `query` - *String* - Generic query. Best bet for ebay right now. No relevant metrics are tracked/searchable (to my knowledge) in the ebay API.

#### Returns
```javascript
[
    <BookResult>...
]
```

#### Example
```javascript
const bookmancy = require('bookmancy');
bookmancy.ebay.search('August Derleth Mycroft')
    .then(results => {
        
    });
```

### *`searchLiveListings(query)`*
Same as search, but only for current listings. *Caution:* this usually has unrealistically high prices at the top of the list. Usually we use this one to verify a book is hard to come by.

### *`searchSoldListings(query)`*
Same as search, but only for listings that have completed with sales. Note that the price on the result might not necessarily be correct. (e.g. _Buy It Now_ vs. Accepted Offer price) But this generally is good enough to know how popular something is and gives a very good idea of how easy it should be to flip.

## *`BookResult`* - Not available on export, but is the structure for results from both searches
* `about` - *String* - The description from the listing
* `price` - *String* - Unformatted price
* `shipping` - *String|Null* - Unformatted shipping price
* `image` - *String|Null* - URL for photo
* `year` - *String|Null* - Year work was published in listing
* `sold` - *Boolean* - (ebay only) if listing sold or is no longer for sale
* `url` - *String* - URL to view item listing
* `date` - *Timestamp* - (ebay only) when listing/auction expires
