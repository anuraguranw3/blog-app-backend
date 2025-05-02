const {Router} = require("express");
const usersController = require("../controllers/usersController");
const { authenticateToken } = require("../jwt/jwtFunc");

const usersRouter = Router();

usersRouter.post("/signup", usersController.userSignUp);
usersRouter.get("/me", authenticateToken, usersController.getUserInfo);
usersRouter.post("/login", usersController.userLogin);
usersRouter.post("/logout", usersController.userLogout);

module.exports = usersRouter;