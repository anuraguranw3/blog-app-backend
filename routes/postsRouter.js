const {Router} = require("express");
const postsController = require("../controllers/postsController");
const { authenticateToken } = require("../jwt/jwtFunc");

const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.get("/:id", postsController.getPostById);
postsRouter.get("/:id/comments", postsController.getAllCommentsByPost);
postsRouter.post("/:id", authenticateToken, postsController.addComment);

module.exports = postsRouter;