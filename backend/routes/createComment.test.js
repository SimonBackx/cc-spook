const app = require('../server');
const request = require('supertest');
const User = require('../models/User');
const Comment = require('../models/Comment');

let user;
describe("Create comment", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user", avatar: "/images/avatar1.jpg" })
        await user.save()
    })

    test("create a valid comment", async () => {
        const message = "This is a valid comment";
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID "+user.id).send({ message })
        
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(message);
        expect(response.body.created_at).toEqual(expect.any(String));
        expect(response.body.updated_at).toEqual(expect.any(String));
        expect(response.body.user_id).toEqual(user.id);
        expect(response.body.user.name).toEqual("Test user");
        expect(response.body.user.id).toEqual(user.id);
        expect(response.body.user.avatar).toEqual("/images/avatar1.jpg");
        expect(response.body.parent_id).toBeNull();
        expect(response.body.children).toEqual([]);
    });

    test("authentication is required", async () => {
        const response = await request(app).post('/api/comments').send({ message: 123 })
        expect(response.status).toEqual(401);
    });

    test("valid user is required", async () => {
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID 989895959").send({ message: 123 })
        expect(response.status).toEqual(401);
    });

    test("valid Authorization header is required", async () => {
        const response = await request(app).post('/api/comments').set("Authorization", "Bearer invalid").send({ message: 123 })
        expect(response.status).toEqual(401);
    });

    test("can't create empty comment", async () => {
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID "+user.id).send({ message: "" })
        expect(response.status).toEqual(400);
    });

    test("throw error for invalid body", async () => {
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID "+user.id).send()
        expect(response.status).toEqual(400);
    });

    test("throw error for null message", async () => {
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID "+user.id).send({ message: null })
        expect(response.status).toEqual(400);
    });

    test("throw error for non string message", async () => {
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID "+user.id).send({ message: 123 })
        expect(response.status).toEqual(400);
    });

    test("create a valid comment with a parent", async () => {
        const comment = new Comment({ message: "Top level comment", user_id: user.id })
        await comment.save()

        const message = "This is a reply comment";
        const response = await request(app).post('/api/comments').set("Authorization", "USER_ID "+user.id).send({ message, parent_id: comment.id })
        
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(message);
        expect(response.body.created_at).toEqual(expect.any(String));
        expect(response.body.updated_at).toEqual(expect.any(String));
        expect(response.body.user_id).toEqual(user.id);
        expect(response.body.user.name).toEqual("Test user");
        expect(response.body.user.id).toEqual(user.id);
        expect(response.body.user.avatar).toEqual("/images/avatar1.jpg");
        expect(response.body.parent_id).toEqual(comment.id);
    });
})