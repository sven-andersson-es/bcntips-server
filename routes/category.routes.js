const express = require("express");
const router = express.Router();

// Require the Cohort model in order to interact with the database
const Category = require("../models/Category.model");

// Require middleware for authentication
const {
	isAuthenticated,
	authorize,
} = require("../middleware/jwt.middleware.js");

//C R U D
router.post("/categories", authorize(["ADMIN", "SUPERADMIN"]), (req, res, next) => {
	//To-do Validate and send correct message to error handling
	Category.create({
		categoryName: req.body.categoryName,
    	categoryIcon: req.body.categoryIcon,
	})
		.then((createdCategory) => {
			res.status(201).json(createdCategory);
		})
		.catch((error) => {
			//This is one way of handling the errors, the other option would be to do it before creating the object, similar to the user creation on auth.routes.js
			// if (error.code === 11000) {
			//     next("Duplicated entry")

			// }
			console.log(error);
			next("Error when creating the Category");
		});
});

//Get all Categories
router.get("/categories", (req, res, next) => {
	Category.find({})
		.then((allCategories) => {
			res.status(200).json(allCategories);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting all Categories");
		});
});

// Get Category by CategoryId
router.get("/categories/:categoryId", (req, res, next) => {
	Category.findById(req.params.categoryId)
		.then((category) => {
			res.status(200).json(category);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting the Category");
		});
});

//Update Category
router.put("/categories/:categoryId", authorize(["ADMIN", "SUPERADMIN"]), (req, res, next) => {
	Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true }) // {new:true} updates the response we send to the frontend. without it, the visual part is updated too, but the response is not
		.then((category) => {
			res.status(200).json(category);
		})
		.catch((error) => {
			console.log(error);
			next("Error when updating the Category");
		});
});

//Delete a Category
router.delete("/categories/:categoryId", authorize(["ADMIN", "SUPERADMIN"]), (req, res, next) => {
	Category.findByIdAndDelete(req.params.categoryId)
		.then((category) => {
			res.status(204).json(category);
		})
		.catch((error) => {
			console.log(error);
			next("Error when deleting the Category");
		});
});

module.exports = router;
