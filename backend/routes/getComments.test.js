const app = require('../server');
const request = require('supertest');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

let user, otherUser;
let comment, commentEncoded, comment2, comment2Encoded, comment3, comment3Encoded;

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
        comment = await new Comment({ message: "Hello world", user_id: user.id }).save()
        
        // Expected encoded value for comment
        commentEncoded = {
            id: expect.any(Number),
            message: "Hello world",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            parent_id: null,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            },
            children: []
        };

        // Check if we get this comment
        const response = await request(app).get('/api/comments').set("Authorization", "USER_ID "+user.id).send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([commentEncoded]);
        expect(response.body.votes).toEqual([]);
    });

    test("get comments, authenticated, with votes", async () => {
        // Create votes
        vote = await new Vote({ comment_id: comment.id, user_id: user.id }).save()

        await new Vote({ comment_id: comment.id, user_id: otherUser.id }).save()

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
        comment2 = await new Comment({ message: "Hello world2", user_id: user.id, created_at: new Date(2000, 0, 1).toISOString() }).save()
        comment3 = await new Comment({ message: "Hello world3", user_id: user.id }).save()
        
        // Expected encoded value for comment
        comment2Encoded = {
            id: expect.any(Number),
            message: "Hello world2",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            parent_id: null,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            },
            children: []
        };

        // Expected encoded value for comment
        comment3Encoded = {
            id: expect.any(Number),
            message: "Hello world3",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            parent_id: null,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            },
            children: []
        };

        // Check if we get this comment
        const response = await request(app).get('/api/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([comment2Encoded, commentEncoded, comment3Encoded]);
        expect(response.body.votes).toEqual([]);
    });

    test("get nested comments", async () => {
        // Create a comment in the future (needed because we can't create replies to comments before the main comment created date)
        await new Comment({ message: "Nested comment", user_id: user.id, parent_id: comment.id, created_at: new Date(2200, 0, 1).toISOString() }).save()

        // Create an older nested comment, which should go before the previous one
        await new Comment({ message: "Nested comment 2", user_id: user.id, parent_id: comment.id }).save()
        
        // Expected encoded value for comment
        nestedCommentEncoded = {
            id: expect.any(Number),
            message: "Nested comment",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            parent_id: comment.id,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            },
            children: []
        };

        // Expected encoded value for comment
        nestedComment2Encoded = {
            id: expect.any(Number),
            message: "Nested comment 2",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            user_id: user.id,
            parent_id: comment.id,
            votes: 0,
            user: {
                id: user.id,
                name: "Test user",
                avatar: "/images/avatar1.jpg"
            },
            children: []
        };

        commentEncoded.children.push(nestedComment2Encoded)
        commentEncoded.children.push(nestedCommentEncoded)

        // Check if we get this comment
        const response = await request(app).get('/api/comments').send()
        
        expect(response.status).toEqual(200);
        expect(response.body.comments).toEqual([comment2Encoded, commentEncoded, comment3Encoded]);
        expect(response.body.votes).toEqual([]);
    });
})