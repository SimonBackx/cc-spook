// Init server
const express = require('express')
const app = express()

// Middlewares
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Authentication middleware
const auth = require('./middleware/auth')

// Load API routes
const getComments = require('./routes/getComments')
const createComment = require('./routes/createComment')
const upvoteComment = require('./routes/upvoteComment')
const undoUpvoteComment = require('./routes/undoUpvoteComment')
const signIn = require('./routes/signIn')

const api = express.Router()
api.get('/comments', auth({ required: false}), getComments)
api.post('/comments', auth({ required: true}), createComment)
api.post('/upvote/:comment_id', auth({ required: true}), upvoteComment)
api.post('/upvote/:comment_id/undo', auth({ required: true}), undoUpvoteComment)
api.post('/sign-in', signIn)

app.use('/api', api)

// Load static routes
// These could also get hosted on a different server, but for simplicity we'll host them on the
// same server as the API, also to avoid having to set CORS headers on the API.
const staticRouter = express.Router()
staticRouter.use(express.static('../frontend/build'))

app.use(staticRouter)

// Express error handler should be last one
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app