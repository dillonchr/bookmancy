# Bookmancy
> a **brilliant** new way to search for book prices

## Overview
Bookmancy is a self-sufficient node app that delivers a mobile friendly gui to quickly, and concisely search `abebooks.com` search results.

## Use
* `npm install`
* `npm start`
* Go to `localhost:3000/`

## */search.json*
`GET`ting this URL will trigger the search. Following are the supported querystring parameters.

* `title` - *String* - The title of the Bookmancy
* `author` - *String* - The author or editor of the book. Basically anything that a seller would potentially put as the author.
* `publisher` - *String* - The name of the publisher
* `year` - *Number* - Four digit maximum year

## Coming soon
The gui part. Heh.
