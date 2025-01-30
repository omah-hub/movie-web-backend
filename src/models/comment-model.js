const { run, dbConfig } = require('../database/connection')

async function addComment({ userId, movieId, name, content }) {
    const timestamp = new Date();
    console.log("Adding comment for userId:", userId, "movieId:", movieId);

    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.commentCollection);

        // Check if the user has already commented on this movie
        const existingComment = await collection.findOne({
            movieId,
            "comments.user_id": userId,
        });

        if (existingComment) {
            throw new Error("User has already commented on this movie.");
        }

        // Add the new comment
        const result = await collection.updateOne(
            { movieId },
            {
                $push: {
                    comments: {
                        user_id: userId,
                        name,
                        content,
                        createdAt: timestamp,
                    },
                },
            },
            { upsert: true }
        );

        console.log("Comment added successfully:", result);
        return result;
    } catch (error) {
        console.log("Error in addComment:", error.message);
        throw new Error(error.message || "Failed to add comment.");
    }
}


async function updateComment({ userId, movieId, content }) {
    const timestamp = new Date();

    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.commentCollection);
        const movieIdNumber = parseInt(movieId, 10);

        // Fetch the comment to validate ownership
        const comment = await collection.findOne({
            movieId: movieIdNumber,
            "comments.user_id": userId,
        });

        if (!comment) {
            return { error: "You don't have permission to edit this comment." };
        }

        const result = await collection.updateOne(
            {
                movieId: movieIdNumber,
                "comments.user_id": userId,
            },
            {
                $set: {
                    "comments.$.content": content,
                    "comments.$.updatedAt": timestamp,
                },
            }
        );

        console.log("Comment updated successfully:", result);
        return result;
    } catch (error) {
        console.log("Error in updateComment:", error);
        throw error;
    }
}

async function deleteComment({ userId, movieId }) {
    console.log("Deleting comment for userId:", userId, "movieId:", movieId);

    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.commentCollection);
        const movieIdNumber = parseInt(movieId, 10);

        // Fetch the comment to validate ownership
        const comment = await collection.findOne({
            movieId: movieIdNumber,
            "comments.user_id": userId,
        });

        if (!comment) {
            return { error: "You don't have permission to delete this comment." };
        }

        const result = await collection.updateOne(
            { movieId: movieIdNumber },
            {
                $pull: {
                    comments: { user_id: userId },
                },
            }
        );

        console.log("Comment deleted successfully:", result);
        return result;
    } catch (error) {
        console.log("Error in deleteComment:", error);
        throw error;
    }
}

async function getComments({ movieId }) {
    console.log("Fetching comments for movieId:", movieId);
    
    try {
        const { db } = await run();
        const collection = db.collection(dbConfig.commentCollection);
        const movieIdNumber = parseInt(movieId, 10);
        const movie = await collection.findOne(
            { movieId: movieIdNumber },
            { projection: { comments: 1 , name: 1 }}
        );
        console.log("Comments fetched successfully:", movie?.comments || [])
        return movie?.comments || [];
    } catch (error) {
        console.log("Error in getComments:", error);
        return error
    }
}

module.exports = { addComment, updateComment, deleteComment, getComments };