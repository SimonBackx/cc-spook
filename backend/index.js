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
const createComment = require('./src/routes/createComment')
app.post('/comment', createComment)

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})