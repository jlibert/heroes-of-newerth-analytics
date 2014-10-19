# heroes-of-newerth-analytics

This is ~~a screen scraper~~ an app, for analysis of heroes, for the Heroes of Newerth official website (http://www.heroesofnewerth.com/).

_The aim is to not break should Newerth add new characters and items._

![alt tag](https://github.com/jlibert/heroes-of-newerth-analytics/blob/master/hon.png)

## Objectives:
To obtain character and item data for testing **hero builds** outside of gameplay.

## How does it work?
* App scrapes Hero and Item data, from the Heroes of Newerth official website and writes it to a MySQL database, so as to ensure some offline functionality.
* App allows users to simulate a hero build that they would have otherwise had to do during gameplay (can be a bit difficult if you are a beginner).

## Prerequisites:
* npm
* MySQL

## Tests:
Change the baseUrl variable in each spec file spec/\*-spec.js and run unit tests with `npm`
    
    npm test   

## Directory:

    .
    ├── config
    │   └── database.js
    ├── hon.js
    ├── package.json
    ├── public
    │   ├── css
    │   │   ├── bootstrap.min.css
    │   │   └── ng-table.css
    │   └── js
    │       ├── app.js
    │       ├── controllers.js
    │       ├── database.js
    │       ├── directives.js
    │       ├── filters.js
    │       ├── lib
    │       │   ├── angular
    │       │   ├── bootstrap
    │       │   ├── html5shiv.min.js
    │       │   ├── jquery
    │       │   └── respond.min.js
    │       └── services.js
    ├── README.md
    ├── routes
    │   ├── api.js
    │   ├── index.js
    │   └── partials.js
    ├── spec
    │   └── database-spec.js
    └── views
        ├── index.jade
        ├── layout.jade
        └── partials
            ├── dashboard.jade
            └── hero.jade
        
## Contributing:
1. Fork it ( [jlibert/heroes-of-newerth-analytics](https://github.com/jlibert/heroes-of-newerth-analytics) )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License:
MIT