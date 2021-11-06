const express = require("express");
const { regAuthorization, authorization, adminAuth } = require("../configs/auth");

const {
  checkMatric,
  registerUser,
  loginUser,
  getAllAccount,
  getAnAccount,
  updateUser,
  deleteUser,
} = require("../services/user.service");
const router = express.Router();

// Get All Users
router.get("/", getAllAccount);

//Get Only One User
router.get("/:id", getAnAccount);

// Check if Matric No. Exist
router.post("/checkmatric", checkMatric);

// Register Account
router.post("/register", regAuthorization, registerUser);

// Login Account
router.post("/login", loginUser);

// Update User Account || Account owner and Admin
router.patch("/:id", authorization, updateUser);

// Delete User Account only by Admin
router.delete("/:id", adminAuth, deleteUser);

module.exports = router;
