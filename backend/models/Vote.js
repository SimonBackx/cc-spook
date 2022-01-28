const bookshelf = require('./bookshelf');

// Defining models
module.exports = bookshelf.model('Vote', {
    tableName: 'votes',
    user() {
        return this.belongsTo('User')
    },
    comment() {
        return this.belongsTo('Comment')
    }
})