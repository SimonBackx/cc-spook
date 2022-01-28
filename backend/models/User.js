const bookshelf = require('./bookshelf');

// Defining models
module.exports = bookshelf.model('User', {
    tableName: 'users',

    votes() {
        return this.hasMany('Vote')
    }
})