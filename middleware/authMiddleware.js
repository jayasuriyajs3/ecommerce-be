const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("decoded=", decoded);
        // Normalize to req.userData with id for controllers expecting this shape
        req.userData = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = auth;