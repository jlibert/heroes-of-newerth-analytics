/* Module Dependencies */
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    routes = require('./routes'),
    partials = require('./routes/partials'),
    api = require('./routes/api'),
    configDB = require('./config/database.js');
    http = require('http'),
    path = require('path');

var app = module.exports = express();

/**
* MySQL - create connection pool
*/
app.use(myConnection(mysql, configDB.dbOptions, 'pool'));

/* Configurations */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/* Routes */
app.use('/', routes);
app.use('/partials', partials);

// JSON API
app.use('/api', api);

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res, next){
  res.render('index');
});

app.use('*', function(req, res, next){
  res.render('index');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
