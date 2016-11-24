# Bookmancy
> a **brilliant** new way to search for book prices

## Overview
Bookmancy is a self-sufficient node app that delivers a mobile friendly gui to quickly, and concisely search `abebooks.com` search results.

## Use
* `npm install`
* `npm start`
* Go to `localhost:3000/`

## `/search.json`
GETting this URL will trigger the search. Following are the supported querystring parameters.

`title <string>`
The title of the Bookmancy

`author <string>`
The author or editor of the book. Basically anything that a seller would potentially put as the author.

`publisher <string>` he name of the publisher

`year <number>` Four digit maximum year

## Coming soon
The gui part. Heh.
