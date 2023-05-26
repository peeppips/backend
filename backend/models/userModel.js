import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: false,
    },
    profile_pic:{
      type:String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userLocation: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerfied: {
      type: Boolean,
      required: true,
      default: false,
    },
    accountNumber:{
      type:String,
      required:true,
    },
    accountPassword:{
      type:String,
      required:true,
    },
    broker:{
      type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Broker',
    },
    strategyFile:{
      type:String,
      required:false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
