const { addComment, updateComment, deleteComment, getComments } = require('../models/comment-model');

module.exports = {
    async addComment(req, res, next) {
        const { userId, movieId, content, name } = req.body;

        if (!userId || !movieId || !content) {
            return res.status(400).json({
                message: "User ID, movie ID, and content are required.",
            });
        }
        try {
            const result = await addComment({ userId, movieId, content, name });
            return res.status(200).json({
                message: "Comment added successfully",
                data: result,
            });
        } catch (error) {
            console.log("Error in addComment:", error)
            return res.status(500).json({
                message: "Failed to add comment.",
                error: error.message,
            });
        }
    },

    async updateComment(req, res) {
        const { userId, movieId, content } = req.body;
    
        if (!userId || !movieId || !content) {
            return res.status(400).json({
                message: "User ID, movie ID, and content are required.",
            });
        }
    
        try {
            const result = await updateComment({ userId, movieId, content });
    
            if (result.error) {
                return res.status(403).json({ message: result.error });
            }
    
            return res.status(200).json({
                message: "Comment updated successfully",
                data: result,
            });
        } catch (error) {
            console.log("Error updating comment", error);
            return res.status(500).json({
                message: "Failed to update comment",
                error,
            });
        }
    },
    

    async deleteComment(req, res) {
        const { userId, movieId } = req.body;
    
        if (!userId || !movieId) {
            return res.status(400).json({
                message: "User ID and movie ID are required.",
            });
        }
    
        try {
            const result = await deleteComment({ userId, movieId });
    
            if (result.error) {
                return res.status(403).json({ message: result.error });
            }
    
            return res.status(200).json({
                message: "Comment deleted successfully",
                data: result,
            });
        } catch (error) {
            console.log("Error in deleteComment:", error);
            return res.status(500).json({
                message: "Failed to delete comment.",
                error,
            });
        }
    },
    

    async getComments(req, res, next) {
        console.log("Received Request Params:", req.params); // Debugging
        console.log("Full Request URL:", req.originalUrl)
        const { movieId } = req.params;
        if (!movieId) {
            return res.status(400).json({
                error: "Movie ID is required",
            });
        }
        try {
            const comments = await getComments({ movieId });
            return res.status(200).json({
                message: "Comments fetched successfully",
                data: comments
            });
        } catch (error) {
            console.log("Error in getComments:", error);
            return res.status(500).json({
                message: "Failed to fetch comments.",
                error,
            });
        }
    },
};