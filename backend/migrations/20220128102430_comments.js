/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('comments', function(table) {
        table.increments('id').primary()
        table.text('message').notNullable()

        // Cached vote count
        table.integer('votes').unsigned().notNullable().defaultTo(0)

        table.integer('user_id').unsigned().notNullable().unique().references('users.id')
        table.timestamps(true, true)

        // We'll need to sort on created_at often (new to old)
        table.index('created_at')
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
