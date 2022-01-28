const app = require('../server');
const request = require('supertest');
const User = require('../models/User');
const Comment = require('../models/Comment');

let user;
describe("Get comments", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user" })
        await user.save()
    })

    // Since we clear the database on every test file run, we know that comments should be empty
    test("get empty comments, unauthenticated", async () => {
        const response = await request(app).get('/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([]);
        expect(response.body.votes).toEqual([]);
    });

    test("get comments, unauthenticated", async () => {
        // Create a comment
        const comment = new Comment({ message: "Hello world", user_id: user.id })
        await comment.save()

        // Check if we get this comment
        const response = await request(app).get('/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([comment.toJSON()]);
        expect(response.body.votes).toEqual([]);
    });
})