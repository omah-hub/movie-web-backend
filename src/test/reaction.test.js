const request = require('supertest');
const app = require('../../index'); // Adjust this path to your actual app file
const { run, dbConfig } = require('../database/connection'); // Assuming you have this set up for database connection

describe('Reaction Controller', () => {
    // Clear the database before each test
    beforeEach(async () => {
        const { db } = await run();
        await db.collection(dbConfig.reactionCollection).deleteMany({}); // Clear reactions collection
    });

    // Test for adding a reaction
    it('should add a reaction (like/dislike)', async () => {
        const reactionData = {
            userId: 'user123',
            reactionType: 'like',
            movieId: '1', // This can be any movieId
        };

        const response = await request(app)
            .post('/api/addReaction')
            .send(reactionData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Reaction saved successfully.');
         // Ensure that a new reaction was added
    });

    it('should return 400 if required fields are missing', async () => {
        const reactionData = {
            userId: 'user123',
            movieId: '1',
        };

        const response = await request(app)
            .post('/api/addReaction')
            .send(reactionData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User ID, movie ID, and reaction type are required.');
    });

    it('should return 400 for invalid reaction type', async () => {
        const reactionData = {
            userId: 'user123',
            reactionType: 'invalidReaction',
            movieId: '1',
        };

        const response = await request(app)
            .post('/api/addReaction')
            .send(reactionData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid reaction type. Must be \'like\' or \'dislike\'.');
    });

    // Test for fetching reactions
    it('should fetch reactions for a movie', async () => {
        const reactionData = {
            userId: 'user123',
            reactionType: 'like',
            movieId: 1,
        };

        // First, add a reaction
        await request(app)
            .post('/api/addReaction')
            .send(reactionData);

        // Now, fetch reactions for the movie
        const response = await request(app)
            .get('/api/reactions/1'); // The movieId should match the one used in the reaction

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('successful');
        
    });

   
});
