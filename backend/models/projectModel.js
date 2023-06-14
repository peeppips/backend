import mongoose from 'mongoose'


const projectSchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      projectType:{
        type:String
      },
      apiKeyDeriv:{
        type:String
      },  
      mkt:{
        type:String
      },  
      lotSize:{
        type:String
      }, 
      stopLoss:{
        type:String
      },  
      takeProfit:{
        type:String
      },   
    name:{
      type:String
    },
  },
  {
    timestamps: true,
  }
)

const Project = mongoose.model('Project', projectSchema)

export default Project
