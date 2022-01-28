const bookshelf = require('./bookshelf');

// Defining models
module.exports = bookshelf.model('User', {
    tableName: 'users'
})