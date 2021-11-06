const Matric = require("../models/Matrics");

const addMatric = (req, res) => {
  const matric = req.body.matric;
  Matric.findOne({ matric })
    .then((result) => {
      if (result) {
        res
          .status(400)
          .json({ success: false, message: "This Matric no is already on the database" });
        return;
      }

      let newMatric = new Matric({ matric });
      newMatric.save().then((mat) => {
        res.status(201).json({ success: true, result: mat });
      });
      return;
    })
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, message: "There's an error while handling your request", error })
    );
};

const getAllMatric = (req, res) => {
  Matric.find(req.query)
    .then((result) => {
      res.status(200).json({ success: true, result });
    })
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, message: "There's an error while handling your request", error })
    );
};

const getAMatric = (req, res) => {
  Matric.findById(req.params.id)
    .then((result) => {
      if (!result) {
        res.status(404).json({ success: false, message: "This Matric no is not found" });
        return;
      }
      res.status(200).json({ success: true, result });
      return;
    })
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, message: "There's an error while handling your request", error })
    );
};

const deleteMatric = (req, res) => {
  Matric.deleteOne({ _id: req.params.id })
    .then((result) => res.status(200).json({ success: true, result }))
    .catch((error) =>
      res.status(500).json({ success: false, message: "Matric no can't be deleted" })
    );
};

module.exports = { addMatric, getAllMatric, getAMatric, deleteMatric };
