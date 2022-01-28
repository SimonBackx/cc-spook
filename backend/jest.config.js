process.env.environment = "test";

module.exports = {
    clearMocks: true,
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
}