const Todo = require('../models/todoModel')
const User = require('../models/userModel') // required for only allowing users to update and delete their own todos

// @desc    Get todos
// @route   GET /api/todos
// access   Private
const getTodos = async (req, res) => {
    const todos = await Todo.find({ user: req.user.id })

    res.status(200).json(todos)
}

// @desc    Set todo
// @route   POST /api/todos
// access   Private
const createTodo = async (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ message: 'Please add a text field'})
    }
    
    const goal = await Todo.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(goal)
}

// @desc    Update todo
// @route   PUT /api/todos/:id
// access   Private
const updateTodo = async (req, res) => {

    const todo = await Todo.findById(req.params.id)

    if (!todo) {
        res.status(400).json({message: `todo not found`})
    }

    /* AUTHORISE USER SO THAT ONLY THE CURRENTLY LOGGED IN USER CAN DELETE THIS TODO */
    const user = await User.findById(req.user.id)

    // Check for user
    if (!user) {
        res.status(401).json({message: 'User not found'})
    }

    // Make sure the logged in user matches the goal user
    if (todo.user.toString() !== user.id) {
        res.status(401).json({message: 'User not authorised'})
    }
    /* END -- AUTHORISE USER SO THAT ONLY THE CURRENTLY LOGGED IN USER CAN DELETE THIS TODO */

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true})

    res.status(200).json(updatedTodo)
}

// @desc    Delete todos
// @route   DELETE /api/todos/:id
// access   Private
const deleteTodo = async (req, res) => {

    const todo = await Todo.findById(req.params.id)

    if (!todo) {
        res.status(400).json({message: 'todo not found'})
    }

    /* AUTHORISE USER SO THAT ONLY THE CURRENTLY LOGGED IN USER CAN DELETE THIS TODO */
    const user = await User.findById(req.user.id)

    // Check for user
    if (!user) {
        res.status(401).json({message: 'User not found'})
    }

    // Make sure the logged in user matches the goal user
    if (todo.user.toString() !== user.id) {
        res.status(401).json({message: 'User not authorised'})
    }
    /* END -- AUTHORISE USER SO THAT ONLY THE CURRENTLY LOGGED IN USER CAN DELETE THIS TODO */

    await Todo.findByIdAndDelete(req.params.id)

    res.status(200).json({message: `${req.params.id} deleted`})
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
}