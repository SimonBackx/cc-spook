const app = require('../server');
const request = require('supertest');

test("Create a valid comment", async () => {
    const message = "This is a valid comment";
    const response = await request(app).post('/comments').send({ message })
    
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(message);
    expect(response.body.created_at).toEqual(expect.any(String));
    expect(response.body.updated_at).toEqual(expect.any(String));
    expect(response.body.user_id).toEqual(expect.any(Number));
});