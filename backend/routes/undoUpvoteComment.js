const ClientError = require('../errors/ClientError');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const bookshelf = require('../models/bookshelf');
const ws = require('../websocketServer');

// Note that we use Express v5, so that async errors will get caught and returned as an error
module.exports = async function(req, res) {
    if (!req.params.comment_id) {
        throw new ClientError("Invalid comment_id")
    }
    const comment_id = parseInt(req.params.comment_id);

    if (!Number.isSafeInteger(comment_id)) {
        throw new ClientError("Invalid comment_id")
    }

    const vote = new Vote({
        comment_id: comment_id,
        user_id: req.user.id
    })

    const exists = await vote.fetch({ require: false })
    if (!exists) {
        // Fail silently
        return res.sendStatus(201)
    }

    try {
        await bookshelf.transaction(async trx => {
            await exists.destroy({ require: false, transacting: trx })
            await Comment.query().where('id', comment_id).decrement('votes', 1).transacting(trx)
        });

        const comment = await new Comment({ id: comment_id }).fetch({ withRelated: ['user'] })
        // Send websocket update to all listening clients
        ws.broadCastMessage({ updateComment: comment.toJSON() });
    } catch (e) {
        throw new ClientError("Invalid comment")
    }
    res.sendStatus(201)
}