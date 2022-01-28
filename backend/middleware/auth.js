const User = require("../models/User")
const ClientError = require("../errors/ClientError")

// Authentication is purely based on the user_id for now (not secure). 
// The signIn route is used to get a user id and store it client side

module.exports = async function (req, res, next) {
    if (!req.headers["authorization"] || typeof req.headers["authorization"] !== "string" || !req.headers["authorization"].startsWith("USER_ID ")) {
        throw new ClientError("Missing authorization header", 401)
    }

    const userId = parseInt(req.headers["authorization"].split(" ")[1])
    if (isNaN(userId) || typeof userId !== "number") {
        throw new ClientError("Invalid authorization header", 401)
    }

    // Create a random user every time we need to do an authenticated request
    try {
        req.user = await new User({ id: userId }).fetch({ required: true })
    } catch (e) {
        console.error(e)
        throw new ClientError("Invalid authorization header", 401)
    }
    next()
}