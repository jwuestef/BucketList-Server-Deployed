
// Import the user model
var User = require("../models/user");

// Import JWT module and the secret
var jwt = require("jwt-simple");
var config = require("../config");




function createUserToken(user) {
	// Get the current time
	var timestamp = new Date().getTime();
	// Using JSON Web Token package, we encode the user's id and the issued-at timestamp, encoded/mixed with the secret.
	return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
};




exports.signup = function(req, res, next) {


	// Pull variables out of the signup request
	var email = req.body.email;
	var password = req.body.password;

	// Make sure both fields are filled in
	if(!email || !password) {
		return res.status(400).send({error: "You must provide both and email and password"});
	};

	// Goes through the database attempting to find one instance of a specific email address. 
	// So it will look through all users and see if a user with the given email exists.
	User.findOne({email: email.toLowerCase()}, function(err, foundExistingUser) {

		if(err) {
			return next(err);
		};

		if(foundExistingUser) {
			return res.status(418).send("Email is already in use");   // status 409 is "conflict"
		};

		// Create a new user with said information
		var newUser = new User({
			email: email,
			password: password
		});

		// Saves the new user to the database
		newUser.save(function(err) {
			if(err) {
				return next(err);
			};
			// User successfully created - return a valid JWT created with our function above
			res.json({token: createUserToken(newUser)});
		});

	});


}




exports.signin = function(req, res, next) {

	// User has already had their email and password authenticated
	// We just need to give them a token

	res.send({token: createUserToken(req.user) });
	
};