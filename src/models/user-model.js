const { ObjectId, Collection } = require('mongodb')
const { run, dbConfig } = require('../database/connection')
const dotenv = require('dotenv')



async function createUser(userData) {
    const timestamp = new Date()
    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.collectionName)
        const data = await collection.insertOne({
            ...userData,
            createdAt: timestamp,
        });
        console.log(data)
        return data;
    } catch(error) {
        console.error("Error in createDocument:", error.message); // Log the error
        throw new Error("Failed to insert document into the database.");
    }
}

async function getUserByName(name) {
    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.collectionName)
        console.log('Querying collection:', dbConfig.collectionName);
        const user = await collection.findOne({ name })
        console.log('Found user:', user);
        return user;
        // console.log(user)
    } catch (error) {
        console.log(error)
    }
}

async function getUserByEmail(email) {
    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.collectionName)
        const user = await collection.findOne({ email })
        return user;
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createUser, getUserByName, getUserByEmail}