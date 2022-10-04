const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text value']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Todo', todoSchema) // exporting the todoModel giving it the name 'Todo' and passing the todoSchema as a value