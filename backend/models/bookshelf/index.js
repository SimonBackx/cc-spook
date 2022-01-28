// Setting up the database connection
const knex = require('./knex')
module.exports = require('bookshelf')(knex)