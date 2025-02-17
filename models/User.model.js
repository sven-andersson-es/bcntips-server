const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, "Email is required."],
			unique: [true, "The user already exists."],
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required."],
		},
		firstName: {
			type: String,
			required: [true, "First name is required."],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required."],
		},
		favouriteTips: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tip",
			},
		],
		userRole: {
			type: String,
			required: [true, "A role has to be assigned to the user."],
			enum: [
				"USER",
				"EDITOR",
				"ADMIN",
				"SUPERADMIN"
			],
			default: "USER",
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;

