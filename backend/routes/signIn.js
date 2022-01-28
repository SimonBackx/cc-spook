const ClientError = require('../errors/ClientError');
const User = require('../models/User');

// Without building a full fletched authentication system, we use a simple sign in method that is not secure.
// This is to demonstrate the ability to reverse an upvote (and show that we already upvoted a comment), since we need to stay signed in.
// Authentication is purely based on the user_id for now.

// Note that we use Express v5, so that async errors will get caught and returned as an error

module.exports = async function(req, res) {
    if (!req.body.name || req.body.name.length < 1 || typeof req.body.name !== 'string') {
        throw new ClientError("Invalid name")
    }
    
    const user = new User({
        name: req.body.name
    })

    await user.save()
    res.status(200).json(user)
}