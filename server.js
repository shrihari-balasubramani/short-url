// server.js
// where your node app starts

// init project
var express = require('express');
var app = express(),
    fs     = require('fs'),
    Busboy = require('busboy'),
    db = require('./db'),
	  UrlIDMappingSchema = require('./UrlIDMappingSchema'),
    path = require('path');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('view engine', 'hbs');
// http://expressjs.com/en/starter/basic-routing.html

app.get('/new/*',function(req,res, next){
	var urlMatch =/^http[s]+\:\/\/([0-9a-z]+\.){1,}[0-9a-z]{1,}(\/.*)*$/,
		urlProvided = decodeURIComponent(req.params[0]);
	if(urlMatch.exec(urlProvided) == null){
		res.json({error:"Wrong url format, make sure you have a valid protocol and real site."});
		return;
	}
	UrlIDMappingSchema.count({}, function(err, c) {
		if(!err){
			//converting the code to hexadecimal number so the length of id will be maintained short
			var oldKey = parseInt(c.toString(16),16),
				genKey = ++oldKey,
				urlMappingJson = {shortId:genKey,url:urlProvided},
				urlIDMappingSchema = new UrlIDMappingSchema(urlMappingJson);
				urlIDMappingSchema.save();				
				res.json({ "original_url": urlProvided,"short_url": req.headers.host+ "/"+genKey});
      return;
		}else{
			res.json({error:"Something went wrong our side. Sorry"});
			return;
		}
	});
});

app.get('/:shortId',function(req,res, next){	
	UrlIDMappingSchema.findOne({shortId: req.params.shortId}, function(err,mappingObj) { 
		console.log(err,mappingObj); 
		if(!err && mappingObj){
			res.redirect(mappingObj.url);
		}else{
			res.json({noSuchShortId:"noSuchShortId"})
		}
	});
});
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
