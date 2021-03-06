const app = require('../server');
const request = require('supertest');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Vote = require('../models/Vote');

let user, user2, comment, comment2;

describe("Undo upvote", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user", avatar: "/images/avatar1.jpg" })
        await user.save()

        user2 = new User({ name: "Test user 2", avatar: "/images/avatar1.jpg" })
        await user2.save()

        comment = new Comment({ message: "Hello world", user_id: user.id, votes: 2 })
        await comment.save()

        comment2 = new Comment({ message: "Hello world 2", user_id: user.id, votes: 2 })
        await comment2.save()

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

    test("undo upvote has no side effects", async () => {
        expect(comment2.get("votes")).toEqual(2);
    });
})