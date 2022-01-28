/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('votes', function(table) {
        table.increments('id').primary()

        table.integer('user_id').unsigned().notNullable().references('users.id')
        table.integer('comment_id').unsigned().notNullable().references('comments.id')
        table.timestamps(true, true)

        // A user can only vote once on the same comment
        table.unique(['user_id', 'comment_id']);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
