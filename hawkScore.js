var express = require('express');
var NodeCache = require( "node-cache" );
var request = require('request');
var exphbs  = require('express-handlebars');
var gameMap = require('./gamesHash.js');

var app = express();
var hbs = exphbs.create({ /* config */ });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'views');

var myCache = new NodeCache( { stdTTL: 5, checkperiod: 120 } );

function updateCache(){
	try {
		
		var data = [];

		data['gameInfo'] = gameMap.week("2");

		request('http://www.nfl.com/liveupdate/scorestrip/ss.json', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	data['gameScores'] = body;
		  	myCache.set( "hawkScore", data , 10000 );
		  }
		});

	} catch(error){console.log(error);}
}

//
myCache.on( "expired", function( key, value ){
    updateCache();
});

//
myCache.get( "hawkScore", function( err, value ){
    if( err || value == undefined){
    	updateCache();
    }
});

//
app.get('/', function (req, res) {

	myCache.get( "hawkScore", function( err, value ){
	    if( err || value == undefined){
	        value = "empty";
	    }   
	    console.log(value);
	    res.render('home', { nflData : value });
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
});