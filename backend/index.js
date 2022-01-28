// Load environment variables from .env file
require('dotenv').config()

// Init server
const express = require('express')
const app = express()
const port = process.env.PORT

if (!port) {
    throw new Error("Missing PORT environment variable")
}

// Load routes
const getComments = require('./routes/getComments')
const createComment = require('./routes/createComment')
app.get('/comments', getComments)
app.post('/comments', createComment)

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})