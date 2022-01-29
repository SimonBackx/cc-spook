const ClientError = require('../errors/ClientError');
const Comment = require('../models/Comment');

// Note that we use Express v5, so that async errors will get caught and returned as an error
module.exports = async function(req, res) {
    if (!req.body.message || req.body.message.length < 1 || typeof req.body.message !== 'string') {
        throw new ClientError("Invalid message")
    }
    const comment = new Comment({
        message: req.body.message,
        user_id: req.user.id
    })

    await comment.save()

    // Manually set user relation
    // Couldn't find an official way to do this in the documentation of bookshelf
    comment.relations.user = req.user

    res.status(200).json(comment)
}