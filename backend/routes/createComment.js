const ClientError = require('../errors/ClientError');
const Comment = require('../models/Comment');

// Note that we use Express v5, so that async errors will get caught and returned as an error
module.exports = async function(req, res) {
    if (!req.body.message || req.body.message.length < 1 || typeof req.body.message !== 'string') {
        throw new ClientError("Invalid message")
    }

    // Validate parent id
    if (req.body.parent_id) {
        const parent_id = parseInt(req.body.parent_id);
        if (!Number.isSafeInteger(parent_id) || parent_id <= 0) {
            throw new ClientError("Invalid parent comment id")
        }
        const parent = await new Comment({ id: parent_id }).fetch();
        if (!parent) {
            throw new ClientError("Invalid parent comment")
        }

        if (parent.parent_id) {
            throw new ClientError("Only one level of nesting is allowed")
        }

        // Sanitize
        req.body.parent_id = parent.id;
    }

    const comment = new Comment({
        message: req.body.message,
        user_id: req.user.id,
        parent_id: req.body.parent_id ?? null
    })

    await comment.save()

    const encodedComment = comment.toJSON();
    encodedComment.user = req.user.toJSON();
    encodedComment.children = [];

    res.status(200).json(encodedComment)
}