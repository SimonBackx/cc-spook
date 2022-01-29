const app = require('../server');
const request = require('supertest');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

let user, otherUser;
let comment, commentEncoded;

describe("Get comments", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user" })
        await user.save()

        otherUser = new User({ name: "Other test user" })
        await otherUser.save()
    })

    // Since we clear the database on every test file run, we know that comments should be empty
    test("get empty comments, unauthenticated", async () => {
        const response = await request(app).get('/api/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([]);
        expect(response.body.votes).toEqual([]);
    });

    test("get comments, authenticated, without votes", async () => {
        // Create a comment
        comment = new Comment({ message: "Hello world", user_id: user.id })
        await comment.save()
        
        // Expected encoded value for comment
        commentEncoded = {
            id: expect.any(Number),
            message: "Hello world",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user"
            }
        };

        // Check if we get this comment
        const response = await request(app).get('/api/comments').set("Authorization", "USER_ID "+user.id).send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([commentEncoded]);
        expect(response.body.votes).toEqual([]);
    });

    test("get comments, authenticated, with votes", async () => {
        // Create votes
        vote = new Vote({ comment_id: comment.id, user_id: user.id })
        await vote.save()

        const otherVote = new Vote({ comment_id: comment.id, user_id: otherUser.id })
        await otherVote.save()

        // Check if we get this comment
        const response = await request(app).get('/api/comments').set("Authorization", "USER_ID "+user.id).send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([commentEncoded]);
        expect(response.body.votes).toEqual([vote.toJSON()]);
    });

    test("get comments, unauthenticated", async () => {
        // Votes should stay empty

        // Check if we get this comment
        const response = await request(app).get('/api/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([commentEncoded]);
        expect(response.body.votes).toEqual([]);
    });
})