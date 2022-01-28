const databaseConfig = require('./databaseConfig');
module.exports = require('knex')(databaseConfig)