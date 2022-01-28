const Comment = require('../models/Comment');

module.exports = async function(req, res) {
    // Get all comments and votes (if signed in)
    const comments = await Comment.fetchAll()
    let votes = []

    if (req.user) {
        // If the user is currently signed in, we also want to get their votes
        votes = await req.user.votes().fetch()
    }

    res.json({
        comments,
        votes
    })
}