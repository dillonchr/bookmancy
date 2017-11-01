# Bookmancy
> a **brilliant** new way to search for book prices

## Overview
Bookmancy is a small module to scrape `abebooks.com` search results for consumption in a node environment.

## *`search({author, title, publisher, format, year})`*
* `title` - *String* - The title of the book
* `author` - *String* - The author or editor of the book. Basically anything that a seller would potentially put as the author.
* `publisher` - *String* - The name of the publisher
* `format` - *String* - options include [hardback, hardcover, softcover, paperback, h, p]
* `year` - *Number* - Four digit year, filters books published `<=year`

### Returns
```javascript
{
    url: 'https://abebooks...',
    retults: [
        {
            about,
            price,
            shipping,
            image,
            year
        }...
    ]
}
```
* `about` - *String* - The description from the listing
* `price` - *String* - Unformatted price
* `shipping` - *String|Null* - Unformatted shipping price
* `image` - *String|Null* - URL for photo
* `year` - *String|Null* - Year work was published in listing
