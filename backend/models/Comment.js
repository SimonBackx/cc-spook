const bookshelf = require('./bookshelf');

// Defining models
module.exports = bookshelf.model('Comment', {
    tableName: 'comments',
    user() {
        return this.belongsTo('User')
    }
})