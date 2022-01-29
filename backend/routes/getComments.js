const Comment = require('../models/Comment');

module.exports = async function(req, res) {
    // Get all comments and votes (if signed in)
    const comments = await new Comment().orderBy('created_at', 'asc').fetchAll()
    let votes = []

    if (req.user) {
        // If the user is currently signed in, we also want to get their votes
        votes = await req.user.votes().fetch()
    }

    // Load comment users
    await comments.load('user')

    res.json({
        comments: comments,
        votes
    })
}