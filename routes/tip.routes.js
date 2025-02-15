const express = require("express");
const router = express.Router();

// Require the Cohort model in order to interact with the database
const Tip = require("../models/Tip.model");

//C R U D
router.post("/tips", (req, res, next) => {
	//To-do Validate and send correct message to error handling
	Tip.create({
		title: req.body.title,
		introText: req.body.introText,
		bodyText: req.body.bodyText,
		street: req.body.street,
		streetNo: req.body.streetNo,
		zip: req.body.zip,
		city: req.body.city,
		mapPlaceId: req.body.mapPlaceId,
		mapLat: req.body.mapLat,
		mapLng: req.body.mapLng,
		category: req.body.category,
		barrio: req.body.barrio,
		user: req.body.user,
	})
		.then((createdTip) => {
			res.status(201).json(createdTip);
		})
		.catch((error) => {
			//This is one way of handling the errors, the other option would be to do it before creating the object, similar to the user creation on auth.routes.js
			// if (error.code === 11000) {
			//     next("Duplicated entry")

			// }
			console.log(error);
			next("Error when creating the Tip");
		});
});

//Get all Tips
router.get("/tips", (req, res, next) => {
	Tip.find({})
		.populate(["category", "barrio", "user"])
		.then((allTips) => {
			res.status(200).json(allTips);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting all Tips");
		});
});

// Get Tip by tipId
router.get("/tips/:tipId", (req, res, next) => {
	Tip.findById(req.params.tipId)
		.populate(["category", "barrio", "user"])
		.then((tip) => {
			res.status(200).json(tip);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting the Tip");
		});
});

//Update Tip
router.put("/tips/:tipId", (req, res, next) => {
	Tip.findByIdAndUpdate(req.params.tipId, req.body, { new: true }) // {new:true} updates the response we send to the frontend. without it, the visual part is updated too, but the response is not
		.then((tip) => {
			res.status(200).json(tip);
		})
		.catch((error) => {
			console.log(error);
			next("Error when updating the tip");
		});
});

//Delete a Tip
router.delete("/tips/:tipId", (req, res, next) => {
	Tip.findByIdAndDelete(req.params.tipId)
		.then((tip) => {
			res.status(204).json(tip);
		})
		.catch((error) => {
			console.log(error);
			next("Error when deleting the tip");
		});
});

module.exports = router;
