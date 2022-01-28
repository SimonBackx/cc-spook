const app = require('../server');
const request = require('supertest');

describe("Sign in", () => {
    test("create a new user", async () => {
        const name = "Test User"
        const response = await request(app).post('/sign-in').send({ name })
        
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(name);
        expect(response.body.id).toBeDefined();
    });

    test("empty name", async () => {
        const name = ""
        const response = await request(app).post('/sign-in').send({ name })
        
        expect(response.status).toEqual(400);
    });

    test("missing name", async () => {
        const response = await request(app).post('/sign-in').send()
        
        expect(response.status).toEqual(400);
    });
})