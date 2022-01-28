// Init server
const express = require('express')
const app = express()

// Middlewares
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Authentication middleware
const auth = require('./middleware/auth')

// Load routes
const getComments = require('./routes/getComments')
const createComment = require('./routes/createComment')
const upvoteComment = require('./routes/upvoteComment')
const undoUpvoteComment = require('./routes/undoUpvoteComment')
const signIn = require('./routes/signIn')

app.get('/comments', auth({ required: false}), getComments)
app.post('/comments', auth({ required: true}), createComment)
app.post('/upvote/:comment_id', auth({ required: true}), upvoteComment)
app.post('/upvote/:comment_id/undo', auth({ required: true}), undoUpvoteComment)

app.post('/sign-in', signIn)

// Express error handler should be last one
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app