const jwt = require('jsonwebtoken')
const responseFormatter = require('../../helpers/response-formatter')
const UserService = require('../services/user.service')

const invalidTokenResponse = () => (res.status(401).json(responseFormatter(false, 'invalid token')))
const checkJWT = async (req, res, next) => {
  if (!req.headers.authorization) res.status(401).json(responseFormatter(false, 'unauthorized'))

  try {
    const [type, token] = req.headers.authorization.split(' ')
    if (type !== 'Bearer' || !token) invalidTokenResponse()
  
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!verifyToken) res.status(401).json(responseFormatter(false, 'unauthorized'))
  
    const decodedToken = jwt.decode(token)
    const user = await UserService.findByEmail(decodedToken.data, true)
  
    req['user'] = user
    next() 
  } catch (error) {
    res.status(401).json(responseFormatter(false, error.message))
  }
}

module.exports = {
  checkJWT
}
