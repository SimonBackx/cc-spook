const ClientError = require('../errors/ClientError');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const bookshelf = require('../models/bookshelf');

// Note that we use Express v5, so that async errors will get caught and returned as an error
module.exports = async function(req, res) {
    if (!req.params.comment_id) {
        throw new ClientError("Invalid comment_id")
    }
    const comment_id = parseInt(req.params.comment_id);

    if (!Number.isInteger(comment_id)) {
        throw new ClientError("Invalid comment_id")
    }

    const vote = new Vote({
        comment_id: comment_id,
        user_id: req.user.id
    })

    const exists = await vote.fetch({ require: false })
    if (exists) {
        return res.status(200).json(exists)
    }

    try {
        await bookshelf.transaction(async trx => {
            await vote.save(null, { transacting: trx })
            await Comment.query().where('id', comment_id).increment('votes', 1).transacting(trx)
        });
    } catch (e) {
        throw new ClientError("Invalid comment")
    }
    res.status(200).json(vote)
}