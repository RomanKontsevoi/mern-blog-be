import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'
import { DB_URL } from './constants/general.js'

console.log(DB_URL)

mongoose
  .connect(DB_URL)
  .then(() => console.log('DB OK'))
  .catch((error) => console.log('DB error:', error))
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/auth/register', registerValidation, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  res.json({
    success: true,
  })
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
