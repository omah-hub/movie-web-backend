const express = require('express')
const ReactionController = require('../controllers/reaction-controller')
// const sessionMiddleware = require('../middlewares/session-middleware')
const router = express.Router()

router.use(express.json())

router.post('/addReaction',ReactionController.addReaction);
router.get('/reactions/:movieId', ReactionController.getReactions)

// Get reactions for a movie
module.exports = router