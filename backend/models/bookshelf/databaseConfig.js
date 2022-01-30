if (process.env.environment === "test") {
    // Return an in memory database for testing
    module.exports = {
        client: 'better-sqlite3',
        connection: {
            filename: ":memory:"
        },
        useNullAsDefault: true,
    }
} else {
    module.exports = {
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT ?? 3306,
            charset: 'utf8mb4'
        }
    }
}