const app = require('../server');
const request = require('supertest');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

let user, otherUser;
let comment, commentEncoded;

describe("Get comments", () => {
    beforeAll(async () => {
        user = new User({ name: "Test user", avatar: "/images/avatar1.jpg" })
        await user.save()

        otherUser = new User({ name: "Other test user", avatar: "/images/avatar1.jpg" })
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
                name: "Test user",
                avatar: "/images/avatar1.jpg"
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

    test("get sorted comments", async () => {
        // Create two new comments, one that should be before the existing and one that should be after (to test the sorting correctly and prevent default sorting by id)
        const comment2 = new Comment({ message: "Hello world2", user_id: user.id, created_at: new Date(2000, 0, 1).toISOString() })
        await comment2.save()

        const comment3 = new Comment({ message: "Hello world3", user_id: user.id })
        await comment3.save()
        
        // Expected encoded value for comment
        const comment2Encoded = {
            id: expect.any(Number),
            message: "Hello world2",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            }
        };

        // Expected encoded value for comment
        const comment3Encoded = {
            id: expect.any(Number),
            message: "Hello world3",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            }
        };

        // Check if we get this comment
        const response = await request(app).get('/api/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([comment2Encoded, commentEncoded, comment3Encoded]);
        expect(response.body.votes).toEqual([]);
    });
})