const prisma = require("../models/prismaClient");

const getAllPosts = async (req, res) => {
    try {
        const user = req.user;

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                isAdmin: true,
            },
        });

        if (!userData || !userData.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const posts = await prisma.post.findMany({
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
        console.error("Error fetching posts ", err);
        res.status(500).json({ message: "Error fetching posts" });
    }
};

const getPostById = async (req, res) => {

    try {
        const user = req.user;

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                isAdmin: true,
            },
        });

        if (!userData || !userData.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const postId = req.params.id;

        if (!postId) return res.status(400).json({ message: "Post id is required" });

        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
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
        console.error("Error fetching post ", err);
        res.status(500).json({ message: "Error fetching post" });
    }
};

const createPost = async (req, res) => {
    try {
        const user = req.user;

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                isAdmin: true,
            },
        });

        if (!userData || !userData.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const { title, description } = req.body;

        await prisma.post.create({
            data: {
                title,
                message: description,
                authorId: user.id,
            },
        });

        res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
        console.error("Error creating post ", err);
        res.status(500).json({ message: "Error creating post" });
    }
};

const deletePostById = async (req, res) => {
    try {
        const user = req.user;

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                isAdmin: true,
            },
        });

        if (!userData || !userData.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const postId = parseInt(req.params.id);

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await prisma.post.delete({
            where: { id: postId }
        });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post", err);
        res.status(500).json({ message: "Error deleting post" });
    }
};

const publishPost = async (req, res) => {
    try {
        const user = req.user;

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                isAdmin: true,
            },
        });

        if (!userData || !userData.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const postId = parseInt(req.params.id);

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await prisma.post.update({
            where: { id: postId },
            data: { isPublished: true },
        });
        res.status(200).json({ message: "Post published successfully" });
    } catch (err) {
        console.error("Error publishing post", err);
        res.status(500).json({ message: "Error publishing post" });
    }
};

const unpublishPost = async (req, res) => {
    try {
        const user = req.user;

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                isAdmin: true,
            },
        });

        if (!userData || !userData.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        const postId = parseInt(req.params.id);

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await prisma.post.update({
            where: { id: postId },
            data: { isPublished: false },
        });
        res.status(200).json({ message: "Post unpublished successfully" });
    } catch (err) {
        console.error("Error unpublishing post", err);
        res.status(500).json({ message: "Error unpublishing post" });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    deletePostById,
    publishPost,
    unpublishPost
};