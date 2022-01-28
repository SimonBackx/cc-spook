module.exports = function (err, req, res, next) {
    if (err.statusCode === undefined) {
        console.error(err)
    }
    res.status(err.statusCode ?? 500).json({ error: err.message })
}