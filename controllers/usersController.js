const prisma = require("../models/prismaClient");
const bcrypt = require("bcryptjs");
const jwtFunc = require("../jwt/jwtFunc");

const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true }
        });

        if (!user) {
            return res.status(404).json("User not found");
        }

        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const userSignUp = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email or username already in use." });
        }

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const token = jwtFunc.generateToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwtFunc.generateToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
        });
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json("Error logging in");
    }

};

const userLogout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.status(200).json({message: "Logout successful"});
};

module.exports = {
    userSignUp,
    getUserInfo,
    userLogin,
    userLogout,
}