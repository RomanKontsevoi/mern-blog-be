import express from 'express'
import mongoose from 'mongoose'

import { registerValidation } from './validations/auth.js'
import { DB_URL } from './constants/general.js'
import { checkAuth } from './utils/index.js'
import { getUserData, login, register } from './controllers/index.js'

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB OK'))
  .catch((error) => console.log('DB error:', error))
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/auth/register', registerValidation, register)
app.post('/auth/login', login)
app.get('/auth/me', checkAuth, getUserData)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server OK')
})
