// Load environment variables from .env file
require('dotenv').config()

// Start server
const express = require('express')
const app = express()
const port = process.env.PORT

if (!port) {
    throw new Error("Missing PORT environment variable")
}

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})