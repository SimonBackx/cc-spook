const Comment = require('../models/comment');

// Note that we use Express v5, so that async errors will get caught and returned as an error
module.exports = async function(req, res) {
    if (!req.body.message || req.body.message.length < 1) {
        throw new Error("Invalid message")
    }
    const comment = new Comment({
        message: req.body.message,
        user_id: req.user.id
    })

    await comment.save()
    res.status(200).json(comment)
}