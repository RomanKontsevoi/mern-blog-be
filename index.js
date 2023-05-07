import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'
import { DB_URL } from './constants/general.js'
import UserModel from './models/User.js'
import { checkAuth, createToken } from './utils/index.js'

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

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const { email, fullName, password, avatarUrl } = req.body

    const sault = await bcrypt.genSalt(10)

    const passwordHash = await bcrypt.hash(password, sault)

    const doc = new UserModel({
      email, fullName, passwordHash, avatarUrl,
    })

    const user = await doc.save()

    const token = createToken(user._id)

    // eslint-disable-next-line
    const { passwordHash: ph, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось зарегистрироваться',
      })
  }
})
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({
      email,
    })

    if (!user) {
      return res.status(404).json({
        messge: 'Неверный логин или пароль',
      })
    }

    const isValidPass = await bcrypt
      .compare(password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        messge: 'Неверный логин или пароль',
      })
    }

    const token = createToken(user._id)

    // eslint-disable-next-line
    const { passwordHash: ph, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось авторизоваться',
      })
  }
})

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      })
    }

    // eslint-disable-next-line
    const { passwordHash: ph, ...userData } = user._doc

    res.json(userData)
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Нет доступа',
      })
  }
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server OK')
})
