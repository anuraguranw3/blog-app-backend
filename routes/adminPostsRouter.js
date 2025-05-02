const {Router} = require("express");
const adminPostsController = require("../controllers/adminPostsController");
const { authenticateToken } = require("../jwt/jwtFunc");

const adminPostsRouter = Router();

adminPostsRouter.get("/", authenticateToken, adminPostsController.getAllPosts);
adminPostsRouter.get("/:id", authenticateToken, adminPostsController.getPostById);
adminPostsRouter.post("/", authenticateToken, adminPostsController.createPost);
adminPostsRouter.delete("/:id", authenticateToken, adminPostsController.deletePostById);
adminPostsRouter.patch("/:id/publish", authenticateToken, adminPostsController.publishPost);
adminPostsRouter.patch("/:id/unpublish", authenticateToken, adminPostsController.unpublishPost);

module.exports = adminPostsRouter;