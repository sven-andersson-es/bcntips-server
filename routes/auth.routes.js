const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require middleware for authentication
const {
	isAuthenticated,
	authorize,
} = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Function to limit possible user roles that can be assigned by user role update
const assignRole = (role) => {
	let roleObject = { userRole: "USER" };
	switch (role) {
		case "USER":
			roleObject = { userRole: "USER" };
			break;
		case "EDITOR":
			roleObject = { userRole: "EDITOR" };
			break;
		case "ADMIN":
			roleObject = { userRole: "ADMIN" };
			break;
		default:
			roleObject = { userRole: "USER" };
			break;
	}
	return roleObject;
};

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
	const { email, password, firstName, lastName, favouriteTips } = req.body;

	// Check if email or password or name are provided as empty strings
	if (email === "" || password === "" || firstName === "" || lastName === "") {
		res
			.status(400)
			.json({ message: "Provide email, password, first and last name" });
		return;
	}

	// This regular expression check that the email is of a valid format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if (!emailRegex.test(email)) {
		res.status(400).json({ message: "Provide a valid email address." });
		return;
	}

	// This regular expression checks password for special characters and minimum length
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
	if (!passwordRegex.test(password)) {
		res.status(400).json({
			message:
				"Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter.",
		});
		return;
	}

	// Check the users collection if a user with the same email already exists
	User.findOne({ email })
		.then((foundUser) => {
			// If the user with the same email already exists, send an error response
			if (foundUser) {
				res.status(400).json({ message: "User already exists." });
				return;
			}

			// If email is unique, proceed to hash the password
			const salt = bcrypt.genSaltSync(saltRounds);
			const hashedPassword = bcrypt.hashSync(password, salt);

			// Create the new user in the database
			// We return a pending promise, which allows us to chain another `then`
			return User.create({
				email,
				password: hashedPassword,
				firstName,
				lastName,
				favouriteTips,
			});
		})
		.then((createdUser) => {
			// Deconstruct the newly created user object to omit the password
			// We should never expose passwords publicly
			const { email, firstName, lastName, favouriteTips, _id } = createdUser;

			// Create a new object that doesn't expose the password
			const user = { email, firstName, lastName, favouriteTips, _id };

			// Send a json response containing the user object
			res.status(201).json({ user: user });
		})
		.catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// PUT  /auth/password - Change password
router.put("/users/password", isAuthenticated, (req, res, next) => {
	console.log(req.payload._id);
	const password = req.body.password;
	const authUser = req.payload._id;

	// Check if email or password or name are provided as empty strings
	if (password === "") {
		res.status(400).json({ message: "Provide a password" });
		return;
	}

	// This regular expression checks password for special characters and minimum length
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
	if (!passwordRegex.test(password)) {
		res.status(400).json({
			message:
				"Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter.",
		});
		return;
	}

	const salt = bcrypt.genSaltSync(saltRounds);
	const hashedPassword = bcrypt.hashSync(password, salt);

	User.findByIdAndUpdate(
		authUser,
		{ password: hashedPassword },
		{
			new: false,
		}
	)
		.then((user) => {
			console.log(user);
			res.status(200).json({ message: "Your password has been updated" });
		})
		.catch((error) => {
			console.log(error);
			next("Error when updating the password");
		});
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
	const { email, password } = req.body;

	// Check if email or password are provided as empty string
	if (email === "" || password === "") {
		res.status(400).json({ message: "Provide email and password." });
		return;
	}

	// Check the users collection if a user with the same email exists
	User.findOne({ email })
		.then((foundUser) => {
			if (!foundUser) {
				// If the user is not found, send an error response
				res.status(401).json({ message: "Check your username or password." });
				return;
			}

			// Compare the provided password with the one saved in the database
			const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

			if (passwordCorrect) {
				// Deconstruct the user object to omit the password
				const { _id, email, firstName, userRole, favouriteTips } = foundUser;

				// Create an object that will be set as the token payload
				const payload = { _id, email, firstName, userRole, favouriteTips };

				// Create a JSON Web Token and sign it
				const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
					algorithm: "HS256",
					expiresIn: "6h",
				});

				// Send the token as the response
				res.status(200).json({ authToken: authToken, firstName: firstName });
			} else {
				res.status(401).json({ message: "Unable to authenticate the user." });
			}
		})
		.catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
	// If JWT token is valid the payload gets decoded by the
	// isAuthenticated middleware and is made available on `req.payload`
	console.log(`req.payload`, req.payload);

	// Send back the token payload object containing the user data
	res.status(200).json(req.payload);
});

// Get User by Userid
router.get("/users/:userId", isAuthenticated, (req, res, next) => {
	User.findById(req.params.userId)
		.populate({ path: "favouriteTips", select: "_id title" })
		.then((user) => {
			// We should never expose passwords publicly
			const { email, firstName, lastName, favouriteTips, _id, userRole } = user;

			// Create a new object that doesn't expose the password
			const responseUser = {
				email,
				firstName,
				lastName,
				favouriteTips,
				_id,
				userRole,
			};
			// Get the user id from the isAuthenticated payload
			const authUser = req.payload._id;
			// Verify that the user authenticated user is the same as the one being requested
			if (authUser !== req.params.userId) {
				// If the user is not found, send an error response
				res.status(401).json({ message: "User doesn't match." });
				return;
			}

			res.status(200).json(responseUser);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting the Users");
		});
});

router.put(
	"/users/roles/:userId",
	authorize(["SUPERADMIN"]),
	(req, res, next) => {
		console.log(req.params.userId, req.body.userRole);

		User.findByIdAndUpdate(req.params.userId, assignRole(req.body.userRole), {
			new: true,
		}) // {new:true} updates the response we send to the frontend. without it, the visual part is updated too, but the response is not
			.then((user) => {
				console.log(user);
				res.status(200).json(user.userRole);
			})
			.catch((error) => {
				console.log(error);
				next("Error when updating the User");
			});
	}
);

router.get("/favourites", isAuthenticated, (req, res, next) => {
	const { _id } = req.payload;
	User.findById({ _id })
		.then((user) => {
			const { favouriteTips } = user;
			const response = {
				favouriteTips,
			};
			res.status(200).json(response);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting the Favourites");
		});
});

// Add a new favourite
router.put("/favourites/:tipId", isAuthenticated, (req, res, next) => {
	const { _id } = req.payload;
	const tipId = new mongoose.Types.ObjectId(`${req.params.tipId}`);
	console.log(tipId);

	User.findById({ _id }).then((user) => {
		const { favouriteTips } = user;
		const editMode = favouriteTips.find((tip) => {
			return tip.toString() === tipId.toString();
		});
		let updatedFavouriteTips;
		// if editMode = true then it means the id exists and we want to remove it, else other way around
		if (editMode) {
			updatedFavouriteTips = favouriteTips.filter((tip) => {
				return tip.toString() != tipId.toString();
			});
		} else {
			favouriteTips.push(tipId);
			updatedFavouriteTips = favouriteTips;
		}

		User.findByIdAndUpdate(
			_id,
			{ favouriteTips: updatedFavouriteTips },
			{
				new: true,
			}
		)
			.then((user) => {
				//console.log(user);
				res.status(200).json(user.favouriteTips);
			})
			.catch((error) => {
				console.log(error);
				next("Error when adding the favourite");
			});
	});
});

module.exports = router;
