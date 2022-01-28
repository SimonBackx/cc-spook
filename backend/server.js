// Init server
const express = require('express')
const app = express()

// Middlewares
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Temporary authentication middleware
const auth = require('./middleware/auth')
app.use(auth({ required: true }))

// Load routes
const getComments = require('./routes/getComments')
const createComment = require('./routes/createComment')

app.get('/comments', getComments)
app.post('/comments', createComment)

// Express error handler should be last one
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app