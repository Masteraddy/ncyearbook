const express = require("express");
const jwt = require("jsonwebtoken");
const { adminAuth } = require("../configs/auth");
const Matric = require("../models/Matrics");
const { addMatric, getAllMatric, getAMatric, deleteMatric } = require("../services/matric.service");
const router = express.Router();

//Only an admin usertype can access this routes

// Add matric no
router.post("/", adminAuth, addMatric);

// Get all registered matric no
router.get("/", adminAuth, getAllMatric);

// Get a matric no with ID
router.get("/:id", adminAuth, getAMatric);

// Delete a matric no by ID
router.delete("/:id", adminAuth, deleteMatric);

module.exports = router;
