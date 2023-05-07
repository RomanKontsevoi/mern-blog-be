import jwt from 'jsonwebtoken'

export const createToken = (_id) => jwt.sign({
  _id,
}, 'secret123', {
  expiresIn: '30d',
})
