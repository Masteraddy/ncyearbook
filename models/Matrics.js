const mongoose = require("mongoose");

const MatricSchema = new mongoose.Schema({
  matric: { type: Number, required: true, unique: true },
});

const Matric = mongoose.model("matric", MatricSchema);

module.exports = Matric;
