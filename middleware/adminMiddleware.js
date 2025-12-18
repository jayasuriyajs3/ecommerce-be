const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        // Get userId from authMiddleware which sets req.userData (not req.user)
        const userId = req.userData?.id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }
        
        // Fetch user from database
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        
        // User is admin, proceed
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error verifying admin status", error: error.message });
    }
};

module.exports = adminMiddleware;
