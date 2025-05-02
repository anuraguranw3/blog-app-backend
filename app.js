require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/usersRouter");
const cors = require("cors");
const postsRouter = require("./routes/postsRouter");
const adminPostsRouter = require("./routes/adminPostsRouter");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(","); 

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "from home" });
});

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.use("/api/admin/posts", adminPostsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("listening on port 3000");
});