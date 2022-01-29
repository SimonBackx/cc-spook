/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        if (process.env.environment !== "test") {
            // Charset not supported in SQLite
            table.charset('utf8mb4');
            table.collate('utf8mb4_0900_ai_ci');
        }
        
        table.increments('id').primary();
        table.string('name').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
