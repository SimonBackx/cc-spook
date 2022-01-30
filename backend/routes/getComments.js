const Comment = require('../models/Comment');

module.exports = async function(req, res) {
    // Get all comments and votes (if signed in)
    // Might add pagination here in the future
    const comments = await new Comment().orderBy('created_at', 'asc').fetchAll()
    let votes = []

    if (req.user) {
        // If the user is currently signed in, we also want to get their votes
        votes = await req.user.votes().fetch()
    }

    // Load comment users
    await comments.load('user')

    // Group nested comments
    // In the future, we could limit the amount of child comments (and cache those for performance) and add a 'show more' button to do a full query
    const groupedComments = new Map()
    for (const comment of comments) {
        const commentEncoded = comment.toJSON()
        commentEncoded.children = []

        if (!comment.get("parent_id")) {
            // Main comment
            groupedComments.set(comment.id, commentEncoded)
        } else {
            // A parent comment should always be older than the child comment
            const parent = groupedComments.get(comment.get("parent_id"))
            if (!parent) {
                console.warn("Found comment with invalid parent comment, for ", comment.id)
            } else {
                parent.children.push(commentEncoded)
            }
        }
    }

    // Comments order will stay the same, because Map.prototype.values() returns an array in insertion order
    res.json({
        comments: [...groupedComments.values()],
        votes
    })
}