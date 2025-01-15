const request = require('supertest');
const app = require('../../index');
const { run } = require('../database/connection');
const { MongoClient } = require('mongodb');
const bcrypt = require("bcrypt");





  
let client;
let testDb;

beforeAll(async () => {
    const result = await run();
    client =  result.client;
    testDb = result.db;
});

afterAll(async () => {
    if (client) await client.close();
});

const testCollection = 'userstest';
const testEmail = 'johndoe@example.com';
const testName = 'John Doe';
const testPassword = 'securepassword123';

describe('Register controller', () => {
  

    beforeEach(async () => {
        const collection = testDb.collection(testCollection);
        await collection.deleteMany({});
    });

    test('should register a user successfully', async () => {
        const response = await request(app).post('/api/register').send({
            name: testName,
            email: testEmail,
            password: testPassword,
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully')
    })
    test('should not register a user with an existing email', async () => {
        const collection = testDb.collection(testCollection);
        await collection.insertOne({
            name: testName,
            email: testEmail,
            password: testPassword,
        });

        const response = await request(app).post('/api/register').send({
            name: 'Another Name',
            email: testEmail,
            password: 'anotherpassword',
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email is already registered');
    });
})

describe('User Controller - Login', () => {
    // const testCollection = 'userstest';
    // const testEmail = 'johndoe@example.com';
    // const testName = 'John Doe';
    // const testPassword = 'securepassword123';
    let hashedPassword;

    beforeEach(async () => {
        hashedPassword = await bcrypt.hash(testPassword, 10);
        const collection = testDb.collection(testCollection);
        await collection.deleteMany({});
        await collection.insertOne({
            name: testName,
            email: testEmail,
            password: hashedPassword,
        });
    });

    test('should log in a user successfully', async () => {
        const response = await request(app).post('/api/login').send({
            name: testName,
            password: testPassword,
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('login Successful');
        expect(response.body.name).toBe(testName);
    });

    test('should not log in with invalid credentials', async () => {
        const response = await request(app).post('/api/login').send({
            name: testName,
            password: 'wrongpassword',
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid email or password');
    });

    test('should not log in with a non-existent user', async () => {
        const response = await request(app).post('/api/login').send({
            name: 'NonExistentUser',
            password: 'password123',
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid username and password');
    });
});

describe('User Controller - Logout', () => {
    test('should log out a user successfully', async () => {
        const response = await request(app).post('/api/logout');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged out successfully');
    });
});
