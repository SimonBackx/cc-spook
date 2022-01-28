// Load environment variables from .env file
require('dotenv').config()

// Init server
const express = require('express')
const app = express()
const port = process.env.PORT

if (!port) {
    throw new Error("Missing PORT environment variable")
}

// Middlewares
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Temporary authentication middleware
const auth = require('./middleware/auth')
app.use(auth)

// Load routes
const getComments = require('./routes/getComments')
const createComment = require('./routes/createComment')

app.get('/comments', getComments)
app.post('/comments', createComment)

// Express error handler should be last one
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})