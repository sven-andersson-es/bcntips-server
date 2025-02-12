const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const barrioSchema = new Schema(
  {
    barrioName: { type: String, unique: true, required: true },
    mapPolygon: { type: String, unique: false, required: false },
  },
  { timestamps: true }
);

const Barrio = mongoose.model("Barrio", barrioSchema);

module.exports = Barrio;