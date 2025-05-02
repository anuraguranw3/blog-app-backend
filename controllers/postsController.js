const prisma = require("../models/prismaClient");

const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { isPublished: true },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts,
        })
    } catch (err) {
        console.log("Error fetching posts ", err);
        res.status(500).json({ message: "Error fetching posts" });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) return res.status(400).json({ message: "Post id is required" });

        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(postId),
                isPublished: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        if (!post) return res.status(404).json("Post not found");

        res.status(200).json({
            message: "Post fetched successfully",
            data: post,
        })
    } catch (err) {
        console.log("Error fetching post ", err);
        res.status(500).json({ message: "Error fetching post" });
    }
};

const addComment = async (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ message: "Comment is required" });
    }

    try {
        await prisma.comment.create({
            data: {
                comment,
                authorId: req.user.id,
                postId: parseInt(req.params.id),
            }
        });
        res.status(200).json({ message: "Comment added successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

const getAllCommentsByPost = async (req, res) => {
    const postId = req.params.id;
    if (!postId) {
        return res.status(400).json({ message: "Invalid or missing post ID" });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        res.status(200).json({
            message: "Fetched comments successfully",
            data: comments
        });
    } catch (err) {
        console.error("Failed to fetch comments: ", err);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    addComment,
    getAllCommentsByPost
};