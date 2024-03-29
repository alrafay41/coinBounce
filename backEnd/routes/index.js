const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/test", (req, res) => res.json({ msg: "working" }));

//it will be a mess if we write logic of login and register here, so we create a seprate folder of controller, and inside controller folder, we create authController.js file.
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
