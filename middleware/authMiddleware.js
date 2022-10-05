const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password') // .select('-password') will exclude the password as it is not needed here

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({message: 'not authorized'})
        }
    }

    if (!token) {
        res.status(401).json({ message: 'not authorized, no token'})
    }
}

module.exports = { protect }