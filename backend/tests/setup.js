
async function migrateDatabase() {
    const knex = require('../models/bookshelf/knex')
  
    try {
      await knex.migrate.latest()
    } catch (error) {
      throw new Error(error)
    }
  }


// We need to migrate the database on every test file,
// which is not super clean, but since we are using an in memory database this is easier for running the tests
// than setting up a separate MySQL database that is shared between the tests.
beforeAll(async () => {
  await migrateDatabase()
});

// Close database connection after running tests
afterAll(async () => {
  const knex = require('../models/bookshelf/knex')
  await knex.destroy();
});
