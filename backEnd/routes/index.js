const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/auth");

router.get("/test", (req, res) => res.json({ msg: "working" }));

//it will be a mess if we write logic of login and register here, so we create a seprate folder of controller, and inside controller folder, we create authController.js file.
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", auth, authController.logout);

// also we will create a router for refresh token
router.get("/refreshToken", authController.refresh);

//blogs

// create
router.post("/blog", auth, blogController.create);

//get all
router.get("/blog/all", auth, blogController.getAll);

//get by ID
router.get("blog/:id", auth, blogController.getById);

//update
router.put("/blog", auth, blogController.update);

//delete
router.delete("blog/:id", auth, blogController.delete);

//comments

//create

router.post("/comment", auth, commentController.create);

//getById

router.get("/comment/:id", auth, commentController.getById);

module.exports = router;
