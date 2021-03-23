const router = require('express').Router()
const { AuthenticationController } = require('../controllers/authentication.controller')
const { checkJWT } = require('../middlewares/authentication.middleware')

router.post('/register', AuthenticationController.register)
router.post('/sign-in', AuthenticationController.signIn)
router.get('/profile', checkJWT, AuthenticationController.profile)

module.exports = router
