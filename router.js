// Import authorization middleware
var Auth = require("./controllers/auth");
// Import our bucket list functionality
var BucketList = require("./controllers/bucketlistcontroller");

// Import our passport authentication middleware
var passportService = require("./services/passport");
// Import passport functionality
var passport = require("passport");


// MIDDLEWARE
// By default the .authenticate method wants to make a cookie. 
// Since we’re using jwt, we don’t want a cookie. Hence, we set the first parameter to ‘jwt’ and the second to this: {session: false}.
var requireAuth = passport.authenticate("jwt", {session: false});
// Use the local strategy for signing in
var requireSignin = passport.authenticate("local", {session: false});




module.exports = function(app) {

	app.post("/api/signup", Auth.signup);
	app.post("/api/signin", requireSignin, Auth.signin);
	app.post("/api/newitem", requireAuth, BucketList.addBucketList);
	app.get("/api/items", requireAuth, BucketList.fetchBucketLists);
	app.get("/api/items/:id", requireAuth, BucketList.fetchBucketList);
	app.put("/api/items/:id", requireAuth, BucketList.updateBucketList);
	app.delete("/api/items/:id", requireAuth, BucketList.deleteBucketList);

};