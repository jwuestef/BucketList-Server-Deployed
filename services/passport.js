
// Add in the neccessary modules, the User model, and the config/secret
var passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var LocalStrategy = require("passport-local");
var User = require("../models/user");  // Has mongoose inside it, no need to require it here too
var config = require("../config");




// Create local strategy
// Keep in mind that when we sign in, it’s a post request to /signin. 
// We are posting an email and a password. 
// By default, the local strategy looks at the request body and handles it for us. 
// It expects an email and username. After local strategy parses request and pulls out the email and pw, it hands it to us in callback.
var localOptions = {usernameField: "email"};

var localLogin = new LocalStrategy(localOptions, function(email, password, done) {

	User.findOne({email: email}, function(err, foundUser) {
		// Err is populated only if the search fails for some DB reason, outside of a user simply not existing
		if(err) {
			return done(err);
		};

		// If we didn't get a foundUser back, then return null-error and authenticated-false
		if(!foundUser) {
			return done(null, false);
		};

		// If we DID find a matching user with said email... now we need to compare the hashed passwords
		// We created a .comparePassword method on all User objects inside models/user.js
		foundUser.comparePassword(password, function(err, isMatch) {
			// If there was an error, return early
			if(err){ 
				return done(err);
			};

			// If isMatch is false (so !isMatch is true), then return "false - they didn't match up"
			if(!isMatch) {
				return done(null, false);
			};

			// If we get to this point, no errors and it's the same.
			// Return null-error and the foundUser
			return done(null, foundUser);
		});


	});

});


// Tell passport to use our fancy login function
passport.use(localLogin);




// Initialize the jwtOptions
var jwtOptions = {
	// This line tells where to get the token from in a request. Here it is extracted from a Header section called authorization
	jwtFromRequest: ExtractJwt.fromHeader("authorization"),
	// This line says that we need to get a secret key from our config file
	secretOrKey: config.secret
};


// Create jwt strategy
// Payload parameter is the decoded jwt token. It corresponds to data gleaned from the createUserToken function in auth.js from sub & iat.
var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// Uses mongoose method findById to search User database for the "sub" property (the user.id from auth.js)
	User.findById(payload.sub, function(err, foundUser) {
		// Err is populated only if the search fails for some DB reason, outside of a user simply not existing
		if(err) {
			return done(err, false);
		};

		if(foundUser) {
			// If we can find the user, pass it to the callback - they ARE authenticated
			done(null, foundUser);
		} else {
			// If we didn't get a foundUser back, then return null-error and authenticated-false
			done(null, false);
		};
	});
});


// Tell passport to use our fancy authentication function
passport.use(jwtLogin);