
async function migrateDatabase() {
    const knex = require('../models/bookshelf/knex')
  
    try {
      await knex.migrate.latest()
    } catch (error) {
      throw new Error(error)
    }
  }

(async function() {
    try {
        await migrateDatabase()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
})()

// Close database connection after running tests
afterAll(async () => {
  const knex = require('../models/bookshelf/knex')
  await knex.destroy();
});
