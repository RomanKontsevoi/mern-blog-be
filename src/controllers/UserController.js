import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import UserModel from '../../models/User.js'
import { createToken } from '../../utils/index.js'

export const register = async (req, res) => {
  try {
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
}

export const login = async (req, res) => {
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
}

export const getMe = async (req, res) => {
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
}
