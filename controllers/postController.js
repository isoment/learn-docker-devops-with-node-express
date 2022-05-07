const Post = require("../models/postModel");

/**
 *  Get an index of all posts
 */
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        // In the response include the status, results count and data
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: {
                posts
            }
        });
    } catch(e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

/**
 *  Get a single post by id which is passed in through the URL
 *  http://localhost:3000/posts/:id
 */
exports.getOnePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        });
    } catch(e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

/**
 *  Create a new post
 */
exports.createPost = async (req, res, next) => {
    try {
        // Express json middleware is required for this
        const post = await Post.create(req.body);
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        });
    } catch(e) {
        console.log(e);
        res.status(400).json({
            status: "fail"
        })
    }
}

/**
 *  Update an existing post
 */
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            // Returns the modified document
            new: true,
            // Validates the update against the schema
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        });
    } catch(e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

/**
 *  Delete a post
 */
 exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        });
    } catch(e) {
        res.status(400).json({
            status: "fail"
        })
    }
}