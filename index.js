import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'

const DB_URL = `mongodb+srv://${
  process.env.DB_LOGIN
}:${
  process.env.DB_PASSWORD
}@fullstackcourse.4jkmwge.mongodb.net/?retryWrites=true&w=majority`

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB OK'))
  .catch((error) => console.log('DB error:', error))
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/auth/login', (req, res) => {
  console.log(req.body)

  const { email } = req.body

  const token = jwt.sign({
    email,
    fullName: 'Иван Сусанин',
  }, 'secret123')

  res.json({
    success: true,
    token,
  })
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server OK')
})
