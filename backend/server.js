import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import connectDB from './config/db.js'

dotenv.config()


const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())
app.use('/api/users', userRoutes)
app.use('/api/projects',projectRoutes)
app.get('/api/config/open_ai', (req, res) =>
  res.send({
    OPEN_AI_KEY:process.env.OPEN_AI_KEY
  })
)

app.get('/api/config', (req, res) => {
  const config = {
    FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

  res.json(config);
});




const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


  app.get('/', (req, res) => {
    res.send('API is running....')
  })

app.get('/photos/:filename', (req, res) => {
  const filename = req.params.filename;
  const photoPath = path.join(__dirname, '/uploads', filename);

  res.sendFile(photoPath);
});


app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const photoPath = path.join(__dirname, '/uploads', filename);

  res.sendFile(photoPath);
});

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 6000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
