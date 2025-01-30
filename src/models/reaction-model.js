const { get } = require('../..');
const { run, dbConfig } = require('../database/connection');

async function createReaction({ userId, movieId, reactionType }) {
    const timestamp = new Date();

    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.reactionCollection);

        // Define the field to update based on reaction type
        const fieldToUpdate = reactionType === "like" ? "likes" : "dislikes";
        const oppositeField = reactionType === "like" ? "dislikes" : "likes";

        // Step 1: Remove the user from both fields (opposite and current)
        await collection.updateOne(
            { movieId },
            {
                $pull: {
                    [oppositeField]: { user_id: userId },
                    [fieldToUpdate]: { user_id: userId },
                },
            }
        );

        // Step 2: Add the user to the desired field
        const result = await collection.updateOne(
            { movieId },
            {
                $addToSet: {
                    [fieldToUpdate]: {
                        user_id: userId,
                        createdAt: timestamp,
                    },
                },
            },
            { upsert: true } // Create the document if it doesn't exist
        );

        console.log("Reaction updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error in createReaction:", error.message);
        throw new Error("Failed to save the reaction to the database.");
    }
}

async function getReactions({ movieId }) {
    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.reactionCollection);

        // Convert movieId to a number (important!)
        const movieIdNumber = parseInt(movieId, 10); // Convert string to number

        console.log("Querying movieId:", movieIdNumber); // Debugging

        const movieReactions = await collection.findOne(
            { movieId: movieIdNumber }, // Query with number
            { projection: { likes: 1, dislikes: 1, _id: 0 } } // Return only likes/dislikes
        );

        if (!movieReactions) {
            console.log("No reactions found for movieId:", movieIdNumber);
            return { likes: [], dislikes: [] };
        }

        return {
            likes: movieReactions.likes || [],
            dislikes: movieReactions.dislikes || [],
        };
    } catch (error) {
        console.log("Error fetching reactions:", error);
        return { likes: [], dislikes: [], error: "Error fetching reactions" };
    }
}



module.exports = { createReaction, getReactions };
