const express = require('express')

const UserController = require('../controllers/user-controller')
// const userController = require('../controllers/user-controller')
const sessionMiddleware = require('../middlewares/session-middleware')
const router = express.Router()

router.use(express.json())



router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post("/logout", UserController.logout)
// router.get('/check-session', UserController.checkSession);
// router.get('/dashboard', sessionMiddleware, UserController.getUser)


module.exports = router