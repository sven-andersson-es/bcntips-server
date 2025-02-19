const express = require("express");
const router = express.Router();

// Require the Cohort model in order to interact with the database
const Barrio = require("../models/Barrio.model");

// Require middleware for authentication
const {
	isAuthenticated,
	authorize,
} = require("../middleware/jwt.middleware.js");

//C R U D
router.post("/barrios", authorize(["ADMIN", "SUPERADMIN"]), (req, res, next) => {
	//To-do Validate and send correct message to error handling
	Barrio.create({
		barrioName: req.body.barrioName,
    	mapPolygon: req.body.mapPolygon,
	})
		.then((createdBarrio) => {
			res.status(201).json(createdBarrio);
		})
		.catch((error) => {
			//This is one way of handling the errors, the other option would be to do it before creating the object, similar to the user creation on auth.routes.js
			// if (error.code === 11000) {
			//     next("Duplicated entry")

			// }
			console.log(error);
			next("Error when creating the Barrio");
		});
});

//Get all Barrios
router.get("/barrios", (req, res, next) => {
	Barrio.find({})
		.then((allBarrios) => {
			res.status(200).json(allBarrios);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting all Barrios");
		});
});

// Get Barrio by BarrioId
router.get("/barrios/:barrioId", (req, res, next) => {
	Barrio.findById(req.params.barrioId)
		.then((barrio) => {
			res.status(200).json(barrio);
		})
		.catch((error) => {
			console.log(error);
			next("Error when getting the Barrio");
		});
});

//Update Barrio
router.put("/barrios/:barrioId", authorize(["ADMIN", "SUPERADMIN"]), (req, res, next) => {
	Barrio.findByIdAndUpdate(req.params.barrioId, req.body, { new: true }) // {new:true} updates the response we send to the frontend. without it, the visual part is updated too, but the response is not
		.then((barrio) => {
			res.status(200).json(barrio);
		})
		.catch((error) => {
			console.log(error);
			next("Error when updating the Barrio");
		});
});

//Delete a Barrio
router.delete("/barrios/:barrioId", authorize(["ADMIN", "SUPERADMIN"]), (req, res, next) => {
	Barrio.findByIdAndDelete(req.params.barrioId)
		.then((barrio) => {
			res.status(204).json(barrio);
		})
		.catch((error) => {
			console.log(error);
			next("Error when deleting the Barrio");
		});
});

module.exports = router;
