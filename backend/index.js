// Load environment variables from .env file
require('dotenv').config()

const port = process.env.PORT

if (!port) {
    throw new Error("Missing PORT environment variable")
}

const app = require('./server')

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})