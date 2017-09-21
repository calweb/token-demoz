const jwt = require('jsonwebtoken')
const moment = require('moment')

function createToken (userData) {
  const payload = {
    sub: userData.username,
    iat: moment().unix(),
    exp: moment().add(4, 'hours').unix(),
    username: userData.username,
    name: userData.name
  }

  return jwt.sign(payload, process.env.TOKEN_SECRET)
}

function ensureAuthenticated (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: 'You are not allowed here, seat taken!' })
  }
  // Authorization: Bearer <header.payload.verifySig>
  const token = req.headers.authorization.split(' ')[1]
  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
      if (err) {
        res
          .status(401)
          .json({ message: 'Sorry, token has expired!', error: err })
      }
      req.user = payload.sub
      next()
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
// make our createToken(data)
// make our middlware that protects our endpoints/routes
module.exports = { createToken, ensureAuthenticated }
