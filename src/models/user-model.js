const { ObjectId, Collection } = require('mongodb')
const { run, dbConfig } = require('../database/connection')
const crypto = require('crypto')
const dotenv = require('dotenv')



async function createUser(userData) {
    const timestamp = new Date()

    const sessionId = crypto.randomBytes(16).toString('hex');
    console.log("Current time (local):", timestamp); // Show current time in local time here

// Add 2 minutes (in milliseconds) to the current time
    const expiryDate = new Date(timestamp.getTime() + 2 * 60 * 1000);
    console.log("Expiry time (local):", expiryDate); //here
    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.collectionName)
        const data = await collection.insertOne({
            ...userData,
            sessionId,
            sessionExpiry: expiryDate,// here
            createdAt: timestamp, //here
        });
        console.log(data)
        return {
            ...data,
            sessionExpiry: expiryDate, // return expiry date too here
        };

    } catch(error) {
        console.error("Error in createDocument:", error.message); // Log the error
        throw new Error("Failed to insert document into the database.");
    }
}

async function updateSession(name) {
    try {
        const { db } = await run(); // Connect to the database
        const collection = db.collection(dbConfig.collectionName);

        // Generate a new session ID and expiry date
        const newSessionId = crypto.randomBytes(16).toString('hex');
        const newExpiryDate = new Date(Date.now() + 2 * 60 * 1000); // Expiry in 2 minutes here

        // Update the user's session details in the database
        const sessionUpdated = await collection.updateOne(
            { name }, // Query to find the user by name
            { $set: { sessionId: newSessionId, sessionExpiry: newExpiryDate } }
        );

        // Check if the update was successful
        if (sessionUpdated.matchedCount === 0) {
            throw new Error(`No user found with name: ${name}`);
        }

        // Return the updated session details
        return {
            sessionId: newSessionId,
            sessionExpiry: newExpiryDate,
        };
    } catch (error) {
        console.error("Error updating session:", error);
        throw new Error("Failed to update session in the database.");
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



module.exports = { createUser, updateSession, getUserByName, getUserByEmail}