const app = require('../server');
const request = require('supertest');

describe("Sign in", () => {
    test("create a new user", async () => {
        const name = "Test User"
        const avatar = "/images/avatar1.jpg"
        const response = await request(app).post('/api/sign-in').send({ name, avatar })
        
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(name);
        expect(response.body.id).toBeDefined();
    });

    test("empty name", async () => {
        const name = ""
        const avatar = "/images/avatar1.jpg"
        const response = await request(app).post('/api/sign-in').send({ name, avatar })
        
        expect(response.status).toEqual(400);
    });

    test("missing name", async () => {
        const response = await request(app).post('/api/sign-in').send()
        
        expect(response.status).toEqual(400);
    });
})