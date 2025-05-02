require("dotenv").config;
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "24h"});
    return token;
};

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.authToken;

    if (!token) {
        return res.status(401).json({message: "Access token missing"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({message: "Invalid or expired token"});
    }
};

module.exports = {
    generateToken,
    authenticateToken
}