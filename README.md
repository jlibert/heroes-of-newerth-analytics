# heroes-of-newerth-api

This is a screen scraper for the Heroes of Newerth official website (http://www.heroesofnewerth.com/).

_The aim is to not break should Newerth add new characters and items._

## Objectives:
To obtain character and item data for testing **hero builds** outside of gameplay.

## How does it work?
* App scrapes Hero and Item data, from the Heroes of Newerth official website and writes it to a MySQL database, so as to ensure offline functionality (WIP)
* WIP

## Prerequisites:
* npm
* MySQL

## Tests:
Coming Soon!

## Directory:

    ├── config
    │   └── database.js
    ├── hon.js
    ├── package.json
    ├── public
    │   ├── css
    │   │   └── bootstrap.min.css
    │   └── js
    │       ├── app.js
    │       ├── controllers.js
    │       ├── directives.js
    │       ├── filters.js
    │       ├── lib
    │       │   ├── angular
    │       │   ├── bootstrap
    │       │   └── jquery
    │       └── services.js
    ├── README.md
    ├── routes
    │   ├── api.js
    │   ├── index.js
    │   └── partials.js
    ├── spec
    │   └── scrape-spec.js
    └── views
        ├── index.jade
        ├── layout.jade
        └── partials
        └── dashboard.jade
        
## Contributing:
1. Fork it ( [jlibert/heroes-of-newerth-api](https://github.com/jlibert/heroes-of-newerth-api) )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License:
MIT