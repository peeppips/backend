import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'


dotenv.config()


const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

Bugsnag.start({
  apiKey: process.env.BUGNAG_API,
  plugins: [BugsnagPluginExpress]
})

const middleware = Bugsnag.getPlugin('express')

// This must be the first piece of middleware in the stack.
// It can only capture errors in downstream middleware
// app.use(middleware.requestHandler)

/* all other middleware and application routes go here */

// This handles any errors that Express catches. This needs to go before other
// error handlers. BugSnag will call the `next` error handler if it exists.
// app.use(middleware.errorHandler)
app.use(express.json())
app.use(cors())
app.use('/api/users', userRoutes)
app.use('/api/projects',projectRoutes)
app.use('/api/upload', uploadRoutes)

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
