const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// @desc    Get users
// @route   GET /api/users
// access   Private
const getUsers = async (req, res) => {
    const users = await User.find()

    res.status(200).json(users)
}

// @desc    Create user
// @route   POST /api/users
// access   Private
const createUser = async (req, res) => {
    const user = await User.create(req.body)

    if (!user) {
        res.status(400).json({message: 'all fields required'})
    }

    res.status(200).json(user)
}

// @desc    Update user
// @route   PUT /api/users/:id
// access   Private
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400).json({message: 'user not found'})
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(updatedUser)
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// access   Private
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400).json({message: `user not found`})
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({message: `${req.params.id} deleted`})
}

// @desc    Register new user
// @route   POST /api/users
// access   Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.status(400).json({message: 'all fields required'})
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400).json({message: 'a user with this email already exists'})
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create a user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({message: 'invalid user data'})
    }
}

// @desc    Authenticate a user 
// @route   POST /api/users/login
// access   Public
const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({message: 'invalid credentials'})
    }
}

// @desc    Get user data
// @route   DET /api/users/me
// access   Private
const getMe = async (req, res) => {
    const { _id, username, email } = await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        username,
        email
    })

}

// generate jwt
const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    getMe,
}

// {
//     "username": james,
//     "email": "james@gmail.com",
//     "password": "auth123"
// }