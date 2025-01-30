const request = require('supertest');
const app = require('../../index'); // Adjust the path if needed, this should be your Express app
const { run, dbConfig } = require('../database/connection');

// Helper function to clear the test database
async function clearDatabase() {
    const { db } = await run();
    await db.collection(dbConfig.commentCollection).deleteMany({});
}

describe('Comment Routes', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    afterEach(async () => {
        // Clear database after each test
        await clearDatabase();
    });
    const commentData = {
        userId: 'user123',
        movieId: 1,
        name: 'Test User',
        content: 'Great movie!'
    };
    beforeEach(async () => {
       await request(app)
        .post('/api/addComment')
        .send(commentData);
    })

    it('should add a new comment', async () => {
      
        const comment = {
            userId: 'user12',
            movieId: 1,
            name: 'Test User',
            content: 'really nicemovie!'
        };
        const response = await request(app)
            .post('/api/addComment')
            .send(comment);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment added successfully');
        // expect(response.body.data).toHaveProperty('modifiedCount', 1); // Depending on your update logic
    });

    it('should not add a comment if user already commented on the movie', async () => {
       
        
        const response = await request(app)
            .post('/api/addComment')
            .send(commentData);

        expect(response.status).toBe(500); // Or the specific error code you throw
        expect(response.body.message).toBe('Failed to add comment.');
    });

    it('should update a comment', async () => {
        
      

        const updatedContent = 'Amazing movie!';
        const response = await request(app)
            .patch('/api/updateComment')
            .send({
                userId: 'user123',
                movieId: 1,
                content: updatedContent
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment updated successfully');
        expect(response.body.data.modifiedCount).toBe(1);
    });

    it('should not update a comment if user does not own the comment', async () => {
        const response = await request(app)
            .patch('/api/updateComment')
            .send({
                userId: 'user12',
                movieId: '1',
                content: 'Updated comment'
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("You don't have permission to edit this comment.");
    });

    it('should delete a comment', async () => {
      
        
        const response = await request(app)
            .delete('/api/deleteComment')
            .send({
                userId: 'user123',
                movieId: 1
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment deleted successfully');
    });

    it('should not delete a comment if user does not own the comment', async () => {
        // Trying to delete a comment by a different user
        const response = await request(app)
            .delete('/api/deleteComment')
            .send({
                userId: 'otherUser',
                movieId: '1'
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("You don't have permission to delete this comment.");
    });

    it('should get comments for a movie', async () => {
  
        const response = await request(app).get('/api/getComment/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comments fetched successfully');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

   
});

