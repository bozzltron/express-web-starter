
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongo = require('mongodb')
  , requirejs = require('requirejs')
  , db;

var app = express();

app.configure(function(){
  app.use(express.compress());
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());

  // Development Mongo Connection
  db = new mongo.Db('db_name', new mongo.Server("127.0.0.1", 27017, {}));
});

app.configure('production', function(){

  // Production Mongo Connection
  db = mongo.connect('mongodb://username:password@server:dbname');

});

// Create references to the database
app.set('db', db);
db.open(function(err, p_db) {

  // Listen with app.on('mongo_connected', function(db){ // some mongo transaction });
  app.emit('mongo_connected', db); 
});

// Optmize JavaScript
var config = {
    baseUrl: 'assets/js/',
    name: 'main',
    out: 'public/main-built.js'
};

requirejs.optimize(config, function (buildResponse) {
  //buildResponse is just a text output of the modules
  //included. Load the built file for the contents.
  //Use config.out to get the optimized file contents.
  var contents = fs.readFileSync(config.out, 'utf8');
  console.log("JavaScript optimized");
});

// Optmize CSS
var config = {
    cssIn: 'assets/css/main.css',
    out: 'public/main-built.css',
    optimizeCss: 'standard'
};

requirejs.optimize(config, function (buildResponse) {
  //buildResponse is just a text output of the modules
  //included. Load the built file for the contents.
  //Use config.out to get the optimized file contents.
  var contents = fs.readFileSync(config.out, 'utf8');
  console.log("CSS optimized");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
