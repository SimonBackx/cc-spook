const User = require("../models/User")

module.exports = async function (req, res, next) {
    // Create a random user every time we need to do an authenticated request
    req.user = new User({ name: "Random user" })
    await req.user.save()
    next()
}