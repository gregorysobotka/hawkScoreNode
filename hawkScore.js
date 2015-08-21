var express = require('express');
var NodeCache = require( "node-cache" );
var request = require('request');
var exphbs  = require('express-handlebars');
var gameMap = require('./gamesHash.js');

var app = express();
var hbs = exphbs.create({ /* config */ });
var myCache = new NodeCache({ stdTTL: 5, checkperiod: 120 } );

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use('/assets', express.static(__dirname + '/assets'));

function updateCache(){

	try {

		var data = [],
			hawkScoreData = {},
			parsedData;

		request('https://www.nfl.com/liveupdate/scorestrip/ss.json', function (error, response, body) {

			if (!error && response.statusCode == 200) {
				//
				parsedData = JSON.parse(body);
				data['gameScores'] = parsedData;

				if(typeof parsedData.gms !== 'undefined'){
					//
					var currentGame;
					for(var i=0;i<parsedData.gms.length;i++){
						currentGame = parsedData.gms[i];
						if(currentGame.vnn === "Seahawks" || currentGame.hnn === "Seahawks"){
							hawkScoreData = {
								seahawkScore : (currentGame.vnn === "Seahawks") ? currentGame.vs : currentGame.hs,
								enemyScore : (currentGame.hnn === "Seahawks") ? currentGame.vs : currentGame.hs,
								enemyName : currentGame.vnn,
								day : currentGame.d,
								time : currentGame.t
							}
						}
					}
				}

				// Set cache data
				myCache.set( "scores", data , 10000 );
				myCache.set( "hawkScore", hawkScoreData , 10000 );

			}
		});

	} catch(error){
		console.log(error);
	}
}

//
myCache.on( "expired", function( key, value ){
	updateCache();
});

//
myCache.get( "scores", function( err, value ){
	if( err || value == undefined){
		updateCache();
	}
});

//
app.get('/', function (req, res) {
	res.render('home',{
		pageId : "home",
		modules : ["score","playByPlay"]
	});
});

//
app.get('/api/v1/scores', function (req, res) {
	myCache.get( "scores", function( err, value ){
		if( err || value == undefined){
			value = "empty";
		}
		res.json(value.gameScores);
	});
});

//
app.get('/api/v1/hawkScores', function (req, res) {
	myCache.get( "hawkScore", function( err, value ){
		if( err || value == undefined){
			value = "empty";
		}
		res.json(value);
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
});