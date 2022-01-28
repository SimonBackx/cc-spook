const app = require('../server');
const request = require('supertest');
const Comment = require('../models/Comment');
const User = require('../models/User');

let user, comment;

describe("Upvote comment", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user" })
        await user.save()

        comment = new Comment({ message: "Hello world", user_id: user.id })
        await comment.save()
    })

    test("upvote a comment", async () => {
        const response = await request(app).post('/upvote/'+comment.id).set("Authorization", "USER_ID "+user.id).send()
        
        expect(response.status).toEqual(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.comment_id).toEqual(comment.id);
        expect(response.body.user_id).toEqual(user.id);

        // Check if the vote cache went up
        await comment.refresh()
        expect(comment.get("votes")).toEqual(1);
    });

    test("fail silently if upvoted twice", async () => {
        const response = await request(app).post('/upvote/'+comment.id).set("Authorization", "USER_ID "+user.id).send()
        
        expect(response.status).toEqual(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.comment_id).toEqual(comment.id);
        expect(response.body.user_id).toEqual(user.id);

        // Check if the vote cache stayed the same
        await comment.refresh()
        expect(comment.get("votes")).toEqual(1);
    });
})