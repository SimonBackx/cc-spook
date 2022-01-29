/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('comments', function(table) {
        if (process.env.environment !== "test") {
            // Charset not supported in SQLite
            table.charset('utf8mb4');
            table.collate('utf8mb4_0900_ai_ci');
        }

        table.increments('id').primary()
        table.text('message').notNullable()

        // Cached vote count
        table.integer('votes').unsigned().notNullable().defaultTo(0)

        table.integer('user_id').unsigned().notNullable().references('users.id')
        table.timestamps(true, true)

        // We'll need to sort on created_at often (old to new)
        table.index('created_at')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
