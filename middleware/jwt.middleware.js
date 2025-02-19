const { expressjwt: jwt } = require("express-jwt");
const User = require("../models/User.model");

// Basic authentication to see that the user is logged in and to verify JWT from Frontend
const isAuthenticated = jwt({
	secret: process.env.TOKEN_SECRET,
	algorithms: ["HS256"],
	requestProperty: "payload",
	getToken: getTokenFromHeaders,
});

// Authenticate that the user is logged in and has the correct role provided in the middleware callback in the routes
const authorize = (roles) => {
	// roles param can be a single role string (e.g.  'USER')
	// or an array of roles (e.g. ["USER", "ADMIN"] )
	if (typeof roles === "string") {
		roles = [roles];
	}

	return [
		// authenticate JWT token and attach user to request object (req.user)
		isAuthenticated,
		// authorize based on user role
		(req, res, next) => {
			const _id = req.payload._id;
			User.findById({ _id }).then((user) => {
				console.log(user);

				if (roles.length && !roles.includes(user.userRole)) {
					// user's role is not authorized
					return res.status(401).json({ message: "Unauthorized" });
				}
				// authentication and authorization successful
				next();
			});
		},
	];
};

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
	// Check if the token is available on the request Headers
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		// Get the encoded token string and return it
		const token = req.headers.authorization.split(" ")[1];
		return token;
	}

	return null;
}

// Export the middleware so that we can use it to create protected routes
module.exports = {
	isAuthenticated,
	authorize,
};
