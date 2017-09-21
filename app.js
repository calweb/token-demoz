const express = require('express')
const bodyParser = require('body-parser')
const { createToken, ensureAuthenticated } = require('./auth')
const app = express()

app.use(bodyParser.json())
app.set('port', process.env.PORT || 8000)

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Welcome to my api!' })
})

// get token
app.post('/login', (req, res) => {
  // use createToken based on data from
  // req.body { username, name }
  const newToken = createToken(req.body)
  res.json({ message: 'Here is your token!', token: newToken })
})

app.get('/protected', ensureAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ message: `Congrats ${req.user}, you made past security!` })
})

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`)
})
