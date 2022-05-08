const express = require("express");
const postController = require("../controllers/postController");
const protect = require('../middleware/authMiddleware')

const router = express.Router()

/*
    We can add protect middleware to the route simply by passing it as a
    param in front of the controller. If the user is authorized we move on 
    to the next middleware or in this case the controller 
*/
router.route("/")
    .get(postController.getAllPosts)
    .post(protect, postController.createPost);

router.route("/:id")
    .get(postController.getOnePost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost);

module.exports = router;