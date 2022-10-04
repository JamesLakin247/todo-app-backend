const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const connectDB = require('./config/db')

connectDB()

const app = express()

// body parser for raw json //  lets us access data from req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 5000

app.use('/api/todos', require('./routes/todoRoutes'))

app.listen(port, () => console.log(`listening on port: ${port}`))