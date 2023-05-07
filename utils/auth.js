import jwt from 'jsonwebtoken'

export const createToken = (_id) => jwt.sign({
  _id,
}, 'secret123', {
  expiresIn: '30d',
})

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '')
    .replace(/Bearer\s?/, '')

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123")

      req.userId = decoded._id
      next()
    } catch (e) {
      return res.status(403).json({
        message: "Нет доступа"
      })
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа"
    })
  }
}
