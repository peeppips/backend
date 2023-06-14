import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const referalSchema = mongoose.Schema(
  {
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: false,
    },
    project:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    paymentDetails: {
      type: String,
      required: true,
      // unique: true,
    }
  },
  {
    timestamps: true,
  }
)



const Referal = mongoose.model('Referal', referalSchema)

export default Referal
