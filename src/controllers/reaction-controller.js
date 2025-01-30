const { createReaction , getReactions} = require('../models/reaction-model')

module.exports = {
    async addReaction(req, res, next) {
        const { userId, reactionType, movieId } = req.body;

        // Ensure all required fields are present
        if (!userId || !reactionType || !movieId) {
            return res.status(400).json({
                message: "User ID, movie ID, and reaction type are required.",
            });
        }

        // Validate the reaction type
        if (!["like", "dislike"].includes(reactionType)) {
            return res.status(400).json({
                message: "Invalid reaction type. Must be 'like' or 'dislike'.",
            });
        }

        try {
            // Save reaction to the database
            const result = await createReaction({ userId, movieId, reactionType });

            return res.status(200).json({
                message: "Reaction saved successfully.",
                data: result,
            });
        } catch (error) {
            console.error("Error in addReaction:", error.message);
            return res.status(500).json({
                message: "Failed to save the reaction to the database.",
                error: error.message,
            });
        }
    },
    async getReactions(req, res, next) {
        const { movieId } = req.params;

        try {
            const reactions = await getReactions({ movieId });
            res.status(200).json({
                message: "successful",
                data: reactions,
            })
        } catch(error) {
            res.status(500).json({
                message: "Failed to fetch reactions",
                error,
            })
        }
    }
}
