const Comment = require('../models/comment');

module.exports = async function(req, res) {
    // Get all comments and votes (if signed in)
    const comments = await Comment.fetchAll()
    res.json({
        comments,
        votes: []
    })
}