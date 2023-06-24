import { model, Schema } from 'mongoose'

interface IUser {
  fullName: string,
  email: string,
  passwordHash: string
  avatarUrl: string
}

const UserSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarUrl: String,
}, {
  timestamps: true,
  strict: false
})

const UserModel = model('User', UserSchema)

export default UserModel
