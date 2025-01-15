const { createUser, getUserByName, getUserByEmail } = require('./user-model');
const dotenv = require('dotenv');
const { run } = require('../database/connection');


let client;
let db;

beforeAll(async () => {
    const result = await run(); // Call the run function and get the result
    client = result.client;     // Assign the client from the result
    db = result.db;             // Assign the database from the result
});

afterAll(async () => {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  });




describe('user model test', () => {
    const testName = 'John Doe';
    const testEmail = 'johndoe@example.com';
    const testPassword = 'securepassword123';
    beforeEach(async () => {
        const collection = db.collection('userstest');
        const result = await collection.insertOne({
            name: testName,
            email: testEmail,
            password: testPassword,  
        });
        const insertedUser = await collection.findOne({ _id: result.insertedId });
        console.log('Inserted User:', insertedUser); // Log the inserted user
      
    });

    afterEach(async () => {
        // Clear collections before each test
        await db.collection('userstest').deleteMany({});
    });

   

    test('createUser() should create a user', async () => {
        const newUser = {
            name: 'John boo',
            email: 'johnboo@example.com',
            password: 'P@ssword123',
        };
        const result = await createUser(newUser);
        console.log(result)
        expect(result).toHaveProperty('insertedId')
        expect(result).toBeTruthy()
       
    })

    test('getUserByName() should get user by name', async () => {
        const testName = 'John Doe';
        const user = await getUserByName(testName);// Log the retrieved user
        expect(user).toBeTruthy();
        expect(user.name).toBe(testName);
    });

    test('getUserByEmail() should get user by email', async () => {
        const testEmail = 'johndoe@example.com';
        const user = await getUserByEmail(testEmail);
        expect(user).toBeTruthy();
        expect(user.name).toBe(testName);

    })
    
})





