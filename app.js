var express = require('express');
var cfenv = require('cfenv');
var morgan=require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var pruebaRutas=require('./public/js/Routes/routesWex');
var app = express();
const server = require('http').createServer(app);
var appEnv = cfenv.getAppEnv();
//WEBHOOK FACE
'use strict';


// trust first proxy 
app.set('trust proxy', 1) ;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


//ver peticiones
app.use(morgan('dev'));
app.use("/mesaAyuda",pruebaRutas);

//WEBHOOK FACE
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => { 
	let body = req.body;  
	// Checks this is an event from a page subscription
	if (body.object === 'page') {  
	  // Iterates over each entry - there may be multiple if batched
	  body.entry.forEach(function(entry) {  
		// Gets the message. entry.messaging is an array, but 
		// will only ever contain one message, so we get index 0
		let webhook_event = entry.messaging[0];
		console.log(webhook_event);
	  });
	  // Returns a '200 OK' response to all requests
	  res.status(200).send('EVENT_RECEIVED');
	} else {
	  // Returns a '404 Not Found' if event is not from a page subscription
	  res.sendStatus(404);
	}  
  });
///

// start server on the specified port and binding host
server.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});



