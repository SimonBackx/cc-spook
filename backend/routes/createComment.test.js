const app = require('../server');
const request = require('supertest');
const User = require('../models/User');

let user;
describe("Create comment", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user" })
        await user.save()
    })

    test("Create a valid comment", async () => {
        const message = "This is a valid comment";
        const response = await request(app).post('/comments').set("Authorization", "USER_ID "+user.id).send({ message })
        
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(message);
        expect(response.body.created_at).toEqual(expect.any(String));
        expect(response.body.updated_at).toEqual(expect.any(String));
        expect(response.body.user_id).toEqual(expect.any(Number));
    });

    test("can't create empty comment", async () => {
        const response = await request(app).post('/comments').set("Authorization", "USER_ID "+user.id).send({ message: "" })
        expect(response.status).toEqual(400);
    });

    test("throw error for invalid body", async () => {
        const response = await request(app).post('/comments').set("Authorization", "USER_ID "+user.id).send()
        expect(response.status).toEqual(400);
    });

    test("throw error for null message", async () => {
        const response = await request(app).post('/comments').set("Authorization", "USER_ID "+user.id).send({ message: null })
        expect(response.status).toEqual(400);
    });

    test("throw error for non string message", async () => {
        const response = await request(app).post('/comments').set("Authorization", "USER_ID "+user.id).send({ message: 123 })
        expect(response.status).toEqual(400);
    });
})