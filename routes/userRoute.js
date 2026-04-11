const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");



// Register User
router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Retrive User
router.get("/details", verify, userController.retrieveUser);

// Update User as Admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setUserAsAdmin);

// Update Password
router.patch("/update-password", verify, userController.updatePassword);














module.exports = router;    