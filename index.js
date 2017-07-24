
// REQUIRING MODULES
// ==================================================
require("dotenv").config();
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var router = require("./router");
var mongoose = require("mongoose");
var cors = require("cors");



// BASIC CONFIG & DATABASE CONNECTION
// ==================================================

// This variable will allow us to access all the good things express has to offer and create an instance of express.
var app = express();

// DB connection
mongoose.connect("mongodb://admin:admin@ds053206.mlab.com:53206/bucketlist");

// DB connection events
	// When successfully connected
	mongoose.connection.on("connected", function () {  
		console.log("Mongoose connected to database");
	}); 

	// If the connection throws an error
	mongoose.connection.on("error",function (err) {  
		console.log("Mongoose default connection error: " + err);
	}); 

	// When the connection is disconnected
	mongoose.connection.on("disconnected", function () {  
		console.log("Mongoose default connection disconnected"); 
	});

	// If the Node process ends, close the Mongoose connection 
	process.on("SIGINT", function() {  
		mongoose.connection.close(function () { 
			console.log("Mongoose default connection disconnected through app termination"); 
			process.exit(0); 
		}); 
	}); 




// MIDDLEWARE
// ==================================================

// Cors is a middleware on the Express side. This is going to allow users to make requests from other ports and domains.
app.use(cors());

// BodyParser is used for parsing incoming JSON requests. Remember that JSON comes in as one humongous string. 
// BodyParser helps take it out of that stringified format and puts it into parsed code.
app.use(bodyParser.json({type: '*/*'})); 

// Calls the router.js file, passing the instance of express to it
// This is where we handle all the routing
router(app);










// SERVER STARTUP
// ==================================================

// If there's an environment variable defined, use it. If not, use 3000.
var port = process.env.PORT || 3000;

// The http library is a native node library and is used for low level http requests. This line creates a node server.
// We can pass in our express app into the createServer function express application by passing in the app variable from above.
var server = http.createServer(app);

// Get our server to listen to any requests from the outside world. 
// We’ll add the console message to say that the server is up and running.
server.listen(port, function() {
	console.log("Server listening on port " + port);
});