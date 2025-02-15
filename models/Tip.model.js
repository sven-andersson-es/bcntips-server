const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tipSchema = new Schema(
	{
		title: { type: String, required: true, unique: [true, "The title already exists"],   },
		introText: { type: String, required: true },
		bodyText: { type: String, required: false },
		street: { type: String, required: false },
		streetNo: { type: String, required: false },
		zip: { type: String, required: false },
		city: { type: String, required: false },
		mapPlaceId: { type: String, required: false, unique: true },
		mapLat: { type: Schema.Types.Decimal128, required: false },
		mapLng: { type: Schema.Types.Decimal128, required: false },
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		barrio: {
			type: Schema.Types.ObjectId,
			ref: "Barrio",
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "Author",
		},
	},
	{ timestamps: true }
);

const Tip = mongoose.model("Tip", tipSchema);

module.exports = Tip;
