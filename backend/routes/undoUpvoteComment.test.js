const app = require('../server');
const request = require('supertest');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Vote = require('../models/Vote');

let user, user2, comment;

describe("Undo upvote", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user" })
        await user.save()

        user2 = new User({ name: "Test user 2" })
        await user2.save()

        comment = new Comment({ message: "Hello world", user_id: user.id, votes: 2 })
        await comment.save()

        await Promise.allSettled([
            new Vote({ comment_id: comment.id, user_id: user.id }).save(),
            new Vote({ comment_id: comment.id, user_id: user2.id }).save()
        ])
    })

    test("undo upvote", async () => {
        const response = await request(app).post('/api/upvote/'+comment.id+"/undo").set("Authorization", "USER_ID "+user.id).send()
       
        expect(response.status).toEqual(201);

        // Check if the vote cache went down again
        await comment.refresh()
        expect(comment.get("votes")).toEqual(1);
    });

    test("undo non-existing upvote", async () => {
        const response = await request(app).post('/api/upvote/'+comment.id+"/undo").set("Authorization", "USER_ID "+user.id).send()
       
        expect(response.status).toEqual(201);

        // Check if the vote cache stayed the same
        await comment.refresh()
        expect(comment.get("votes")).toEqual(1);
    });

    test("undo last upvote", async () => {
        const response = await request(app).post('/api/upvote/'+comment.id+"/undo").set("Authorization", "USER_ID "+user2.id).send()
       
        expect(response.status).toEqual(201);

        await comment.refresh()
        expect(comment.get("votes")).toEqual(0);
    });
})